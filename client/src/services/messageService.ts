import apiClient from "../api/apiClient";

interface SendMessagePayload {
    conversationId: string;
    content?: string;
    file?: File | null;
}

export const sendMessage = async (payload: SendMessagePayload) => {
    if(payload.file) {
        const formData = new FormData();
        formData.append("conversationId", payload.conversationId);
        if(payload.content) {
            formData.append("content", payload.content);
        }
        formData.append("image", payload.file);

        const { data } = await apiClient.post("/messages", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data.message;
    } else {
        const { conversationId, content } = payload;
        const { data } = await apiClient.post("/messages", {
            conversationId,
            content,
        });
        return data.message;
    }
};
