import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaSmile } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import ImageUpload from "./ImageUpload";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { loading, sendMessage } = useSendMessage();
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    // Focus the input when component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Check if there's valid content to send (either non-empty text OR image)
    const hasContent = Boolean(message.trim() || imageUrl);
    
    // Improved emoji picker toggle and outside click handling
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if clicking outside both the emoji picker and the emoji button
            if (
                showEmojiPicker && 
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) &&
                emojiButtonRef.current && 
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

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
            
            // Focus back on input
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 10);
        } catch (error) {
            // Error handling is done in the hook
        }
    };
    
    const handleEmojiClick = (emojiObject) => {
        try {
            console.log("Emoji selected:", emojiObject);
            // Extract emoji from object - different libraries may have different structures
            const emoji = emojiObject.emoji || emojiObject.native || emojiObject;
            
            // Insert emoji at cursor position
            const cursorPosition = inputRef.current?.selectionStart || message.length;
            const newMessage = 
                message.substring(0, cursorPosition) + 
                emoji + 
                message.substring(cursorPosition);
            
            setMessage(newMessage);
            
            // Don't automatically close emoji picker on mobile
            if (window.innerWidth > 768) {
                setShowEmojiPicker(false);
            }
            
            // Focus back on input and set cursor position after the inserted emoji
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    const newPosition = cursorPosition + emoji.length;
                    inputRef.current.setSelectionRange(newPosition, newPosition);
                }
            }, 10);
        } catch (error) {
            console.error("Error handling emoji selection:", error);
        }
    };

    return (
        <form className='px-2 sm:px-4 my-2 sm:my-3 relative' onSubmit={handleSubmit}>
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
                        className='border-none text-sm block w-full py-2 sm:py-3 px-2 sm:px-3 bg-transparent text-white focus:outline-none flex-1'
                        placeholder='Type your message here...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    
                    {/* Emoji button - with ref for click detection */}
                    <div className="relative">
                        <button 
                            type="button"
                            className={`text-gray-400 hover:text-gray-200 p-2 z-10 transition-colors ${showEmojiPicker ? 'bg-gray-600 rounded-full' : ''}`}
                            onClick={() => {
                                console.log("Toggling emoji picker, was:", showEmojiPicker);
                                setShowEmojiPicker(!showEmojiPicker);
                            }}
                            aria-label="Emoji picker"
                            ref={emojiButtonRef}
                        >
                            {showEmojiPicker ? <MdClose size={20} /> : <FaSmile size={20} />}
                        </button>
                        
                        {/* Emoji Picker Dropdown */}
                        {showEmojiPicker && (
                            <div 
                                className="emoji-picker-container"
                                ref={emojiPickerRef}
                            >
                                <EmojiPicker 
                                    onEmojiClick={handleEmojiClick}
                                    width={window.innerWidth < 500 ? 260 : 320}
                                    height={350}
                                    theme="dark"
                                    lazyLoadEmojis={true}
                                    searchDisabled={window.innerWidth < 500}
                                    skinTonesDisabled={window.innerWidth < 500}
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type='submit' 
                        className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center transition-colors ${
                            hasContent 
                                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                                : 'text-gray-400 bg-gray-800 cursor-not-allowed'
                        }`}
                        disabled={loading || !hasContent}
                        aria-label="Send message"
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



