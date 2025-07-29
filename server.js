const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Keep-alive HTTP route (for Railway health checks)
app.get("/", (req, res) => {
  res.send("Socket server is running and healthy!");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with DEFAULT path (no custom path)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://thecakery.uk"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket events
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("join_branch", (branchId) => {
    socket.join(branchId);
    console.log(`📦 Client joined branch room: ${branchId}`);
  });

  socket.on("new_order", (order) => {
    console.log("📦 New order received:", order);
    io.emit("new_order", order);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });

  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
