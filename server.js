const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Socket server is running!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // replace with your Vercel URL in production
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"], // support both
  allowEIO3: true, // support older clients
  path: "/socket.io", // explicitly set
});

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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
