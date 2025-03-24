import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

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

// Map to keep track of online users: userId -> socketId
const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Custom function to emit a message with user information
export const emitWithUserInfo = async (receiverSocketId, eventName, message) => {
    try {
        // Attach sender name if possible
        if (message.senderId) {
            const sender = await User.findById(message.senderId).select("fullName");
            if (sender) {
                message.senderName = sender.fullName;
            }
        }
        
        io.to(receiverSocketId).emit(eventName, message);
    } catch (error) {
        console.error("Error in emitWithUserInfo:", error);
        // Fallback to regular emit without additional info
        io.to(receiverSocketId).emit(eventName, message);
    }
};

export { app, io, server };
