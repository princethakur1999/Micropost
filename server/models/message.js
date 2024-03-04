import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            trim: true,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true // Automatically create createdAt and updatedAt fields
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;