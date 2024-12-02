const express = require("express"); // Express for handling HTTP server
const http = require("http"); // HTTP module to create server instance
const { Server } = require("socket.io"); // Socket.IO for real-time WebSocket communication

// Initialize Express application
const app = express();
const server = http.createServer(app); // Create HTTP server with Express
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Your development frontend
      "https://realtime-collaboration-tool.vercel.app", // Your Vercel production frontend
    ],
    methods: ["GET", "POST"], // HTTP methods allowed
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001");
});
