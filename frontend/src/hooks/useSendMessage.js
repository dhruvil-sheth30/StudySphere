import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message = "", imageUrl = null) => {
        // Early validation to prevent sending empty messages
        const hasContent = Boolean(message || imageUrl);
        if (!hasContent) {
            return;
        }
        
        // Ensure we have a selected conversation
        if (!selectedConversation?._id) {
            toast.error("No conversation selected");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                message: message || "",  // Empty string for image-only messages
                imageUrl: imageUrl      // Keep imageUrl as is (could be null)
            };

            const res = await fetch(`${API_BASE_URL}/api/message/send/${selectedConversation._id}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                throw new Error(`Failed to send message`);
            }
            
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
            
            // Show success notification only for image messages
            if (imageUrl) {
                toast.success("Image sent successfully");
            }
        } catch (error) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
