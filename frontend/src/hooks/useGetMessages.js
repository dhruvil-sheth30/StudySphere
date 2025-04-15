import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_BASE_URL, fetchWithErrorHandling } from "../config/api";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation?._id) {
				return;
			}
			
			setLoading(true);
			try {
				const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/message/${selectedConversation._id}`);
				
				// Ensure data is an array
				if (Array.isArray(data)) {
					setMessages(data);
				} else {
					console.error("Expected array of messages but received:", data);
					setMessages([]);
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
				toast.error(error.message || "Failed to load messages");
				// Reset messages to empty array on error
				setMessages([]);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
