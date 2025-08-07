import apiClient from "../api/apiClient";

export const sendMessage = async (payload: {conversationId: string, content: string}) => {
    const { conversationId, content } = payload;
    const { data } = await apiClient.post("/messages", {
        conversationId,
        content,
    });
    return data;
};
