import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

import mongoose from "mongoose";
import uploadImageFromBuffer from "../helpers/cloudinary-helper";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId, content } = req.body;
        const senderId = (req as any).user?._id;
        let imageUrl = '';
        let imagePublicId = '';

        // Check if an image file was uploaded
        if (req.file) {
          // upload to cloudinary using the helper function
            const { secure_url, public_id } = await uploadImageFromBuffer(req.file.buffer);
            imageUrl = secure_url;
            imagePublicId = public_id;
        }

        // 1. Validate input
        if (!conversationId || (!content && !imageUrl)) {
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
        const participantIds = conversation.participants.map(p => p.toString());
        const isParticipant = participantIds.includes(senderId.toString());

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
            content: content || '',
            image: imageUrl || "",
            imagePublicId: imagePublicId || '',
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