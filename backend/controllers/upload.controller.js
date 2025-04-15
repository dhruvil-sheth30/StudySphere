export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Multer with Cloudinary storage automatically uploads the file
    // and adds the result info to req.file
    console.log(`Image uploaded successfully: ${req.file.path}`);
    
    res.status(200).json({ 
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No profile image provided" });
    }

    // More detailed logging for profile uploads
    console.log(`Profile image uploaded for user ${req.user._id}: ${req.file.path}`);
    
    // Multer with Cloudinary storage already handled the upload
    // We need to return the URL so it can be saved to the user profile
    res.status(200).json({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error("Error in profile image upload:", error);
    res.status(500).json({ error: error.message || "Failed to upload profile image" });
  }
};