import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { io, userSocketMap } from "../server";

import uploadImageFromBuffer from "../helpers/cloudinary-helper";
import User from "../models/User";

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

        const otherParticipantId = conversation.participants.find(p => p.toString() !== senderId.toString());

        if (!otherParticipantId) {
            res.status(404).json({
                success: false,
                message: "Invalid conversation: No other participants found.",
            });
            return;
        }

        // 4. Check if sender or receiver is blocked
        const sender = await User.findById(senderId);
        const receiver = await User.findById(otherParticipantId);

        if (!sender || !receiver) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        const isSenderBlocked =
            receiver?.blockedUsers?.some((blockedId: any) => blockedId.toString() === senderId.toString()) || false;
        const isReceiverBlocked =
            sender?.blockedUsers?.some((blockedId: any) =>blockedId.toString() === otherParticipantId.toString()) || false;

        if (isSenderBlocked || isReceiverBlocked) {
            res.status(403).json({
                success: false,
                message: "Cannot send message due to blocking restrictions",
            });
            return;
        }

        // 5. Create the message
        const newMessage = new Message({
            sender: senderId,
            conversationId: conversation._id,
            content: content || '',
            image: imageUrl || "",
            imagePublicId: imagePublicId || '',
        });

        await Promise.all([
            newMessage.save(),
            Conversation.updateOne(
                { _id: conversationId },
                {
                $push: { messages: newMessage._id },
                $set: { lastMessage: newMessage._id },
                }
            ),
        ]);

        await newMessage.populate("sender", "fullName profilePicture email");

        conversation.participants.forEach((participantId) => {
            if (participantId.toString() === senderId.toString()) return;

            const recipientSocketId = userSocketMap.get(participantId.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("newMessage", newMessage);
            }
        });

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