import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message = "", imageUrl = null) => {
        // Don't proceed if there's nothing to send
        if (!message && !imageUrl) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/message/send/${selectedConversation?._id}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message, imageUrl }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};
export default useSendMessage;
