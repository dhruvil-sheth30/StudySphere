import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BsImage } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import toast from 'react-hot-toast';

const ImageUpload = forwardRef(({ onImageSelected, onImageClear }, ref) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Expose resetImage method to parent component
  useImperativeHandle(ref, () => ({
    resetImage: () => {
      setPreviewUrl(null);
    }
  }));

  // Ensure previewUrl changes are synced with the parent component
  useEffect(() => {
    if (previewUrl) {
      onImageSelected(previewUrl);
    } else if (previewUrl === null) {
      onImageClear();
    }
  }, [previewUrl, onImageSelected, onImageClear]);

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

    setIsUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        toast.success('Image ready to send');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error processing image');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageClear();
  };

  return (
    <div className={`flex items-center ${previewUrl ? 'flex-col' : ''}`}>
      {previewUrl ? (
        <div className="relative mb-2 rounded-md overflow-hidden border border-gray-600 bg-gray-800">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className="h-24 w-auto object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
            type="button"
            title="Remove image"
          >
            <MdCancel size={20} />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer text-gray-400 hover:text-blue-400 p-2 transition-colors flex items-center" title="Upload image">
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
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="loading loading-spinner text-white"></div>
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;