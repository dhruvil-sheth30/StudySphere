import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { FaArrowLeft } from "react-icons/fa";

const MessageContainer = ({ onBackClick }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	
	const isOnline = onlineUsers.includes(selectedConversation?._id);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col h-full'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header - Back button moved inside the header next to user info */}
					<div className='bg-gray-800 px-4 py-2 md:py-3 mb-2 shadow-md flex items-center justify-between'>
						<div className="flex items-center">
							{onBackClick && (
								<button 
									onClick={onBackClick} 
									className="mr-3 text-gray-300 hover:text-white block md:hidden"
									aria-label="Back to contacts"
								>
									<FaArrowLeft size={18} />
								</button>
							)}
							<div className={`avatar ${isOnline ? "online" : "offline"}`}>
								<div className='w-8 md:w-10 rounded-full'>
									<img src={selectedConversation.profilePic} alt='user avatar' />
								</div>
							</div>
							<div className="ml-3">
								<h3 className='text-gray-100 font-bold text-sm md:text-base'>
									{selectedConversation.fullName}
								</h3>
								<p className="text-xs text-gray-300">
									{isOnline ? "Online" : "Offline"}
								</p>
							</div>
						</div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName}</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-5xl md:text-7xl text-center text-gray-400 mt-5' />
			</div>
		</div>
	);
};


