import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation, setSelectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket || !authUser) return;

		// Function to handle new messages
		const handleNewMessage = (newMessage) => {
			// Play notification sound
			const sound = new Audio(notificationSound);
			sound.play();

			// FIXED: Enhanced message conversation check with clear variable names
			const iAmSender = newMessage.senderId === authUser._id;
			const iAmReceiver = newMessage.receiverId === authUser._id;
			
			const isWithSelectedUser = 
				(iAmSender && newMessage.receiverId === selectedConversation?._id) || 
				(iAmReceiver && newMessage.senderId === selectedConversation?._id);

			if (isWithSelectedUser) {
				// Add the message to the current conversation
				newMessage.shouldShake = true;
				
				// Use functional update to ensure we're working with the latest state
				setMessages(prev => {
					// Prevent duplicate messages by checking if we already have this message ID
					if (prev.some(msg => msg._id === newMessage._id)) {
						return prev;
					}
					return [...prev, newMessage];
				});
			} else {
				// This message belongs to a different conversation
				const senderName = newMessage.senderName || "Someone";
				const senderID = newMessage.senderId;
				
				// Create a function that will redirect to this conversation when clicked
				const redirectToConversation = async () => {
					try {
						// Find the sender in our conversations list to get their full profile
						const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
						const response = await fetch(`${API_BASE_URL}/api/users`, {
							credentials: 'include',
						});
						
						if (!response.ok) {
							throw new Error("Failed to fetch conversations");
						}
						
						const users = await response.json();
						const userToRedirectTo = users.find(user => user._id === senderID);
						
						if (userToRedirectTo) {
							setSelectedConversation(userToRedirectTo);
							// If we're on mobile, need to show message view
							// This can be handled by the parent component
						} else {
							throw new Error("User not found");
						}
					} catch (error) {
						console.error("Error redirecting to conversation:", error);
						toast.error("Couldn't open conversation");
					}
				};
				
				// Show custom notification with click handler
				toast.custom((t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-3 cursor-pointer`}
						onClick={() => {
							redirectToConversation();
							toast.dismiss(t.id);
						}}
					>
						<div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-medium">
							{senderName.charAt(0).toUpperCase()}
						</div>
						<div>
							<h3 className="font-medium text-white">Message from {senderName}</h3>
							<p className="text-sm text-gray-300">
								{newMessage.message ? 
									(newMessage.message.length > 30 
										? newMessage.message.substring(0, 30) + "..." 
										: newMessage.message) 
									: "Sent an image"}
							</p>
							<p className="text-xs text-blue-400 mt-1">Click to view</p>
						</div>
					</div>
				), {
					duration: 5000,
					position: "top-right",
				});
			}
		};

		// Listen for user found event (fallback for redirectToChat)
		const handleUserFound = (user) => {
			if (user && user._id) {
				setSelectedConversation(user);
			}
		};

		// Listen for new messages
		socket.on("newMessage", handleNewMessage);
		socket.on("userFound", handleUserFound);

		// Cleanup function to remove listener when component unmounts
		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("userFound", handleUserFound);
		};
	}, [socket, setMessages, selectedConversation, authUser, setSelectedConversation, navigate]);

	return null;
};

export default useListenMessages;
