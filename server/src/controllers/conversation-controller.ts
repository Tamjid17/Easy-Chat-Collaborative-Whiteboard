import { Request, Response } from "express";
import Conversation from "../models/Conversation";

export const getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?._id;
        // 1. Validate userId
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        // 2. Fetch conversations for the user
        // Populate participants and messages with necessary fields
        const conversations = await Conversation.find({
            participants: userId,
        }).populate({
            path: 'participants',
            select: 'fullName profilePicture email',
        }).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'fullName profilePicture email',
            }
        }).sort({ updatedAt: -1 });
        if(!conversations || conversations.length === 0) {
            res.status(200).json([]);
            return;
        }

        res.status(200).json({
            success: true,
            conversations,
        });
    } catch(e) {
        console.error("Error in getConversations", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { recipientId } = req.body;
        const senderId = (req as any).user?._id;

        // 1. Validate input
        if (!recipientId) {
            res.status(400).json({ success: false, message: "Recipient ID is required." });
            return;
        }

        // 2. Check if a conversation between these two users already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });
        
        const populated = await existingConversation?.populate(
            "participants",
            "fullName profilePicture email"
        );

        // 3. If conversation exists, return it
        if (existingConversation) {
            res.status(200).json({
                success: true,
                message: "Conversation already exists.",
                conversation: populated,
            });
            return;
        }

        // 4. Create a new conversation
        const newConversation = new Conversation({
            participants: [senderId, recipientId],
        });
        await newConversation.save();

        // 5. Populate the conversation with participant details
        const populatedConversation = await Conversation.findById(
            newConversation._id
        ).populate("participants", "fullName profilePicture email");

        res.status(201).json({
            success: true,
            message: "Conversation created successfully.",
            conversation: populatedConversation,
        });
    } catch(e: any) {
        console.error("Error in createConversation", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?._id;
        const { conversationId } = req.params;

        // 1. Validate conversationId
        if (!conversationId) {
            res.status(400).json({
                success: false,
                message: "Conversation ID is required",
            });
            return;
        }

        // 2. Find the specific conversation
        const conversation = await Conversation.findById(conversationId)
            .populate({
                path: "participants",
                select: "_id fullName profilePicture email joinedAt blockedUsers activeStatus",
            })
            .populate({
                path: "messages",
                populate: {
                    path: "sender",
                    select: "fullName profilePicture email",
                },
            });

        // If no conversation is found
        if (!conversation) {
            res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
            return;
        }

        // 3. Security Check: Ensure the user is part of this conversation
        const isParticipant = conversation.participants.some(
            (p: any) => p._id.toString() === userId.toString()
        );

        if (!isParticipant) {
            res.status(403).json({
                success: false,
                message: "Unauthorized: You are not a participant in this conversation.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            conversation,
        });
    } catch(e: any) {
        console.error("Error in getChatHistory", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}