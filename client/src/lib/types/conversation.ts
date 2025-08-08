import type { Message } from "./message";
import type { User } from "./user";

export interface Conversation {
    _id: string;
    participants: User[];
    messages: Message[];
    lastMessage: Message | null;
    createdAt: string;
    updatedAt: string;
}