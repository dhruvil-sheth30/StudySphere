import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL, fetchOptions } from "../config/api.js";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return false;
		
		setLoading(true);
		try {
			console.log("Attempting login for:", username);
			
			const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: "POST",
				...fetchOptions,
				body: JSON.stringify({ username, password }),
			});

			console.log("Login response status:", res.status);
			
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
			
			console.log("Login successful:", data);
			console.log("Cookie received:", document.cookie);
			toast.success("Login successful!");
			return true; // Return success status
		} catch (error) {
			console.error("Login error:", error);
			toast.error(error.message || "Login failed");
			return false; // Return failure status
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
