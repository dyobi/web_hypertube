const stream = require('readable-stream');

class FileStream extends stream.Readable {
	constructor(file, opts) {
		super(opts);

		this.destroyed = false;
		this._torrent = file._torrent;

		const start = opts.start;
		const end = opts.end;

		const pieceLength = file._torrent.pieceLength;

		this._startPiece = ((start + file.offset) / pieceLength) | 0;
		this._endPiece = ((end + file.offset) / pieceLength) | 0;
		this._piece = this._startPiece;
		this._offset = start + file.offset - this._startPiece * pieceLength;
		this._missing = end - start + 1;
		this._reading = false;
		this._notifying = false;
		this._criticalLength = Math.min(((1024 * 1024) / pieceLength) | 0, 2);
	}

	_read() {
		if (this._reading) return;
		this._reading = true;
		this._notify();
	}

	_notify() {
		if (!this._reading || this._missing === 0) return;
		if (!this._torrent.bitfield.get(this._piece)) {
			return this._torrent.critical(
				this._piece,
				this._piece + this._criticalLength
			);
		}

		if (this._notifying) return;
		this._notifying = true;

		const p = this._piece;
		this._torrent.store.get(p, (err, buffer) => {
			this._notifying = false;

			if (err) return this._destroy(err, () => {});

			if (this._offset) {
				buffer = buffer.slice(this._offset);
				this._offset = 0;
			}

			if (this._missing < buffer.length) {
				buffer = buffer.slice(0, this._missing);
			}
			this._missing -= buffer.length;

			this._reading = false;
			this.push(buffer);

			if (this._missing === 0) this.push(null);
		});
		this._piece += 1;
	}
}

module.exports = FileStream;
