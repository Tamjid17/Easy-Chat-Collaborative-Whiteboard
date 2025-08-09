import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from 'cors';
import { createServer } from "http"
import { Server } from "socket.io";

import { connectToDB } from './database/db'
import userRoutes from './routes/user-routes';
import conversationRoutes from './routes/conversation-routes';
import messageRoutes from './routes/message-routes';
import User from './models/User';
import Conversation from './models/Conversation';

const app: Express = express();
connectToDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId as string;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        User.findByIdAndUpdate(userId, { activeStatus: true }).exec();
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    io.emit("onlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        let disconnectedUserId: string | null = null;
        for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
            disconnectedUserId = key;
            userSocketMap.delete(key);
            break;
        }
        }
        if (disconnectedUserId) {
            User.findByIdAndUpdate(disconnectedUserId, { activeStatus: false }).exec();
            io.emit("onlineUsers", Array.from(userSocketMap.keys()));
        }
    });

    socket.on('sendMessage', async (data) => {
        try {
        const conversation = await Conversation.findById(data.conversationId)
            .populate('participants');
        
        if (!conversation) return;
        
        const otherParticipant = conversation.participants.find(
            (p: any) => p._id.toString() !== data.senderId
        );
        
        if (!otherParticipant) return;
        
        const sender = await User.findById(data.senderId);
        const receiver = await User.findById(otherParticipant._id);

        const senderId = data.senderId.toString();
        const otherParticipantId = otherParticipant._id.toString();

        const isSenderBlocked =
            receiver?.blockedUsers?.some(
            (blockedId: any) => blockedId.toString() === senderId
            ) || false;
        const isReceiverBlocked = sender?.blockedUsers?.some(
            (blockedId: any) => blockedId.toString() === otherParticipantId
        ) || false;

        if (!isSenderBlocked && !isReceiverBlocked) {
            const recipientSocketId = userSocketMap.get(otherParticipant._id.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("newMessage", data);
            }
        }
    } catch (error) {
        console.error('Socket sendMessage error:', error);
    }
    })
});

const PORT = process.env.PORT

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

export { io, userSocketMap };