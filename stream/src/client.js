const { EventEmitter } = require('events');
const DHT = require('bittorrent-dht/client');
const parseTorrent = require('parse-torrent');
const randombytes = require('randombytes');

const TCPPool = require('./tcp-pool');
const Torrent = require('./torrent');

class Client extends EventEmitter {
	constructor() {
		super();

		this.peerId = randombytes(20).toString('hex');
		this.peerIdBuffer = Buffer.from(this.peerId, 'hex');

		this.nodeId = randombytes(20).toString('hex');
		this.nodeIdBuffer = Buffer.from(this.nodeId, 'hex');

		this.destroyed = false;
		this.listening = false;

		this.torrentPort = 0;
		this.dhtPort = 0;
		this.tracker = {};
		this.torrents = [];
		this.maxConns = 55;

		this._tcpPool = new TCPPool(this);
		this.dht = new DHT(Object.assign({}, { nodeId: this.nodeId }));
		this.dht.once('listening', () => {
			const address = this.dht.address();
			if (address) this.dhtPort = address.port;
		});
		this.dht.setMaxListeners(0);
		this.dht.listen(this.dhtPort);
		this.enableWebSeeds = true;

		const ready = () => {
			if (this.destroyed) return;
			this.ready = true;
			this.emit('ready');
		};

		process.nextTick(ready);
	}

	get(torrentId) {
		if (torrentId instanceof Torrent) {
			if (this.torrents.includes(torrentId)) return torrentId;
		} else {
			let parsed;
			try {
				parsed = parseTorrent(torrentId);
			} catch (err) {}

			if (!parsed) return null;
			if (!parsed.infoHash) throw new Error('Invalid torrent identifier');

			for (const torrent of this.torrents) {
				if (torrent.infoHash === parsed.infoHash) return torrent;
			}
		}
		return null;
	}

	add(torrentId, ontorrent) {
		if (this.destroyed) throw new Error('client is destroyed');

		const onReady = () => {
			if (this.destroyed) return;
			if (typeof ontorrent === 'function') ontorrent(torrent);
			this.emit('torrent', torrent);
		};

		function onClose() {
			torrent.removeListener('ready', onReady);
			torrent.removeListener('close', onClose);
		}

		const torrent = new Torrent(torrentId, this);

		this.torrents.push(torrent);

		torrent.once('ready', onReady);
		torrent.once('close', onClose);

		return torrent;
	}

	remove(torrentId) {
		const torrent = this.get(torrentId);
		if (!torrent) return;
		this.torrents.splice(this.torrents.indexOf(torrent), 1);
	}

	_onListening() {
		this.listening = true;

		if (this._tcpPool) {
			const address = this._tcpPool.server.address();
			if (address) this.torrentPort = address.port;
		}

		this.emit('listening');
	}
}

module.exports = Client;
