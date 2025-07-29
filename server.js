const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Allow your frontend domain (for now, keep it open for testing)
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your Vercel frontend URL for production
    methods: ["GET", "POST"],
  },
  transports: ["websocket"], // Force WebSocket
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join_branch", (branchId) => {
    socket.join(branchId);
    console.log(`Client ${socket.id} joined branch: ${branchId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Railway provides PORT automatically
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
