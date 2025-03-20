import { useState } from "react";
import { BsSend } from "react-icons/bs";
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

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            {imageUrl && (
                <div className="mb-2">
                    <p className="text-xs text-gray-400">Image ready to send</p>
                </div>
            )}
            <div className='w-full relative flex items-center'>
                <ImageUpload 
                    onImageSelected={setImageUrl} 
                    onImageClear={() => setImageUrl(null)} 
                />
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white pl-10'
                    placeholder='Send a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    type='submit' 
                    className='absolute inset-y-0 end-0 flex items-center pe-3'
                    disabled={loading || (!message && !imageUrl)}
                >
                    {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
                </button>
            </div>
        </form>
    );
};
export default MessageInput;


