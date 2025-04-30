import { useState, useRef, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();
	const searchResultsRef = useRef(null);
	
	// Filter conversations as user types
	useEffect(() => {
		if (search.length >= 2) {
			const filteredResults = conversations.filter((c) => 
				c.fullName.toLowerCase().includes(search.toLowerCase()) || 
				c.username.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredUsers(filteredResults);
			setShowResults(true);
		} else {
			setShowResults(false);
		}
	}, [search, conversations]);
	
	// Handle clicking outside of search results to close it
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (searchResultsRef.current && !searchResultsRef.current.contains(e.target)) {
				setShowResults(false);
			}
		};
		
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		
		if (search.length < 2) {
			return toast.error("Search term must be at least 2 characters long");
		}

		const conversation = conversations.find((c) => 
			c.fullName.toLowerCase().includes(search.toLowerCase()) ||
			c.username.toLowerCase().includes(search.toLowerCase())
		);

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
			setShowResults(false);
		} else toast.error("No such user found!");
	};
	
	const handleUserSelect = (conversation) => {
		setSelectedConversation(conversation);
		setSearch("");
		setShowResults(false);
	};
	
	const clearSearch = () => {
		setSearch("");
		setShowResults(false);
	};
	
	return (
		<div className="relative">
			<form onSubmit={handleSubmit} className='flex items-center gap-2'>
				<div className="relative flex-1">
					<input
						type='text'
						placeholder='Search users...'
						className='input input-bordered rounded-full w-full pr-8'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					{search && (
						<button 
							type="button" 
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							onClick={clearSearch}
						>
							<MdClose size={18} />
						</button>
					)}
				</div>
				<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
					<IoSearchSharp className='w-6 h-6 outline-none' />
				</button>
			</form>
			
			{/* Dynamic search results */}
			{showResults && filteredUsers.length > 0 && (
				<div 
					ref={searchResultsRef}
					className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg z-10 max-h-60 overflow-auto"
				>
					<ul>
						{filteredUsers.map(user => (
							<li 
								key={user._id} 
								className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
								onClick={() => handleUserSelect(user)}
							>
								<div className="avatar">
									<div className="w-8 rounded-full">
										<img src={user.profilePic} alt={user.fullName} />
									</div>
								</div>
								<div>
									<p className="font-medium text-sm text-white">{user.fullName}</p>
									<p className="text-xs text-gray-400">@{user.username}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
			
			{showResults && search.length >= 2 && filteredUsers.length === 0 && (
				<div className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg z-10 p-4 text-center">
					<p className="text-gray-400">No users found matching "{search}"</p>
				</div>
			)}
		</div>
	);
};
export default SearchInput;


