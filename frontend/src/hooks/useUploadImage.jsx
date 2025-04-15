import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";

const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Uploads an image using multipart/form-data
   * @param {File} imageFile - The file object to upload
   * @param {string} type - The type of upload ('profile' or 'message')
   * @returns {Promise<string|null>} The uploaded image URL or null if failed
   */
  const uploadImage = async (imageFile, type = 'message') => {
    if (!imageFile) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      const fieldName = type === 'profile' ? 'profileImage' : 'image';
      formData.append(fieldName, imageFile);
      
      const endpoint = type === 'profile' ? 'upload/profile' : 'upload';
      
      console.log(`Uploading ${type} image: ${imageFile.name} (${imageFile.size} bytes)`);
      
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: "POST",
        credentials: "include",
        body: formData, // No Content-Type header needed; browser sets it with boundary
      });
      
      // Try to parse the response regardless of status code
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(`Upload failed with status: ${response.status} (Invalid response)`);
      }
      
      if (!response.ok) {
        const errorMessage = data?.error || `Upload failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      console.log(`Upload successful: ${data.imageUrl}`);
      return data.imageUrl;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      setError(error.message);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { uploadImage, loading, error };
};

export default useUploadImage;
