import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        content: {
            type: String,
            required: function(this: any) {
                return !this.image;
            },
        },
        image: {
            type: String,
            default: "",
        },
        },
        { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;