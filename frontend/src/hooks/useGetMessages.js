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
				console.warn("No conversation selected");
				return;
			}
			
			setLoading(true);
			try {
				console.log("Fetching messages for conversation:", selectedConversation._id);
				const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/message/${selectedConversation._id}`);
				console.log("Messages data:", data);
				setMessages(data);
			} catch (error) {
				console.error("Error fetching messages:", error.message);
				toast.error(error.message || "Failed to load messages");
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
