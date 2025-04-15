import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { groupMessagesByDate } from "../../utils/messageUtils";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	const [groupedMessages, setGroupedMessages] = useState({});
	const lastMessageRef = useRef();
	const messagesContainerRef = useRef();
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	
	// This ensures real-time message updates via socket.io
	useListenMessages();

	useEffect(() => {
		// Group messages by date for better UI organization
		if (messages && messages.length > 0) {
			setGroupedMessages(groupMessagesByDate(messages));
		} else {
			setGroupedMessages({});
		}
	}, [messages]);

	useEffect(() => {
		// Scroll to the latest message with a slight delay to ensure DOM is updated
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
		} else if (messagesContainerRef.current) {
			// If no last message ref (empty conversation), scroll to bottom of container
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [messages, groupedMessages]);
	
	// Debug info to help troubleshoot this issue
	const conversationInfo = selectedConversation ? {
		name: selectedConversation.fullName,
		id: selectedConversation._id,
		messageCount: messages.length
	} : null;

	return (
		<div 
			className='px-4 flex-1 overflow-y-auto' 
			style={{ height: '400px', maxHeight: 'calc(100vh - 230px)' }}
			ref={messagesContainerRef}
		>
			{/* Invisible debug info - can enable during testing */}
			{/* {conversationInfo && (
				<div className="hidden">
					Conversation with {conversationInfo.name} ({conversationInfo.id})
					Messages: {conversationInfo.messageCount}
					Current user: {authUser.fullName} ({authUser._id})
				</div>
			)} */}
			
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			
			{!loading && messages.length === 0 && (
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<div className="text-gray-400 mb-3 text-5xl">💬</div>
						<p className="text-center text-gray-400">Send a message to start the conversation</p>
					</div>
				</div>
			)}

			{!loading && messages.length > 0 && Object.keys(groupedMessages).map((date) => (
				<div key={date}>
					<div className="flex justify-center my-4">
						<span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
							{date}
						</span>
					</div>
					
					{groupedMessages[date].map((message, index) => (
						<div
							key={message._id || `msg-${date}-${index}`}
							ref={index === groupedMessages[date].length - 1 && 
								date === Object.keys(groupedMessages)[Object.keys(groupedMessages).length - 1] 
								? lastMessageRef : null}
							className="my-4"
						>
							<Message message={message} />
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Messages;


