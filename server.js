// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const cors = require("cors");

const PORT = process.env.PORT || 3001; // Use Render's PORT or default to 3001 locally

// Apply CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Development frontend
      "https://realtime-collaboration-tool.vercel.app", // Production frontend
    ],
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

// For Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Development frontend
      "https://realtime-collaboration-tool.vercel.app", // Production frontend
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Broadcast drawing data to other clients
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
