import { create } from "zustand";

interface ChatState {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  onlineUserIds: string[];
  setOnlineUserIds: (ids: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedConversationId: null,
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  onlineUserIds: [],
  setOnlineUserIds: (ids) => set({ onlineUserIds: ids }),
}));
