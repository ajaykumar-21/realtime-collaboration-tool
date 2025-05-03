const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// ✅ Force HTTPS (important for Render in production)
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// ✅ Enable CORS properly
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local testing
      "https://realtime-collaboration-tool.vercel.app", // your frontend domain
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Setup Socket.IO with same CORS config
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://realtime-collaboration-tool.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("cursor", (data) => {
    socket.broadcast.emit("cursor", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.broadcast.emit("removeCursor", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
