import { useState } from 'react';
import { AiOutlineZoomIn } from 'react-icons/ai';

const ImageMessage = ({ imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = '/fallback-image.png'; // Use a fallback image
  };

  return (
    <>
      <div className="relative group rounded-md overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Shared image" 
          className="max-h-60 w-full object-cover cursor-pointer rounded-md border border-gray-600" 
          onClick={openModal}
          onError={handleImageError}
        />
        <div 
          onClick={openModal}
          className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300"
        >
          <button 
            className="bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
            title="View full image"
          >
            <AiOutlineZoomIn size={20} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={imageUrl} 
              alt="Full size image" 
              className="max-w-full max-h-[90vh] object-contain"
              onError={handleImageError}
            />
            <button 
              className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 text-white px-4 py-2 rounded-full hover:bg-gray-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageMessage;