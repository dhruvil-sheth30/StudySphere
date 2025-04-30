import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

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
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        // Store user's socket connection
        userSocketMap[userId] = socket.id;
        
        // Log connection status
        console.log(`User connected: ${userId}`);
        
        // Emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
        // Log all online users
        console.log("Online users:", Object.keys(userSocketMap));
    }

    // Handle findUser request for notification redirection
    socket.on("findUser", async (userId) => {
        try {
            if (!userId) return;
            
            // Find user by ID (exclude password field)
            const user = await User.findById(userId).select("-password");
            
            if (user) {
                // Send user data back to the requester
                socket.emit("userFound", {
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    profilePic: user.profilePic
                });
            }
        } catch (error) {
            console.error("Error finding user:", error);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        if (userId && userId !== "undefined") {
            console.log(`User disconnected: ${userId}`);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// Custom function to emit a message with user information
export const emitWithUserInfo = async (receiverSocketId, eventName, message) => {
    try {
        // Ensure we have the sender's name for better UX
        if (message.senderId) {
            const sender = await User.findById(message.senderId).select("fullName username profilePic");
            if (sender) {
                message.senderName = sender.fullName;
                // Add sender info to improve notification redirect
                message.sender = {
                    _id: sender._id,
                    fullName: sender.fullName,
                    username: sender.username,
                    profilePic: sender.profilePic
                };
            }
        }
        
        // Emit to specific recipient
        io.to(receiverSocketId).emit(eventName, message);
        
        console.log(`Message emitted to ${receiverSocketId}:`, {
            event: eventName, 
            messageId: message._id,
            from: message.senderId,
            to: message.receiverId
        });
    } catch (error) {
        console.error("Error emitting message:", error);
        
        // Fallback to regular emit without additional info
        io.to(receiverSocketId).emit(eventName, message);
    }
};

export { app, io, server };
