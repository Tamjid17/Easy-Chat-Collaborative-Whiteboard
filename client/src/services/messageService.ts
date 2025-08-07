import apiClient from "../api/apiClient";

export const sendMessage = async (conversationId: string, content: string) => {
    const { data } = await apiClient.post("/messages", {
        conversationId,
        content,
    });
    return data;
};
