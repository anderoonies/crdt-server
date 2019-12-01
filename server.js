
const socketIO = require('socket.io');
const express = require('express');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const connectedSockets = {};

const server = express()
    .use((req, res) => res.sendFile(INDEX, {root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);
io.on('connection', socket => {
    socket.broadcast.emit('newClient');

    socket.on('operations', operations => {
        console.log(operations);
        socket.broadcast.emit('operations', operations);
    });
    socket.on('siteId', siteId => {
        socket.broadcast.emit('newSiteId', siteId);
    })
    socket.on('disconnect', () => console.log('Client disconnected'));
});
