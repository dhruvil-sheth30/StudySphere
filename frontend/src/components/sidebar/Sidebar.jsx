import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Sidebar = ({ onSelectConversation }) => {
	const [showSearch, setShowSearch] = useState(true);
	
	return (
		<div className='border-r border-slate-500 p-4 flex flex-col h-full bg-gray-900 bg-opacity-70'>
			<div className='flex items-center justify-between mb-2'>
				<h2 className='text-xl font-bold text-white'>Contacts</h2>
				<button 
					className='text-gray-400 hover:text-white md:hidden'
					onClick={() => setShowSearch(!showSearch)}
				>
					{showSearch ? <FaChevronUp /> : <FaChevronDown />}
				</button>
			</div>
			
			{/* Collapsible search on mobile */}
			<div className={`${showSearch ? 'block' : 'hidden md:block'}`}>
				<SearchInput />
				<div className='divider px-3'></div>
			</div>
			
			<div className='flex-1 overflow-auto'>
				<Conversations onSelectConversation={onSelectConversation} />
			</div>
			
			<LogoutButton />
		</div>
	);
};
export default Sidebar;


