import { create } from "zustand";

const useConversation = create((set, get) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => {
		// Handle both direct state and function updates
		if (typeof messages === "function") {
			set(state => ({ messages: messages(state.messages) }));
		} else {
			set({ messages });
		}
	},
	// Add helper function to add a single message
	addMessage: (message) => {
		const currentMessages = get().messages;
		// Check for duplicate messages by ID
		if (message._id && currentMessages.some(msg => msg._id === message._id)) {
			return; // Don't add duplicate message
		}
		set({ messages: [...currentMessages, message] });
	},
}));

export default useConversation;
