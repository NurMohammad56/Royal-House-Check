import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("Authentication required"));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    socket.userId = decoded.id;
    next();
  });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Join a private room using user ID
  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

export { io, server };
