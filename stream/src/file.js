const { EventEmitter } = require('events');
const { PassThrough } = require('readable-stream');
const eos = require('end-of-stream');

const FileStream = require('./file-stream');

class File extends EventEmitter {
    constructor(torrent, file) {
        super();

        this._torrent = torrent;
        this._destroyed = false;

        this.name = file.name;
        this.path = file.path;
        this.length = file.length;
        this.offset = file.offset;

        this.done = false;

        const start = file.offset;
        const end = start + file.length - 1;

        this._startPiece = (start / this._torrent.pieceLength) | 0;
        this._endPiece = (end / this._torrent.pieceLength) | 0;

        if (this.length === 0) {
            this.done = true;
            this.emit('done');
        }
    }

    createReadStream(opts) {
        if (this.length === 0) {
            const empty = new PassThrough();
            process.nextTick(() => {
                empty.end();
            });
            return empty;
        }

        const fileStream = new FileStream(this, opts);

        this._torrent.select(fileStream._startPiece, fileStream._endPiece, true, () => {
            fileStream._notify();
        });

        eos(fileStream, () => {
            if (this._destroyed) return;
            if (!this._torrent.destroyed) {
                this._torrent.deselect(fileStream._startPiece, fileStream._endPiece, true);
            }
        });

        return fileStream;
    }
}

module.exports = File;
