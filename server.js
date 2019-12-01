const socketIO = require('socket.io');
const express = require('express');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const connectedSockets = {};
let nextSiteId = 1;

const server = express()
    .use((req, res) => res.sendFile(INDEX, {root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
io.on('connection', socket => {
    const clientSiteId = ++nextSiteId;
    connectedSockets[clientSiteId] = socket;
    socket.emit('siteId', clientSiteId);
    socket.broadcast.emit('newClient', clientSiteId);

    socket.on('operations', operations => {
        console.log(operations);
        socket.broadcast.emit('operations', operations);
    });
    socket.on('cursorChange', ({siteId, cursor}) => {
        console.log(siteId);
        console.log(cursor);
        socket.broadcast.emit('cursorChange', {peerId: siteId, cursor});
    });
    socket.on('siteId', siteId => {
        socket.broadcast.emit('newSiteId', siteId);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.broadcast.emit('peerDisconnect', clientSiteId);
    });
});
