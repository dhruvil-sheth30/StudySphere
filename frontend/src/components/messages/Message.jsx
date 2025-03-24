import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import ImageMessage from "./ImageMessage";
import { useState } from "react";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-600" : "bg-gray-700";
    const shakeClass = message.shouldShake ? "shake" : "";
    
    // Add state for message seen status (this would need a proper implementation)
    const [isSeen] = useState(false);

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='Profile' src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 ${message.imageUrl ? 'max-w-xs' : ''} shadow-lg`}>
                {message.imageUrl ? (
                    <>
                        <ImageMessage imageUrl={message.imageUrl} />
                        {message.message && (
                            <div className="mt-2">{message.message}</div>
                        )}
                    </>
                ) : (
                    message.message
                )}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
                {formattedTime}
                {fromMe && isSeen && <span className="text-blue-400">✓✓</span>}
            </div>
        </div>
    );
};
export default Message;
