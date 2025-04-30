import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BackendLoadingNotice = () => {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check localStorage to see if we've shown the notice before
    const hasShownNotice = localStorage.getItem('backend-notice-shown');
    
    if (!hasShownNotice) {
      // Show the notice after a short delay
      const timer = setTimeout(() => {
        toast((t) => (
          <div className="p-2">
            <h3 className="font-bold">Backend is starting up</h3>
            <p className="text-sm mt-1">
              Our backend is hosted on Render's free tier and may take up to 30 seconds to wake up. 
              Please be patient if messages take a moment to load.
            </p>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  localStorage.setItem('backend-notice-shown', 'true');
                  toast.dismiss(t.id);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        ), {
          duration: 10000,
          position: 'top-center',
          style: {
            maxWidth: '400px',
            background: '#2A303C',
            color: 'white',
          },
        });
        setHasShown(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return null; // This component doesn't render anything
};

export default BackendLoadingNotice;