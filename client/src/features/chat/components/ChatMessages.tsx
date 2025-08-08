
import { useGetChatHistory } from "@/hooks/useConversations";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import type { Message } from "@/lib/types/message";

const ChatMessages = () => {
    const { selectedConversationId } = useChatStore();
    const { data: chatHistory, isLoading } = useGetChatHistory(selectedConversationId);
    const loggedInUser = useAuthStore((state) => state.user);
     
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {isLoading && <p>Loading messages...</p>}
      {chatHistory?.conversation?.messages.map((message: Message) => (
                <div key={message._id} className={`flex ${message.sender._id === loggedInUser?._id ? 'justify-end' : 'justify-start'}`}>
                    <div className= {`max-w-xs p-3 rounded-lg ${message.sender._id === loggedInUser?._id ? 'bg-customAccentTwo text-white' : 'bg-muted text-foreground'}`}>
                        <p>{message.content}</p>
                    </div>
                </div>
            ))}
    </div>
  );
};

export default ChatMessages;