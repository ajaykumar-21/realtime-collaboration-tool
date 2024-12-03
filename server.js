// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Replace '*' with your frontend's URL in production
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast drawing data to other clients
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on http://localhost:3001');
});
