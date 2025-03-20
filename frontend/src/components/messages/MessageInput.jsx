import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import useSendMessage from "../../hooks/useSendMessage";
import ImageUpload from "./ImageUpload";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message && !imageUrl) return;
        await sendMessage(message, imageUrl);
        setMessage("");
        setImageUrl(null);
    };

    const hasContent = message.trim() || imageUrl;

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
                <div className="relative flex items-center bg-gray-700 rounded-lg overflow-hidden">
                    <div className="flex-shrink-0 pl-2">
                        <ImageUpload 
                            onImageSelected={setImageUrl} 
                            onImageClear={() => setImageUrl(null)} 
                        />
                    </div>
                    
                    <input
                        type='text'
                        className='border-none text-sm block w-full p-3 bg-transparent text-white focus:outline-none flex-1'
                        placeholder='Send a message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    
                    <button 
                        type='submit' 
                        className={`px-3 py-2 flex items-center justify-center ${
                            hasContent 
                                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                                : 'text-gray-400 bg-gray-800 cursor-not-allowed'
                        } transition-colors`}
                        disabled={loading || !hasContent}
                    >
                        {loading ? 
                            <div className='loading loading-spinner loading-sm'></div> : 
                            <IoSend size={18} className={hasContent ? "text-white" : "text-gray-400"} />
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


