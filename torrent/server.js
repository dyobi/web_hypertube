const express = require('express');
const cors = require('cors');

const RarbgApi = require('rarbg');
const OS = require('opensubtitles-api');

const app = express();

const fs = require('fs');
const path = require('path');
const https = require('https');
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/hypertube.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = https.createServer(credentials, app);

// const API_IP = 'localhost';
const TORRENT_PORT = 8444;
// const STREAM_PORT = 8445;
// const API_PORT = 8446;
// const SOCKET_PORT = 8447;

app.use(cors());

app.use('/torrent/sub', express.static('public/sub'));

app.get('/torrent', (req, res) => {
    res.json('Torrent server is running');
});

app.get('/torrent/search/:id', async (req, res) => {
    const id = req.params.id;

    const rarbg = new RarbgApi({
        host: 'torrentapi.org',
        path: '/pubapi_v2.php?',
        app_id: 'hypertube',
        user_agent: 'Hypertube 0.0.1'
    });

    await rarbg
        .search({
            search_themoviedb: id,
            sort: 'seeders',
            category: [rarbg.categories.MOVIES_X264_1080, rarbg.categories.MOVIES_X264_720],
            min_seeders: 1,
            format: 'json_extended'
        })
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            res.json(error);
        });
});

const OpenSubtitles = new OS({
    useragent: ' TemporaryUserAgent',
    username: 'hypertube_aidan',
    password: 'hypertube_aidan',
    ssl: true
});

app.get('/torrent/subtitle/:id/:lang', (req, res) => {
    const id = req.params.id;
    const lang = req.params.lang;

    OpenSubtitles.search({
        imdbid: id
    }).then(subtitles => {
        if (lang === 'en_US') {
            if (subtitles.en !== null && subtitles.en !== undefined) {
                const name = subtitles.en.filename.replace('.srt', '') + '.en.vtt';
                download(subtitles.en.vtt, path.join(__dirname, 'public', 'sub', name), () => {
                    res.json(`/torrent/sub/${name}`);
                });
            }
        } else {
            if (subtitles.ko !== null && subtitles.ko !== undefined) {
                const name = subtitles.ko.filename.replace('.srt', '') + '.ko.vtt';
                download(subtitles.ko.vtt, path.join(__dirname, 'public', 'sub', name), () => {
                    res.json(`/torrent/sub/${name}`);
                });
            }
        }
    });
});

const download = (url, dest, cb) => {
    var file = fs.createWriteStream(dest);

    https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(cb);
        });
    });
};

server.listen(TORRENT_PORT, () => {
    console.log(`Torrent server is running on port ${TORRENT_PORT}`);
});
