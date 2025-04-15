import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { uploadImage, uploadProfileImage } from "../controllers/upload.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", protectRoute, upload.single("image"), uploadImage);
router.post("/profile", protectRoute, upload.single("profileImage"), uploadProfileImage);

export default router;