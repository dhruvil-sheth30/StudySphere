import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageSelected, onImageClear }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      toast.error('File must be an image (JPEG, PNG, or GIF)');
      return;
    }

    // Check file size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary through our API
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      onImageSelected(data.imageUrl);
    } catch (error) {
      toast.error(error.message || 'Error uploading image');
      clearImage();
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageClear();
  };

  return (
    <div className="relative">
      {previewUrl ? (
        <div className="relative inline-block">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className="h-20 rounded-md mb-2"
          />
          <button
            onClick={clearImage}
            className="absolute top-0 right-0 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white"
            type="button"
          >
            <MdCancel size={18} />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer text-gray-400 hover:text-gray-200 p-2">
          <BsImage size={20} />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      
      {isUploading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="loading loading-spinner text-white"></div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;