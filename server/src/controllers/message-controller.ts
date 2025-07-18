import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

import mongoose from "mongoose";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId, content, image } = req.body;
        const senderId = (req as any).userInfo?.userId;

        // 1. Validate input
        if (!conversationId || (!content && !image)) {
            res.status(400).json({
                success: false,
                message:
                "Conversation ID and message content or image are required.",
            });
            return;
        }

        // 2. Find the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            res
                .status(404)
                .json({ success: false, message: "Conversation not found." });
            return;
        }

        // 3. Security Check: Ensure the sender is a participant
        const isParticipant = conversation.participants.includes(new mongoose.Types.ObjectId(senderId));
        if (!isParticipant) {
            res.status(403).json({
                success: false,
                message: "Unauthorized: You are not a participant in this conversation.",
            });
            return;
        }

        // 4. Create the message
        const newMessage = new Message({
            sender: senderId,
            conversationId: conversation._id,
            content: content || undefined, // Only set if content is provided
            image: image || "", // Default to empty string if no image
        });

        await newMessage.save();

        // 5. Update the conversation with the new message
        conversation.messages.push(newMessage._id);
        await conversation.save();

        await newMessage.populate("sender", "fullName profilePicture email");

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            newMessage,
        });
    } catch(e: any) {
        console.error("Error in sendMessage", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}