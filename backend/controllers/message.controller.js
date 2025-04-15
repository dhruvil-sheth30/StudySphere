import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, emitWithUserInfo } from "../socket/socket.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Require either a message or an imageUrl
        if (!message && !imageUrl) {
            return res.status(400).json({ error: "Message text or image is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Prepare message document
        const messageData = {
            senderId,
            receiverId,
        };
        
        // Only add non-empty fields
        if (message) messageData.message = message;
        if (imageUrl) messageData.imageUrl = imageUrl;
        
        const newMessage = new Message(messageData);

        // Add message to conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save both conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        // Add sender name to the message object for better UI display
        const sender = await User.findById(senderId).select("fullName");
        if (sender) {
            newMessage._doc.senderName = sender.fullName;
        }

        // Send real-time notification
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            await emitWithUserInfo(receiverSocketId, "newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
