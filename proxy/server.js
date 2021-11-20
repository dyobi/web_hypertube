/*
    This proxy server is for development :)
*/

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/hypertube.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = https.createServer(credentials, app);

const API_IP = 'localhost';
const PROXY_PORT = 8443;
const TORRENT_PORT = 8444;
const STREAM_PORT = 8445;
const API_PORT = 8446;
const SOCKET_PORT = 8447;

app.use(cors());

app.get('/', (req, res) => {
    res.json('Proxy server is running');
});

app.use(
    '/torrent',
    createProxyMiddleware({
        target: `https://${API_IP}:${TORRENT_PORT}`,
        changeOrigin: true,
        secure: false
    })
);

app.use(
    '/stream',
    createProxyMiddleware({
        target: `https://${API_IP}:${STREAM_PORT}`,
        changeOrigin: true,
        secure: false
    })
);

app.use(
    '/api',
    createProxyMiddleware({
        target: `https://${API_IP}:${API_PORT}`,
        changeOrigin: true,
        secure: false
    })
);

app.use(
    '/socket',
    createProxyMiddleware({
        target: `https://${API_IP}:${SOCKET_PORT}`,
        changeOrigin: true,
        secure: false
    })
);

server.listen(PROXY_PORT, () => console.log(`Proxy server is running on port ${PROXY_PORT}`));
