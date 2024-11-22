import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";
const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			console.log("Selected conversation:", selectedConversation);
			setLoading(true);
			try {
				if (!selectedConversation?._id) {
					console.warn("No conversation selected");
					return;
				}
				const res = await fetch(`${API_BASE_URL}/api/message/${selectedConversation?._id}`, {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					}
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
