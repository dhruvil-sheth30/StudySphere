import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import requestLogger from "./middleware/requestLogger.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Ensure environment variables are loaded at the very beginning
dotenv.config();

const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

// Add request logger before other middleware
app.use(requestLogger);

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: isProduction ? 'https://study-sphere-atgr.vercel.app' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});
