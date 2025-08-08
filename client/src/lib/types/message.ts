import type { User } from "./user";

export interface Message {
    _id: string;
    conversationId: string;
    sender: User;
    content: string;
    image?: string;
    imagePublicId?: string;
    createdAt: string;
    updatedAt: string;
}