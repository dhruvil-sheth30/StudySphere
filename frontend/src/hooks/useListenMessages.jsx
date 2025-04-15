import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (!socket || !selectedConversation || !authUser) return;

		// Function to handle new messages
		const handleNewMessage = (newMessage) => {
			// Play notification sound
			const sound = new Audio(notificationSound);
			sound.play();

			// FIXED: Enhanced message conversation check with clear variable names
			const iAmSender = newMessage.senderId === authUser._id;
			const iAmReceiver = newMessage.receiverId === authUser._id;
			
			const isWithSelectedUser = 
				(iAmSender && newMessage.receiverId === selectedConversation._id) || 
				(iAmReceiver && newMessage.senderId === selectedConversation._id);

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
				
				toast.custom((t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-3 cursor-pointer`}
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
						</div>
					</div>
				), {
					duration: 4000,
					position: "top-right",
				});
			}
		};

		// Listen for new messages
		socket.on("newMessage", handleNewMessage);

		// Cleanup function to remove listener when component unmounts
		return () => {
			socket.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages, selectedConversation, authUser]);

	return null;
};

export default useListenMessages;
