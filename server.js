import { PORT } from "./src/config/config.js";
import express from "express";
import { notFoundHandler } from "./src/middleware/notFoundHandler.middleware.js";
import errorHandler from "./src/middleware/errorHandler.middleware.js";
import { rootRouter } from "./src/routes/root.route.js";
import connectDatabase from "./src/config/connectDatabase.js";
import { checkInactiveUsers } from "./src/utils/cronJobs.utils.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
// import { server } from "./src/utils/socket.utils.js";

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (_, res) => {
  return res.send("Welcome to security API!");
});

//handling all routes
rootRouter(app);

// not found route handler middleware
app.use(notFoundHandler);

//error handler middleware
app.use(errorHandler);

// async function startServer() {
//   await connectDatabase();

//   app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//     checkInactiveUsers();
//   });

//   io.use((socket, next) => {
//     const token = socket.handshake.query.token;
//     if (!token) return next(new Error("Authentication required"));
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//       if (err) return next(new Error("Authentication error"));
//       socket.userId = decoded.id;
//       next();
//     });
//   });
  
//   io.on("connection", (socket) => {
//     // console.log(`User connected: ${socket.handshake.query.chatId}`);
  
//     // Join a private room using user ID
//     socket.on("joinRoom", (roomId) => {
//       socket.join(roomId.toString());
//       console.log(`User ${socket.userId} joined room: ${roomId}`);
//     });
//     // socket.join(socket.handshake.query.chatId);
  
//     socket.on("sendMessage", (message) => {
//       console.log(message);
//     });
  
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.userId}`);
//     });
//   });

// }

async function startServer() {
  await connectDatabase();

  server.listen(PORT, () => {
    console.log(`Server and Socket.IO listening on port ${PORT}`);
    checkInactiveUsers();
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
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId.toString());
      console.log(`User ${socket.userId} joined room: ${roomId}`);
    });

    socket.on("sendMessage", (message) => {
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}


// server.listen(5001, () => {
//   console.log("Server and Socket.IO listening on port 5001");
// });



export { io, server };


startServer();
