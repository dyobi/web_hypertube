const arrayRemove = require('unordered-array-remove');
const Wire = require('bittorrent-protocol');

const CONNECT_TIMEOUT_TCP = 5000;
const HANDSHAKE_TIMEOUT = 25000;

exports.createTCPIncomingPeer = conn => {
	const addr = `${conn.remoteAddress}:${conn.remotePort}`;
	const peer = new Peer(addr, 'tcpIncoming');
	peer.conn = conn;
	peer.addr = addr;

	peer.onConnect();

	return peer;
};

exports.createTCPOutgoingPeer = (addr, swarm) => {
	const peer = new Peer(addr, 'tcpOutgoing');
	peer.addr = addr;
	peer.swarm = swarm;

	return peer;
};

class Peer {
	constructor(id, type) {
		this.id = id;
		this.type = type;

		this.addr = null;
		this.conn = null;
		this.swarm = null;
		this.wire = null;

		this.connected = false;
		this.destroyed = false;
		this.timeout = null;
		this.retries = 0;

		this.sentHandshake = false;
	}

	onConnect() {
		if (this.destroyed) return;
		this.connected = true;

		clearTimeout(this.connectTimeout);

		const conn = this.conn;
		conn.once('end', () => {
			this.destroy();
		});
		conn.once('close', () => {
			this.destroy();
		});
		conn.once('finish', () => {
			this.destroy();
		});
		conn.once('error', err => {
			this.destroy(err);
		});

		const wire = (this.wire = new Wire());
		wire.type = this.type;
		wire.once('end', () => {
			this.destroy();
		});
		wire.once('close', () => {
			this.destroy();
		});
		wire.once('finish', () => {
			this.destroy();
		});
		wire.once('error', err => {
			this.destroy(err);
		});

		wire.once('handshake', (infoHash, peerId) => {
			this.onHandshake(infoHash, peerId);
		});
		this.startHandshakeTimeout();

		conn.pipe(wire).pipe(conn);
		if (this.swarm && !this.sentHandshake) this.handshake();
	}

	onHandshake(infoHash, peerId) {
		if (!this.swarm) return;
		if (this.destroyed) return;

		if (this.swarm.destroyed) {
			return this.destroy(new Error('swarm already destroyed'));
		}
		if (infoHash !== this.swarm.infoHash) {
			return this.destroy(
				new Error('unexpected handshake info hash for this swarm')
			);
		}
		if (peerId === this.swarm.peerId) {
			return this.destroy(new Error('refusing to connect to ourselves'));
		}

		clearTimeout(this.handshakeTimeout);

		this.retries = 0;

		let addr = this.addr;
		if (!addr && this.conn.remoteAddress && this.conn.remotePort) {
			addr = `${this.conn.remoteAddress}:${this.conn.remotePort}`;
		}
		this.swarm._onWire(this.wire, addr);

		if (!this.swarm || this.swarm.destroyed) return;

		if (!this.sentHandshake) this.handshake();
	}

	handshake() {
		const opts = {
			dht: this.swarm.private ? false : !!this.swarm.client.dht
		};
		this.wire.handshake(
			this.swarm.infoHash,
			this.swarm.client.peerId,
			opts
		);
		this.sentHandshake = true;
	}

	startConnectTimeout() {
		clearTimeout(this.connectTimeout);
		this.connectTimeout = setTimeout(() => {
			this.destroy(new Error('connect timeout'));
		}, CONNECT_TIMEOUT_TCP);
		if (this.connectTimeout.unref) this.connectTimeout.unref();
	}

	startHandshakeTimeout() {
		clearTimeout(this.handshakeTimeout);
		this.handshakeTimeout = setTimeout(() => {
			this.destroy(new Error('handshake timeout'));
		}, HANDSHAKE_TIMEOUT);
		if (this.handshakeTimeout.unref) this.handshakeTimeout.unref();
	}

	destroy(err) {
		if (this.destroyed) return;
		this.destroyed = true;
		this.connected = false;

		clearTimeout(this.connectTimeout);
		clearTimeout(this.handshakeTimeout);

		const swarm = this.swarm;
		const conn = this.conn;
		const wire = this.wire;

		this.swarm = null;
		this.conn = null;
		this.wire = null;

		if (swarm && wire) {
			arrayRemove(swarm.wires, swarm.wires.indexOf(wire));
		}
		if (conn) {
			conn.on('error', () => {});
			conn.destroy();
		}
		if (wire) wire.destroy();
		if (swarm) swarm.removePeer(this.id);
	}
}
