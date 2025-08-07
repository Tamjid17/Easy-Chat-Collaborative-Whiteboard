import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as messageService from "../services/messageService";
import { AxiosError } from "axios";

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (newMessage) => {
      const conversationId = newMessage.conversationId;
        toast.success("Message sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      const errorMessage = (error instanceof AxiosError && error.response?.data?.message) || "Failed to send message.";
      toast.error("Message Failed", { description: errorMessage });
    },
  });
};
