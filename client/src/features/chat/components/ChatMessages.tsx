
import { useGetChatHistory } from "@/hooks/useConversations";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import type { Message } from "@/lib/types/message";

import { useRef, useEffect } from "react";

const ChatMessages = () => {
  const { selectedConversationId } = useChatStore();
  const { data: chatHistory, isLoading } = useGetChatHistory(
    selectedConversationId
  );
  const loggedInUser = useAuthStore((state) => state.user);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {isLoading && <p>Loading messages...</p>}
      {chatHistory?.conversation?.messages.map((message: Message) => (
        <div
          key={message._id}
          className={`flex ${
            message.sender._id === loggedInUser?._id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg ${
              message.sender._id === loggedInUser?._id
                ? "bg-customAccentTwo text-white"
                : "bg-muted text-foreground"
            }`}
          >
            {message.image && (
              <img
                src={message.image}
                alt="Sent image"
                className="rounded-md mb-2 max-w-full h-auto"
              />
            )}
            {message.content && <p>{message.content}</p>}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
};

export default ChatMessages;