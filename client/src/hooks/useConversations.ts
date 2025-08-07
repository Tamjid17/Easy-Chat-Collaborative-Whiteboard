import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as conversationService from "../services/conversationService";
import { useChatStore } from "../store/chatStore";
import { AxiosError } from "axios";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationService.getConversations,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetChatHistory = (conversationId: string | null) => {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => conversationService.getChatHistory(conversationId!),
    enabled: !!conversationId,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { setSelectedConversationId } = useChatStore();

  return useMutation({
    mutationFn: conversationService.createConversation,
    onSuccess: (newConversation) => {
      toast.success("Conversation started!");

      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      setSelectedConversationId(newConversation._id);
    },
    onError: (error) => {
      const errorMessage = (error instanceof AxiosError && error.response?.data?.message) || "Failed to create conversation.";
      toast.error("Conversation Failed", { description: errorMessage });
    },
  });
};
