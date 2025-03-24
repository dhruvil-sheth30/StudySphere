import { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaSmile } from "react-icons/fa";
import useSendMessage from "../../hooks/useSendMessage";
import ImageUpload from "./ImageUpload";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const { loading, sendMessage } = useSendMessage();
    const inputRef = useRef(null);

    // Focus the input when component mounts
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Check if there's valid content to send (either non-empty text OR image)
    const hasContent = Boolean(message.trim() || imageUrl);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Don't proceed if there's nothing to send
        if (!message.trim() && !imageUrl) {
            return;
        }
        
        try {
            await sendMessage(message.trim(), imageUrl);
            
            // Clear inputs after successful send
            setMessage("");
            setImageUrl(null);
            focusInput();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            {imageUrl && (
                <div className="mb-2 flex items-center">
                    <span className="bg-blue-600 text-xs py-1 px-2 rounded-full text-white font-medium ml-2">
                        Image attached
                    </span>
                </div>
            )}

            <div className='w-full flex flex-col'>
                <div className="relative flex items-center bg-gray-700 rounded-lg overflow-hidden shadow-md">
                    <div className="flex-shrink-0 pl-2">
                        <ImageUpload 
                            onImageSelected={(url) => setImageUrl(url)} 
                            onImageClear={() => setImageUrl(null)} 
                        />
                    </div>
                    
                    <input
                        ref={inputRef}
                        type='text'
                        className='border-none text-sm block w-full py-3 px-3 bg-transparent text-white focus:outline-none flex-1'
                        placeholder='Type your message here...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    
                    {/* Optional: Add emoji button */}
                    <button 
                        type="button"
                        className="text-gray-400 hover:text-gray-200 px-2"
                        onClick={() => alert("Emoji picker coming soon!")}
                    >
                        <FaSmile size={20} />
                    </button>
                    
                    <button 
                        type='submit' 
                        className={`px-4 py-3 flex items-center justify-center transition-colors ${
                            hasContent 
                                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                                : 'text-gray-400 bg-gray-800 cursor-not-allowed'
                        }`}
                        disabled={loading || !hasContent}
                    >
                        {loading ? 
                            <div className='loading loading-spinner loading-sm'></div> : 
                            <IoSend size={18} />
                        }
                    </button>
                </div>

                {imageUrl && (
                    <div className="text-xs text-gray-400 mt-1 ml-2">
                        Press send button or Enter key to send your message with image
                    </div>
                )}
            </div>
        </form>
    );
};
export default MessageInput;


