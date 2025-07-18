import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema(
    {
        participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ],
        messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [], // Starts as an empty array
        },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null, // Starts as null
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;