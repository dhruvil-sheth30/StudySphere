import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, fetchWithErrorHandling } from "../config/api";
import { useAuthContext } from "../context/AuthContext";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		const getConversations = async () => {
			// Only fetch conversations if user is authenticated
			if (!authUser) {
				return;
			}

			setLoading(true);
			try {
				console.log("Fetching conversations...");
				const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/users`);
				console.log("Conversations data:", data);
				setConversations(data);
			} catch (error) {
				console.error("Error fetching conversations:", error.message);
				// Only show error toast if the user is authenticated
				if (authUser) {
					toast.error(error.message || "Failed to load conversations");
				}
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [authUser]); // Re-run when authUser changes

	return { loading, conversations };
};
export default useGetConversations;
