import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Get credentials from environment variables without fallbacks
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Validate Cloudinary credentials are available
if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Missing Cloudinary credentials in environment variables:');
  console.error(`- CLOUD_NAME: ${cloudName ? 'Set ✓' : 'MISSING ✗'}`);
  console.error(`- API_KEY: ${apiKey ? 'Set ✓' : 'MISSING ✗'}`);
  console.error(`- API_SECRET: ${apiSecret ? 'Set ✓' : 'MISSING ✗'}`);
  // Don't throw an error here to let the application start, but uploads will fail
}

console.log('Configuring Cloudinary with cloud_name:', cloudName);

// Configure cloudinary with proper timeout
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  timeout: 120000 // Increase timeout to 120 seconds for large uploads
});

// Test connection on startup, but don't block application startup
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection verified:", result.status);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.error || error);
    return false;
  }
};

// Run the test asynchronously
testCloudinaryConnection();

// Setup storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studysphere',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, crop: 'limit' }]
  },
  // Add better error handling for upload failures
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
  }
});

export { cloudinary, storage };