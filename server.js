const express = require("express"); // Express for handling HTTP server
const http = require("http"); // HTTP module to create server instance
const { Server } = require("socket.io"); // Socket.IO for real-time WebSocket communication
const cors = require("cors");

// Initialize Express application
const app = express();
const server = http.createServer(app); // Create HTTP server with Express

const PORT = process.env.PORT || 3001;
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://realtime-collaboration-tool.vercel.app"]
    : ["http://localhost:3000"];

// Apply CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Add a simple route for health checks
app.get("/", (req, res) => {
  res.send("Socket.IO server is running.");
});

// Initialize Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
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
