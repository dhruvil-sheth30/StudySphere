import { useState } from 'react';
import { AiOutlineZoomIn } from 'react-icons/ai';

const ImageMessage = ({ imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative group">
        <img 
          src={imageUrl} 
          alt="Shared image" 
          className="max-h-60 rounded-md cursor-pointer" 
          onClick={openModal}
        />
        <button 
          onClick={openModal}
          className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <AiOutlineZoomIn size={18} />
        </button>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={imageUrl} 
              alt="Full size image" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded-full"
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