import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { groupMessagesByDate } from "../../utils/messageUtils";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	const [groupedMessages, setGroupedMessages] = useState({});
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		// Group messages by date for better UI organization
		if (messages && messages.length > 0) {
			setGroupedMessages(groupMessagesByDate(messages));
		}
	}, [messages]);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div className='px-4 flex-1 overflow-auto'>
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


