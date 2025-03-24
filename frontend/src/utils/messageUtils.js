/**
 * Groups messages by their date for better UI organization
 * @param {Array} messages - Array of message objects
 * @returns {Object} - Object with dates as keys and arrays of messages as values
 */
export function groupMessagesByDate(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
        return {};
    }
    
    const groupedMessages = {};
    
    messages.forEach(message => {
        if (!message.createdAt) return;

        // Get the date string (without the time)
        const messageDate = new Date(message.createdAt);
        const datePart = getMessageDateLabel(messageDate);
        
        // Create array for this date if it doesn't exist
        if (!groupedMessages[datePart]) {
            groupedMessages[datePart] = [];
        }
        
        // Add message to the appropriate date group
        groupedMessages[datePart].push(message);
    });
    
    return groupedMessages;
}

/**
 * Returns a user-friendly date label based on how recent the date is
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date label
 */
export function getMessageDateLabel(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for comparison
    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    
    // Return appropriate label based on date
    if (dateStr === todayStr) {
        return "Today";
    } else if (dateStr === yesterdayStr) {
        return "Yesterday";
    } else {
        // Format as Month Day, Year (e.g., March 15, 2025)
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}

/**
 * Checks if a message needs a time header (when there's a gap between messages)
 * @param {Object} currentMsg - Current message
 * @param {Object} prevMsg - Previous message
 * @returns {boolean} - Whether time header is needed
 */
export function shouldShowTimeGap(currentMsg, prevMsg) {
    if (!prevMsg) return true;
    
    const current = new Date(currentMsg.createdAt);
    const prev = new Date(prevMsg.createdAt);
    
    // Show time header if messages are more than 10 minutes apart
    const diffMinutes = (current - prev) / (1000 * 60);
    return diffMinutes > 10;
}

/**
 * Check if a message belongs to the current conversation
 * @param {Object} message - The message to check
 * @param {Object} currentUser - The current logged in user
 * @param {Object} selectedUser - The selected conversation user
 * @returns {boolean} - Whether the message belongs to this conversation
 */
export function isMessageInConversation(message, currentUser, selectedUser) {
    if (!message || !currentUser || !selectedUser) return false;
    
    const isCurrentUserSender = message.senderId === currentUser._id;
    const isCurrentUserReceiver = message.receiverId === currentUser._id;
    
    const isTalkingWithSender = message.senderId === selectedUser._id;
    const isTalkingWithReceiver = message.receiverId === selectedUser._id;
    
    return (
        (isCurrentUserSender && isTalkingWithReceiver) || 
        (isCurrentUserReceiver && isTalkingWithSender)
    );
}
