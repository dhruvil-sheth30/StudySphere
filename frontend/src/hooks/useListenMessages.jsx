import React, { useEffect } from "react";
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

			// CORRECT WAY TO CHECK: A message belongs to the current conversation if:
			// 1. It's sent by the current user TO the selected conversation user, OR
			// 2. It's received by the current user FROM the selected conversation user
			const isCurrentUserSender = newMessage.senderId === authUser._id;
			const isCurrentUserReceiver = newMessage.receiverId === authUser._id;
			const isTalkingWithSender = newMessage.senderId === selectedConversation._id;
			const isTalkingWithReceiver = newMessage.receiverId === selectedConversation._id;

			const isFromCurrentConversation = 
				(isCurrentUserSender && isTalkingWithReceiver) || 
				(isCurrentUserReceiver && isTalkingWithSender);

			// Log for debugging
			console.log("New message received:", {
				from: newMessage.senderId,
				to: newMessage.receiverId,
				content: newMessage.message || "(image)",
				belongsToCurrentConversation: isFromCurrentConversation
			});

			if (isFromCurrentConversation) {
				// Only add the message to the current view if it belongs here
				newMessage.shouldShake = true;
				setMessages((prevMessages) => [...prevMessages, newMessage]); // FIX: Functional Update
			} else {
				// This message belongs to a different conversation
				// Get the name from our contacts or use "Someone"
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
