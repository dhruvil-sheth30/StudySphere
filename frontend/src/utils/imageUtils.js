/**
 * Compresses an image file to a specified maximum width and quality
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - The maximum width in pixels
 * @param {number} quality - The compression quality (0-1)
 * @returns {Promise<string>} - A promise that resolves to the compressed image as a data URL
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // If not an image file, reject
    if (!file.type.match(/image.*/)) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.src = readerEvent.target.result;
      
      image.onload = () => {
        // Always resize for consistency with Cloudinary
        const width = image.width;
        const height = image.height;
        
        // Calculate new dimensions - maintain aspect ratio
        const newWidth = Math.min(width, maxWidth);
        const newHeight = Math.floor(height * (newWidth / width));
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw resized image
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white'; // Set background to white
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        
        // Get compressed image as data URL - use jpeg for smaller size
        const imageType = 'image/jpeg';
        const compressed = canvas.toDataURL(imageType, quality);
        
        // Ensure resulting image isn't too large
        if (compressed.length > 1024 * 1024) {
          // Try again with lower quality
          const lowerQuality = canvas.toDataURL(imageType, 0.5);
          resolve(lowerQuality);
        } else {
          resolve(compressed);
        }
      };
      
      image.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Calculates the approximate size of a base64 data URL in MB
 * @param {string} dataUrl - The data URL string
 * @returns {number} - Size in MB
 */
export const getBase64Size = (dataUrl) => {
  // Remove metadata (e.g., "data:image/png;base64,")
  const base64str = dataUrl.split(',')[1];
  // Calculate size: 3/4 of the length in bytes (rough approximation)
  return base64str ? (base64str.length * 3) / (4 * 1024 * 1024) : 0;
};
