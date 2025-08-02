import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from 'cors'

import { connectToDB } from './database/db'
import userRoutes from './routes/user-routes';
import conversationRoutes from './routes/conversation-routes';
import messageRoutes from './routes/message-routes';

const app: Express = express();
connectToDB();

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

