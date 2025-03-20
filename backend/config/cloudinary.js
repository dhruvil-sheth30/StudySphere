import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Debug Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary Configuration Check:");
console.log("- Cloud Name:", cloudName ? "Available" : "MISSING");
console.log("- API Key:", apiKey ? "Available" : "MISSING");
console.log("- API Secret:", apiSecret ? "Available" : "MISSING");

if (!cloudName || !apiKey || !apiSecret) {
  console.error("ERROR: Missing Cloudinary credentials in environment variables");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Setup storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studysphere',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, crop: 'limit' }]
  }
});

export { cloudinary, storage };