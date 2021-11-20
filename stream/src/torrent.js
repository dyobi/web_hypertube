const addrToIPPort = require('addr-to-ip-port');
const BitField = require('bitfield');
const Discovery = require('torrent-discovery');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const FSChunkStore = require('fs-chunk-store');
const ImmediateChunkStore = require('immediate-chunk-store');
const net = require('net');
const parallel = require('run-parallel');
const parallelLimit = require('run-parallel-limit');
const parseTorrent = require('parse-torrent');
const path = require('path');
const Piece = require('torrent-piece');
const randomIterate = require('random-iterate');
const sha1 = require('simple-sha1');
const uniq = require('uniq');
const utMetadata = require('ut_metadata');
const utPex = require('ut_pex');
const parseRange = require('parse-numeric-range');

const File = require('./file');
const Peer = require('./peer');

const MAX_BLOCK_LENGTH = 128 * 1024;
const PIECE_TIMEOUT = 30000;
const CHOKE_TIMEOUT = 5000;
const SPEED_THRESHOLD = 3 * Piece.BLOCK_LENGTH;
const PIPELINE_MIN_DURATION = 0.5;
const PIPELINE_MAX_DURATION = 1;
const RECHOKE_INTERVAL = 10000;
const RECHOKE_OPTIMISTIC_DURATION = 2;
const FILESYSTEM_CONCURRENCY = process.browser ? Infinity : 2;
const RECONNECT_WAIT = [1000, 5000, 15000];

class Torrent extends EventEmitter {
	constructor(torrentId, client) {
		super();

		this.client = client;
		this.path = path.join(__dirname, '..', 'public', 'video');
		this._store = FSChunkStore;
		this.strategy = 'sequential';
		this.maxWebConns = 4;
		this._rechokeNumSlots = 10;
		this._rechokeOptimisticWire = null;
		this._rechokeOptimisticTime = 0;
		this._rechokeIntervalId = null;

		this.ready = false;
		this.destroyed = false;
		this.paused = false;
		this.done = false;

		this.metadata = null;
		this.store = null;
		this.files = [];
		this.pieces = [];

		this._amInterested = false;
		this._selections = [];
		this._critical = [];

		this.wires = [];

		this._queue = [];
		this._peers = {};
		this._peersLength = 0;

		this._servers = [];
		this._xsRequests = [];

		if (torrentId !== null) this._onTorrentId(torrentId);
	}

	get downloaded() {
		if (!this.bitfield) return 0;
		let downloaded = 0;
		for (let index = 0, len = this.pieces.length; index < len; ++index) {
			if (this.bitfield.get(index)) {
				downloaded +=
					index === len - 1 ? this.lastPieceLength : this.pieceLength;
			} else {
				const piece = this.pieces[index];
				downloaded += piece.length - piece.missing;
			}
		}
		return downloaded;
	}

	get _numQueued() {
		return this._queue.length + (this._peersLength - this._numConns);
	}

	get _numConns() {
		let numConns = 0;
		for (const id in this._peers) {
			if (this._peers[id].connected) numConns += 1;
		}
		return numConns;
	}

	_onTorrentId(torrentId) {
		if (this.destroyed) return;

		let parsedTorrent;
		try {
			parsedTorrent = parseTorrent(torrentId);
		} catch (err) {}
		if (parsedTorrent) {
			this.infoHash = parsedTorrent.infoHash;
			process.nextTick(() => {
				if (this.destroyed) return;
				this._onParsedTorrent(parsedTorrent);
			});
		} else {
			parseTorrent.remote(torrentId, (err, parsedTorrent) => {
				if (this.destroyed) return;
				if (err) return this._destroy(err);
				this._onParsedTorrent(parsedTorrent);
			});
		}
	}

	_onParsedTorrent(parsedTorrent) {
		if (this.destroyed) return;

		this._processParsedTorrent(parsedTorrent);

		if (!this.infoHash) {
			return this._destroy(
				new Error('Malformed torrent data: No info hash')
			);
		}

		this._rechokeIntervalId = setInterval(() => {
			this._rechoke();
		}, RECHOKE_INTERVAL);
		if (this._rechokeIntervalId.unref) this._rechokeIntervalId.unref();

		this.emit('_infoHash', this.infoHash);
		if (this.destroyed) return;

		this.emit('infoHash', this.infoHash);
		if (this.destroyed) return;

		if (this.client.listening) {
			this._onListening();
		} else {
			this.client.once('listening', () => {
				this._onListening();
			});
		}
	}

	_processParsedTorrent(parsedTorrent) {
		if (this.announce) {
			parsedTorrent.announce = parsedTorrent.announce.concat(
				this.announce
			);
		}

		if (
			this.client.tracker &&
			global.WEBTORRENT_ANNOUNCE &&
			!this.private
		) {
			parsedTorrent.announce = parsedTorrent.announce.concat(
				global.WEBTORRENT_ANNOUNCE
			);
		}

		if (this.urlList) {
			parsedTorrent.urlList = parsedTorrent.urlList.concat(this.urlList);
		}

		uniq(parsedTorrent.announce);
		uniq(parsedTorrent.urlList);

		Object.assign(this, parsedTorrent);

		this.magnetURI = parseTorrent.toMagnetURI(parsedTorrent);
		this.torrentFile = parseTorrent.toTorrentFile(parsedTorrent);
	}

	_onListening() {
		if (this.destroyed) return;

		if (this.info) {
			this._onMetadata(this);
		} else {
			this._startDiscovery();
		}
	}

	_startDiscovery() {
		if (this.discovery || this.destroyed) return;

		let trackerOpts = this.client.tracker;
		if (trackerOpts) {
			trackerOpts = Object.assign({}, this.client.tracker, {
				getAnnounceOpts: () => {
					const opts = {
						uploaded: this.uploaded,
						downloaded: this.downloaded,
						left: Math.max(this.length - this.downloaded, 0)
					};
					if (this.client.tracker.getAnnounceOpts) {
						Object.assign(
							opts,
							this.client.tracker.getAnnounceOpts()
						);
					}
					if (this._getAnnounceOpts) {
						Object.assign(opts, this._getAnnounceOpts());
					}
					return opts;
				}
			});
		}

		this.discovery = new Discovery({
			infoHash: this.infoHash,
			announce: this.announce,
			peerId: this.client.peerId,
			dht: !this.private && this.client.dht,
			tracker: trackerOpts,
			port: this.client.torrentPort,
			userAgent: 'HyperTube'
		});

		this.discovery.on('peer', peer => {
			if (typeof peer === 'string' && this.done) return;
			this.addPeer(peer);
		});
	}

	_onMetadata(metadata) {
		if (this.metadata || this.destroyed) return;

		this._xsRequests.forEach(req => {
			req.abort();
		});
		this._xsRequests = [];

		let parsedTorrent;
		if (metadata && metadata.infoHash) {
			parsedTorrent = metadata;
		} else {
			try {
				parsedTorrent = parseTorrent(metadata);
			} catch (err) {
				return this._destroy(err);
			}
		}

		this._processParsedTorrent(parsedTorrent);
		this.metadata = this.torrentFile;

		this.store = new ImmediateChunkStore(
			new this._store(this.pieceLength, {
				torrent: {
					infoHash: this.infoHash
				},
				files: this.files.map(file => ({
					path: path.join(this.path, file.path),
					length: file.length,
					offset: file.offset
				})),
				length: this.length,
				name: this.infoHash
			})
		);

		this.files = this.files.map(file => new File(this, file));

		if (this.so) {
			const selectOnlyFiles = parseRange.parse(this.so);

			this.files.forEach((v, i) => {
				if (selectOnlyFiles.includes(i)) this.files[i].select(true);
			});
		} else {
			if (this.pieces.length !== 0) {
				this.select(0, this.pieces.length - 1, false);
			}
		}

		this._hashes = this.pieces;

		this.pieces = this.pieces.map((hash, i) => {
			const pieceLength =
				i === this.pieces.length - 1
					? this.lastPieceLength
					: this.pieceLength;
			return new Piece(pieceLength);
		});

		this._reservations = this.pieces.map(() => []);

		this.bitfield = new BitField(this.pieces.length);

		this.wires.forEach(wire => {
			if (wire.ut_metadata) wire.ut_metadata.setMetadata(this.metadata);

			this._onWireWithMetadata(wire);
		});

		this.emit('metadata');

		const onPiecesVerified = err => {
			if (err) return this._destroy(err);
			this._onStore();
		};

		if (this._fileModtimes && this._store === FSChunkStore) {
			this.getFileModtimes((err, fileModtimes) => {
				if (err) return this._destroy(err);

				const unchanged = this.files
					.map(
						(_, index) =>
							fileModtimes[index] === this._fileModtimes[index]
					)
					.every(x => x);

				if (unchanged) {
					this._markAllVerified();
					this._onStore();
				} else {
					this._verifyPieces(onPiecesVerified);
				}
			});
		} else {
			this._verifyPieces(onPiecesVerified);
		}
	}

	getFileModtimes(cb) {
		const ret = [];
		parallelLimit(
			this.files.map((file, index) => cb => {
				fs.stat(path.join(this.path, file.path), (err, stat) => {
					if (err && err.code !== 'ENOENT') return cb(err);
					ret[index] = stat && stat.mtime.getTime();
					cb(null);
				});
			}),
			FILESYSTEM_CONCURRENCY,
			err => {
				cb(err, ret);
			}
		);
	}

	_verifyPieces(cb) {
		parallelLimit(
			this.pieces.map((piece, index) => cb => {
				this.store.get(index, (err, buf) => {
					if (err) return process.nextTick(cb, null);
					sha1(buf, hash => {
						if (hash === this._hashes[index]) {
							if (!this.pieces[index]) return cb(null);
							this._markVerified(index);
						}
						cb(null);
					});
				});
			}),
			FILESYSTEM_CONCURRENCY,
			cb
		);
	}

	_markAllVerified() {
		for (let index = 0; index < this.pieces.length; index++) {
			this._markVerified(index);
		}
	}

	_markVerified(index) {
		this.pieces[index] = null;
		this._reservations[index] = null;
		this.bitfield.set(index, true);
	}

	_onStore() {
		this._startDiscovery();

		this.ready = true;
		this.emit('ready');
		this._checkDone();
		this._updateSelections();
	}

	destroy(err, cb) {
		if (this.destroyed) return;
		this.destroyed = true;

		this.client._remove(this);

		clearInterval(this._rechokeIntervalId);

		this._xsRequests.forEach(req => {
			req.abort();
		});

		for (const id in this._peers) {
			this.removePeer(id);
		}

		this.files.forEach(file => {
			if (file instanceof File) file._destroy();
		});

		const tasks = this._servers.map(server => cb => {
			server.destroy(cb);
		});

		if (this.discovery) {
			tasks.push(cb => {
				this.discovery.destroy(cb);
			});
		}

		if (this.store) {
			tasks.push(cb => {
				this.store.close(cb);
			});
		}

		parallel(tasks, cb);

		if (err) {
			if (this.listenerCount('error') === 0) {
				this.client.emit('error', err);
			} else {
				this.emit('error', err);
			}
		}

		this.emit('close');

		this.client = null;
		this.files = [];
		this.discovery = null;
		this.store = null;
		this._rarityMap = null;
		this._peers = null;
		this._servers = null;
		this._xsRequests = null;
	}

	addPeer(peer) {
		if (this.destroyed) throw new Error('torrent is destroyed');
		if (!this.infoHash)
			throw new Error(
				'addPeer() must not be called before the `infoHash` event'
			);

		if (this.client.blocked) {
			let host;
			if (typeof peer === 'string') {
				let parts;
				try {
					parts = addrToIPPort(peer);
				} catch (e) {
					this.emit('invalidPeer', peer);
					return false;
				}
				host = parts[0];
			} else if (typeof peer.remoteAddress === 'string') {
				host = peer.remoteAddress;
			}

			if (host && this.client.blocked.contains(host)) {
				if (typeof peer !== 'string') peer.destroy();
				this.emit('blockedPeer', peer);
				return false;
			}
		}

		const wasAdded = !!this._addPeer(peer);
		if (wasAdded) {
			this.emit('peer', peer);
		} else {
			this.emit('invalidPeer', peer);
		}
		return wasAdded;
	}

	_addPeer(peer) {
		if (this.destroyed) {
			if (typeof peer !== 'string') peer.destroy();
			return null;
		}
		if (typeof peer === 'string' && !this._validAddr(peer)) {
			return null;
		}

		const id = (peer && peer.id) || peer;
		if (this._peers[id]) {
			if (typeof peer !== 'string') peer.destroy();
			return null;
		}

		if (this.paused) {
			if (typeof peer !== 'string') peer.destroy();
			return null;
		}

		let newPeer;
		if (typeof peer === 'string') {
			newPeer = Peer.createTCPOutgoingPeer(peer, this);
		} else {
			newPeer = Peer.createWebRTCPeer(peer, this);
		}

		this._peers[newPeer.id] = newPeer;
		this._peersLength += 1;

		if (typeof peer === 'string') {
			this._queue.push(newPeer);
			this._drain();
		}

		return newPeer;
	}

	removePeer(peer) {
		const id = (peer && peer.id) || peer;
		peer = this._peers[id];

		if (!peer) return;

		delete this._peers[id];
		this._peersLength -= 1;

		peer.destroy();

		this._drain();
	}

	select(start, end, priority, notify) {
		if (start < 0 || end < start || this.pieces.length <= end) {
			throw new Error(`invalid selection ${start} : ${end}`);
		}
		priority = Number(priority) || 0;

		this._selections.push({
			from: start,
			to: end,
			offset: 0,
			priority,
			notify: notify || (() => {})
		});

		this._selections.sort((a, b) => b.priority - a.priority);

		this._updateSelections();
	}

	deselect(start, end, priority) {
		priority = Number(priority) || 0;

		for (let i = 0; i < this._selections.length; ++i) {
			const s = this._selections[i];
			if (s.from === start && s.to === end && s.priority === priority) {
				this._selections.splice(i, 1);
				break;
			}
		}

		this._updateSelections();
	}

	critical(start, end) {
		for (let i = start; i <= end; ++i) {
			this._critical[i] = true;
		}

		this._updateSelections();
	}

	_onWire(wire, addr) {
		wire.on('download', downloaded => {
			this.received += downloaded;
			this.emit('download', downloaded);
			this.client.emit('download', downloaded);
		});

		this.wires.push(wire);

		if (addr) {
			const parts = addrToIPPort(addr);
			wire.remoteAddress = parts[0];
			wire.remotePort = parts[1];
		}

		if (this.client.dht && this.client.dht.listening) {
			wire.on('port', port => {
				if (this.destroyed || this.client.dht.destroyed) {
					return;
				}

				this.client.dht.addNode({ host: wire.remoteAddress, port });
			});
		}

		wire.on('timeout', () => {
			wire.destroy();
		});

		wire.setTimeout(PIECE_TIMEOUT, true);

		wire.setKeepAlive(true);

		wire.use(utMetadata(this.metadata));

		if (!this.metadata) {
			wire.ut_metadata.on('metadata', metadata => {
				this._onMetadata(metadata);
			});
			wire.ut_metadata.fetch();
		}

		if (typeof utPex === 'function' && !this.private) {
			wire.use(utPex());

			wire.ut_pex.on('peer', peer => {
				if (this.done) return;
				this.addPeer(peer);
			});

			wire.ut_pex.on('dropped', peer => {
				const peerObj = this._peers[peer];
				if (peerObj && !peerObj.connected) {
					this.removePeer(peer);
				}
			});

			wire.once('close', () => {
				wire.ut_pex.reset();
			});
		}

		this.emit('wire', wire, addr);

		if (this.metadata) {
			process.nextTick(() => {
				this._onWireWithMetadata(wire);
			});
		}
	}

	_onWireWithMetadata(wire) {
		let timeoutId = null;

		const onChokeTimeout = () => {
			if (this.destroyed || wire.destroyed) return;

			if (
				this._numQueued > 2 * (this._numConns - this.numPeers) &&
				wire.amInterested
			) {
				wire.destroy();
			} else {
				timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT);
				if (timeoutId.unref) timeoutId.unref();
			}
		};

		let i;
		const updateSeedStatus = () => {
			if (wire.peerPieces.buffer.length !== this.bitfield.buffer.length)
				return;
			for (i = 0; i < this.pieces.length; ++i) {
				if (!wire.peerPieces.get(i)) return;
			}
			wire.isSeeder = true;
			wire.choke();
		};

		wire.on('bitfield', () => {
			updateSeedStatus();
			this._update();
		});

		wire.on('have', () => {
			updateSeedStatus();
			this._update();
		});

		wire.once('interested', () => {
			wire.unchoke();
		});

		wire.once('close', () => {
			clearTimeout(timeoutId);
		});

		wire.on('choke', () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT);
			if (timeoutId.unref) timeoutId.unref();
		});

		wire.on('unchoke', () => {
			clearTimeout(timeoutId);
			this._update();
		});

		wire.on('request', (index, offset, length, cb) => {
			if (length > MAX_BLOCK_LENGTH) {
				return wire.destroy();
			}
			if (this.pieces[index]) return;
			this.store.get(index, { offset, length }, cb);
		});

		wire.bitfield(this.bitfield);
		wire.uninterested();

		if (
			wire.peerExtensions.dht &&
			this.client.dht &&
			this.client.dht.listening
		) {
			wire.port(this.client.dht.address().port);
		}

		if (wire.type !== 'webSeed') {
			timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT);
			if (timeoutId.unref) timeoutId.unref();
		}

		wire.isSeeder = false;
		updateSeedStatus();
	}

	_updateSelections() {
		if (!this.ready || this.destroyed) return;

		process.nextTick(() => {
			this._gcSelections();
		});
		this._updateInterest();
		this._update();
	}

	_gcSelections() {
		for (let i = 0; i < this._selections.length; ++i) {
			const s = this._selections[i];
			const oldOffset = s.offset;

			while (
				this.bitfield.get(s.from + s.offset) &&
				s.from + s.offset < s.to
			) {
				s.offset += 1;
			}

			if (oldOffset !== s.offset) s.notify();
			if (s.to !== s.from + s.offset) continue;
			if (!this.bitfield.get(s.from + s.offset)) continue;

			this._selections.splice(i, 1);
			i -= 1;

			s.notify();
			this._updateInterest();
		}

		if (!this._selections.length) this.emit('idle');
	}

	_updateInterest() {
		const prev = this._amInterested;
		this._amInterested = !!this._selections.length;

		this.wires.forEach(wire => {
			let interested = false;
			for (let index = 0; index < this.pieces.length; ++index) {
				if (this.pieces[index] && wire.peerPieces.get(index)) {
					interested = true;
					break;
				}
			}

			if (interested) wire.interested();
			else wire.uninterested();
		});

		if (prev === this._amInterested) return;
		if (this._amInterested) this.emit('interested');
		else this.emit('uninterested');
	}

	_update() {
		if (this.destroyed) return;

		const ite = randomIterate(this.wires);
		let wire;
		while ((wire = ite())) {
			this._updateWireWrapper(wire);
		}
	}

	_updateWireWrapper(wire) {
		const self = this;

		if (
			typeof window !== 'undefined' &&
			typeof window.requestIdleCallback === 'function'
		) {
			window.requestIdleCallback(
				function() {
					self._updateWire(wire);
				},
				{ timeout: 250 }
			);
		} else {
			self._updateWire(wire);
		}
	}

	_updateWire(wire) {
		const self = this;

		if (wire.peerChoking) return;
		if (!wire.downloaded) return validateWire();

		const minOutstandingRequests = getBlockPipelineLength(
			wire,
			PIPELINE_MIN_DURATION
		);
		if (wire.requests.length >= minOutstandingRequests) return;
		const maxOutstandingRequests = getBlockPipelineLength(
			wire,
			PIPELINE_MAX_DURATION
		);

		trySelectWire(false) || trySelectWire(true);

		function genPieceFilterFunc(start, end, tried, rank) {
			return i =>
				i >= start &&
				i <= end &&
				!(i in tried) &&
				wire.peerPieces.get(i) &&
				(!rank || rank(i));
		}

		function validateWire() {
			if (wire.requests.length) return;

			let i = self._selections.length;
			while (i--) {
				const next = self._selections[i];
				let piece;
				if (self.strategy === 'rarest') {
					const start = next.from + next.offset;
					const end = next.to;
					const len = end - start + 1;
					const tried = {};
					let tries = 0;
					const filter = genPieceFilterFunc(start, end, tried);

					while (tries < len) {
						piece = self._rarityMap.getRarestPiece(filter);
						if (piece < 0) break;
						if (self._request(wire, piece, false)) return;
						tried[piece] = true;
						tries += 1;
					}
				} else {
					for (
						piece = next.to;
						piece >= next.from + next.offset;
						--piece
					) {
						if (!wire.peerPieces.get(piece)) continue;
						if (self._request(wire, piece, false)) return;
					}
				}
			}
		}

		function speedRanker() {
			const speed = wire.downloadSpeed() || 1;
			if (speed > SPEED_THRESHOLD) return () => true;

			const secs =
				(Math.max(1, wire.requests.length) * Piece.BLOCK_LENGTH) /
				speed;
			let tries = 10;
			let ptr = 0;

			return index => {
				if (!tries || self.bitfield.get(index)) return true;

				let missing = self.pieces[index].missing;

				for (; ptr < self.wires.length; ptr++) {
					const otherWire = self.wires[ptr];
					const otherSpeed = otherWire.downloadSpeed();

					if (otherSpeed < SPEED_THRESHOLD) continue;
					if (otherSpeed <= speed) continue;
					if (!otherWire.peerPieces.get(index)) continue;
					if ((missing -= otherSpeed * secs) > 0) continue;

					tries--;
					return false;
				}

				return true;
			};
		}

		function shufflePriority(i) {
			let last = i;
			for (
				let j = i;
				j < self._selections.length && self._selections[j].priority;
				j++
			) {
				last = j;
			}
			const tmp = self._selections[i];
			self._selections[i] = self._selections[last];
			self._selections[last] = tmp;
		}

		function trySelectWire(hotswap) {
			if (wire.requests.length >= maxOutstandingRequests) return true;
			const rank = speedRanker();

			for (let i = 0; i < self._selections.length; i++) {
				const next = self._selections[i];

				let piece;
				if (self.strategy === 'rarest') {
					const start = next.from + next.offset;
					const end = next.to;
					const len = end - start + 1;
					const tried = {};
					let tries = 0;
					const filter = genPieceFilterFunc(start, end, tried, rank);

					while (tries < len) {
						piece = self._rarityMap.getRarestPiece(filter);
						if (piece < 0) break;

						while (
							self._request(
								wire,
								piece,
								self._critical[piece] || hotswap
							)
						) {}

						if (wire.requests.length < maxOutstandingRequests) {
							tried[piece] = true;
							tries++;
							continue;
						}

						if (next.priority) shufflePriority(i);
						return true;
					}
				} else {
					for (
						piece = next.from + next.offset;
						piece <= next.to;
						piece++
					) {
						if (!wire.peerPieces.get(piece) || !rank(piece))
							continue;

						while (
							self._request(
								wire,
								piece,
								self._critical[piece] || hotswap
							)
						) {}

						if (wire.requests.length < maxOutstandingRequests)
							continue;

						if (next.priority) shufflePriority(i);
						return true;
					}
				}
			}

			return false;
		}
	}

	_rechoke() {
		if (!this.ready) return;

		if (this._rechokeOptimisticTime > 0) this._rechokeOptimisticTime -= 1;
		else this._rechokeOptimisticWire = null;

		const peers = [];

		this.wires.forEach(wire => {
			if (!wire.isSeeder && wire !== this._rechokeOptimisticWire) {
				peers.push({
					wire,
					downloadSpeed: wire.downloadSpeed(),
					uploadSpeed: wire.uploadSpeed(),
					salt: Math.random(),
					isChoked: true
				});
			}
		});

		peers.sort(rechokeSort);

		let unchokeInterested = 0;
		let i = 0;
		for (
			;
			i < peers.length && unchokeInterested < this._rechokeNumSlots;
			++i
		) {
			peers[i].isChoked = false;
			if (peers[i].wire.peerInterested) unchokeInterested += 1;
		}

		if (
			!this._rechokeOptimisticWire &&
			i < peers.length &&
			this._rechokeNumSlots
		) {
			const candidates = peers
				.slice(i)
				.filter(peer => peer.wire.peerInterested);
			const optimistic = candidates[(Math.random() * candidates.length) | 0];

			if (optimistic) {
				optimistic.isChoked = false;
				this._rechokeOptimisticWire = optimistic.wire;
				this._rechokeOptimisticTime = RECHOKE_OPTIMISTIC_DURATION;
			}
		}

		peers.forEach(peer => {
			if (peer.wire.amChoking !== peer.isChoked) {
				if (peer.isChoked) peer.wire.choke();
				else peer.wire.unchoke();
			}
		});

		function rechokeSort(peerA, peerB) {
			if (peerA.downloadSpeed !== peerB.downloadSpeed) {
				return peerB.downloadSpeed - peerA.downloadSpeed;
			}

			if (peerA.uploadSpeed !== peerB.uploadSpeed) {
				return peerB.uploadSpeed - peerA.uploadSpeed;
			}

			if (peerA.wire.amChoking !== peerB.wire.amChoking) {
				return peerA.wire.amChoking ? 1 : -1;
			}

			return peerA.salt - peerB.salt;
		}
	}

	_hotswap(wire, index) {
		const speed = wire.downloadSpeed();
		if (speed < Piece.BLOCK_LENGTH) return false;
		if (!this._reservations[index]) return false;

		const r = this._reservations[index];
		if (!r) {
			return false;
		}

		let minSpeed = Infinity;
		let minWire;

		let i;
		for (i = 0; i < r.length; i++) {
			const otherWire = r[i];
			if (!otherWire || otherWire === wire) continue;

			const otherSpeed = otherWire.downloadSpeed();
			if (otherSpeed >= SPEED_THRESHOLD) continue;
			if (2 * otherSpeed > speed || otherSpeed > minSpeed) continue;

			minWire = otherWire;
			minSpeed = otherSpeed;
		}

		if (!minWire) return false;

		for (i = 0; i < r.length; i++) {
			if (r[i] === minWire) r[i] = null;
		}

		for (i = 0; i < minWire.requests.length; i++) {
			const req = minWire.requests[i];
			if (req.piece !== index) continue;

			this.pieces[index].cancel((req.offset / Piece.BLOCK_LENGTH) | 0);
		}

		this.emit('hotswap', minWire, wire, index);
		return true;
	}

	_request(wire, index, hotswap) {
		const self = this;
		const numRequests = wire.requests.length;
		const isWebSeed = wire.type === 'webSeed';

		if (self.bitfield.get(index)) return false;

		const maxOutstandingRequests = isWebSeed
			? Math.min(
					getPiecePipelineLength(
						wire,
						PIPELINE_MAX_DURATION,
						self.pieceLength
					),
					self.maxWebConns
			  )
			: getBlockPipelineLength(wire, PIPELINE_MAX_DURATION);

		if (numRequests >= maxOutstandingRequests) return false;

		const piece = self.pieces[index];
		let reservation = isWebSeed
			? piece.reserveRemaining()
			: piece.reserve();

		if (reservation === -1 && hotswap && self._hotswap(wire, index)) {
			reservation = isWebSeed
				? piece.reserveRemaining()
				: piece.reserve();
		}
		if (reservation === -1) return false;

		let r = self._reservations[index];
		if (!r) r = self._reservations[index] = [];
		let i = r.indexOf(null);
		if (i === -1) i = r.length;
		r[i] = wire;

		const chunkOffset = piece.chunkOffset(reservation);
		const chunkLength = isWebSeed
			? piece.chunkLengthRemaining(reservation)
			: piece.chunkLength(reservation);

		wire.request(index, chunkOffset, chunkLength, function onChunk(
			err,
			chunk
		) {
			if (self.destroyed) return;

			if (!self.ready)
				return self.once('ready', () => {
					onChunk(err, chunk);
				});

			if (r[i] === wire) r[i] = null;

			if (piece !== self.pieces[index]) return onUpdateTick();

			if (err) {
				isWebSeed
					? piece.cancelRemaining(reservation)
					: piece.cancel(reservation);
				onUpdateTick();
				return;
			}

			if (!piece.set(reservation, chunk, wire)) return onUpdateTick();

			const buf = piece.flush();

			sha1(buf, hash => {
				if (self.destroyed) return;

				if (hash === self._hashes[index]) {
					if (!self.pieces[index]) return;

					self.pieces[index] = null;
					self._reservations[index] = null;
					self.bitfield.set(index, true);

					self.store.put(index, buf);

					self.wires.forEach(wire => {
						wire.have(index);
					});

					if (self._checkDone() && !self.destroyed)
						self.discovery.complete();
				} else {
					self.pieces[index] = new Piece(piece.length);
					self.emit(
						'warning',
						new Error(`Piece ${index} failed verification`)
					);
				}
				onUpdateTick();
			});
		});

		function onUpdateTick() {
			process.nextTick(() => {
				self._update();
			});
		}

		return true;
	}

	_checkDone() {
		if (this.destroyed) return;

		this.files.forEach(file => {
			if (file.done) return;
			for (let i = file._startPiece; i <= file._endPiece; ++i) {
				if (!this.bitfield.get(i)) return;
			}
			file.done = true;
			file.emit('done');
		});

		let done = true;
		for (let i = 0; i < this._selections.length; i++) {
			const selection = this._selections[i];
			for (let piece = selection.from; piece <= selection.to; piece++) {
				if (!this.bitfield.get(piece)) {
					done = false;
					break;
				}
			}
			if (!done) break;
		}
		if (!this.done && done) {
			this.done = true;
			this.emit('done');
		}
		this._gcSelections();

		return done;
	}

	_drain() {
		if (
			typeof net.connect !== 'function' ||
			this.destroyed ||
			this.paused ||
			this._numConns >= this.client.maxConns
		) {
			return;
		}

		const peer = this._queue.shift();
		if (!peer) return;

		const parts = addrToIPPort(peer.addr);
		const opts = {
			host: parts[0],
			port: parts[1]
		};

		const conn = (peer.conn = net.connect(opts));

		conn.once('connect', () => {
			peer.onConnect();
		});
		conn.once('error', err => {
			peer.destroy(err);
		});
		peer.startConnectTimeout();

		conn.on('close', () => {
			if (this.destroyed) return;

			if (peer.retries >= RECONNECT_WAIT.length) {
				return;
			}

			const ms = RECONNECT_WAIT[peer.retries];

			const reconnectTimeout = setTimeout(() => {
				const newPeer = this._addPeer(peer.addr);
				if (newPeer) newPeer.retries = peer.retries + 1;
			}, ms);
			if (reconnectTimeout.unref) reconnectTimeout.unref();
		});
	}

	_validAddr(addr) {
		let parts;
		try {
			parts = addrToIPPort(addr);
		} catch (e) {
			return false;
		}
		const host = parts[0];
		const port = parts[1];
		return (
			port > 0 &&
			port < 65535 &&
			!(host === '127.0.0.1' && port === this.client.torrentPort)
		);
	}
}

function getBlockPipelineLength(wire, duration) {
	return (
		2 + Math.ceil((duration * wire.downloadSpeed()) / Piece.BLOCK_LENGTH)
	);
}

function getPiecePipelineLength(wire, duration, pieceLength) {
	return 1 + Math.ceil((duration * wire.downloadSpeed()) / pieceLength);
}

module.exports = Torrent;
