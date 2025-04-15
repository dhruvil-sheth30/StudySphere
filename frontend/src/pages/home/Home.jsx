import { useState, useEffect } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	// Check for mobile on initial render and when window resizes
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [mobileView, setMobileView] = useState(isMobile ? "sidebar" : "both");
	
	// Update isMobile state when window resizes
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			
			// If switching to desktop view, show both panels
			if (!mobile) {
				setMobileView("both");
			}
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	
	const toggleMobileView = () => {
		setMobileView(prev => prev === "sidebar" ? "chat" : "sidebar");
	};
	
	return (
		<div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg w-full max-w-6xl mx-auto'>
			{/* Responsive layout */}
			<div className={`flex w-full ${isMobile ? "flex-col" : "flex-row"}`}>
				{/* Sidebar - hidden on mobile when in chat view */}
				<div className={`
					${!isMobile ? "w-1/3 max-w-xs" : "w-full"}
					${isMobile && mobileView === "chat" ? "hidden" : "block"}
				`}>
					<Sidebar onSelectConversation={isMobile ? () => setMobileView("chat") : undefined} />
				</div>
				
				{/* Message Container - hidden on mobile when in sidebar view */}
				<div className={`
					${!isMobile ? "flex-1" : "w-full"}
					${isMobile && mobileView === "sidebar" ? "hidden" : "block"}
				`}>
					<MessageContainer onBackClick={isMobile ? toggleMobileView : null} />
				</div>
			</div>
		</div>
	);
};

export default Home;
