import { SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSendMessage } from "@/hooks/useMessage";
import { useChatStore } from "@/store/chatStore";
import { useState } from "react";

const ChatInput = () => {
        const [content, setContent] = useState("");
        const { selectedConversationId } = useChatStore();
        const { mutate: sendMessage, isPending } = useSendMessage();

        const handleSend = () => {
          if (!content.trim() || !selectedConversationId) return;
            console.log(selectedConversationId, content);
            sendMessage({ conversationId: selectedConversationId, content });
            setContent("");
        };
    return (
      <footer className="p-4 border-t border-border/40">
        <div className="relative">
          <Input
            placeholder="Type your message..."
            className="pr-12 h-12 bg-muted"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-customPrimary hover:bg-customPrimary/90"
            onClick={handleSend}
            disabled={isPending}
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    );
};

export default ChatInput;