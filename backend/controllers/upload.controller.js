export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Multer with Cloudinary storage automatically uploads the file
    // and adds the result info to req.file
    res.status(200).json({ 
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};