const net = require('net');

class TCPPool {
	constructor(client) {
		this.server = net.createServer();
		this._client = client;

		this._pendingConns = [];

		this._onListening = () => {
			this._client._onListening();
		};

		this._onError = err => {
			this._client._destroy(err);
		};

		this.server.on('listening', this._onListening);
		this.server.on('error', this._onError);

		this.server.listen(client.torrentPort);
	}

	destroy(cb) {
		this.server.removeListener('listening', this._onListening);
		this.server.removeListener('error', this._onError);

		this._pendingConns.forEach(conn => {
			conn.on('error', () => {});
			conn.destroy();
		});

		try {
			this.server.close(cb);
		} catch (err) {
			if (cb) process.nextTick(cb);
		}

		this.server = null;
		this._client = null;
		this._pendingConns = null;
	}
}

module.exports = TCPPool;
