import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message = "", imageUrl = null) => {
        console.log("sendMessage called with:", { 
            message: message || "(empty)", 
            hasImage: !!imageUrl 
        });
        
        // Early validation to prevent sending empty messages
        const hasContent = Boolean(message || imageUrl);
        if (!hasContent) {
            console.warn("Attempted to send empty message");
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
            
            console.log("Sending payload:", {
                to: selectedConversation.fullName,
                hasText: !!payload.message,
                hasImage: !!payload.imageUrl,
            });

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
                const errorText = await res.text();
                console.error("Server error response:", errorText);
                throw new Error(`Server error: ${res.status}`);
            }
            
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            console.log("Message sent successfully:", data);
            setMessages([...messages, data]);
            
            // Show success notification for image messages
            if (imageUrl) {
                toast.success("Image sent successfully");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(error.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
