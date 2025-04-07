import http from "http";
import { Server } from "socket.io"; // Correct import for socket.io
import jwt from "jsonwebtoken";

const server = http.createServer();
const io = new Server(server); // Use the Server class to initialize socket.io

io.use((socket, next) => {
    if (socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return next(new Error("Authentication error"));
            socket.userId = decoded.id;
            next();
        });
    } else {
        next(new Error("Authentication required"));
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userId}`);
    });
});

export { io };