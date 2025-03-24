import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import useSendMessage from "../../hooks/useSendMessage";
import ImageUpload from "./ImageUpload";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [debugInfo, setDebugInfo] = useState({ hasContent: false });
    const { loading, sendMessage } = useSendMessage();

    // Force check hasContent whenever message or imageUrl changes
    const hasContent = Boolean(message.trim() || imageUrl);
    
    // Debug logging for UI state
    useEffect(() => {
        const info = {
            hasContent,
            messageLength: message?.length,
            hasImageUrl: !!imageUrl,
            buttonActive: hasContent && !loading,
        };
        setDebugInfo(info);
        console.log("Input State:", info);
    }, [message, imageUrl, hasContent, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Form submitted with:", {
            message: message || "(empty)",
            hasImage: !!imageUrl
        });
        
        // Don't proceed if there's nothing to send
        if (!message.trim() && !imageUrl) {
            console.warn("No content to send");
            return;
        }
        
        try {
            await sendMessage(message.trim(), imageUrl);
            
            // Clear inputs after successful send
            setMessage("");
            setImageUrl(null);
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
                <div className="relative flex items-center bg-gray-700 rounded-lg overflow-hidden">
                    <div className="flex-shrink-0 pl-2">
                        <ImageUpload 
                            onImageSelected={(url) => {
                                console.log("Image selected in MessageInput:", url ? "YES" : "NO");
                                setImageUrl(url);
                            }} 
                            onImageClear={() => {
                                console.log("Image cleared in MessageInput");
                                setImageUrl(null);
                            }} 
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
                        onClick={() => console.log("Send button clicked, hasContent:", hasContent)}
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
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV !== 'production' && (
                <pre className="text-xs text-gray-500 mt-2 hidden">
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            )}
        </form>
    );
};
export default MessageInput;


