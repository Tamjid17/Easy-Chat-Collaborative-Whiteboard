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
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        if (error.response?.status === 403) {
          toast.error("Message blocked", {
            description:
              errorMessage ||
              "Cannot send message due to blocking restrictions",
          });
        } else {
          toast.error("Failed to send message", {
            description: errorMessage || "Please try again",
          });
        }
      }
    },
  });
};
