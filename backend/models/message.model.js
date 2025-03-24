import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            // Only required if no image is present
            required: function() {
                return !this.imageUrl;
            },
            default: "", // Default to empty string for image-only messages
        },
        imageUrl: {
            type: String,
            // Only required if no text message is present
            required: function() {
                return this.message === "" || this.message === null || this.message === undefined;
            },
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
