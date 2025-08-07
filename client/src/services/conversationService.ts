import apiClient from "../api/apiClient";

export const getConversations = async () => {
    const { data } = await apiClient.get("/conversations");
    return data;
};

export const getChatHistory = async (conversationId: string) => {
    const { data } = await apiClient.get(`/conversations/${conversationId}`);
    return data;
};

export const createConversation = async (senderId: string, recipientId: string) => {
    const { data } = await apiClient.post("/conversations", {
        senderId,
        recipientId,
    });
    return data;
};