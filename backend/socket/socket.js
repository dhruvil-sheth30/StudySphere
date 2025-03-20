import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
console.log("Socket.io - Environment:", process.env.NODE_ENV);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: isProduction 
            ? 'https://study-sphere-atgr.vercel.app'
            : 'http://localhost:3000',
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
