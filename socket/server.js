const express = require('express');
const socketio = require('socket.io');

const { addUser, removeUser, getUser } = require('./container');

const app = express();
const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/hypertube.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = https.createServer(credentials, app);

const io = socketio(server);

// const API_IP = 'localhost';
// const TORRENT_PORT = 8444;
// const STREAM_PORT = 8445;
// const API_PORT = 8446;
const SOCKET_PORT = 8447;

io.on('connection', socket => {
    socket.on('join', ({ userName, movieRoom }, callback) => {
        console.log(`[IN] ${userName} -> ${movieRoom}`);

        const user = addUser({
            socketId: socket.id,
            userName,
            movieRoom
        });

        socket.join(user.movieRoom);

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        if (user !== undefined) {
            console.log(`[MESSAGE] ${user.userName}(${user.movieRoom}) : ${message}`);
            io.to(user.movieRoom).emit('message', {
                userName: user.userName,
                text: message
            });

            callback();
        }
    });

    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});

server.listen(SOCKET_PORT, () => console.log(`Socket server is running on port ${SOCKET_PORT}`));
