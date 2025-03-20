import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Ensure environment variables are loaded at the very beginning
dotenv.config();

// Debug important environment variables
console.log("\n--- Environment Variables Check ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Available" : "MISSING");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Available" : "MISSING");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "MISSING");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Available" : "MISSING");
console.log("-----------------------------\n");

const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

// Debug environment settings
console.log("Environment:", process.env.NODE_ENV);
console.log("Is production:", isProduction);

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(cookieParser());

// CORS configuration - simplified but effective approach
app.use(cors({
    origin: isProduction ? 'https://study-sphere-atgr.vercel.app' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Public routes that don't need authentication
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Request cookies:", req.cookies);
    console.log("Request origin:", req.headers.origin);
    next();
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
