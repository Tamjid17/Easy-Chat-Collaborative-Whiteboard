import { ImagePlus, SendHorizonal, ShieldAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSendMessage } from "@/hooks/useMessage";
import { useChatStore } from "@/store/chatStore";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGetChatHistory } from "@/hooks/useConversations";

const ChatInput = () => {
        const [content, setContent] = useState("");
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const { selectedConversationId } = useChatStore();
        const loggedInUser = useAuthStore((state) => state.user);
        const { mutate: sendMessage, isPending } = useSendMessage();

        const { data: conversationData, isLoading } = useGetChatHistory(selectedConversationId);
        
        
        
        if (isLoading) {
          return (
              <footer className="p-4 border-t border-border/40">
          <div className="relative">
            <Input
              placeholder="Loading chat..."
              className="h-12 bg-muted"
              disabled
              />
          </div>
        </footer>
      );
    }
    
    const otherUser = conversationData?.conversation.participants.find((p: any) => p._id !== loggedInUser?._id);

    const isBlockedByYou = loggedInUser?.blockedUsers?.some(
        (blockedId: any) => blockedId.toString() === otherUser?._id?.toString()
      ) || false;
    const isBlockedByOther = otherUser?.blockedUsers?.some(
      (blockedId: any) => blockedId.toString() === loggedInUser?._id?.toString()
    ) || false;

    const otherUserName = otherUser?.fullName || "User";
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    };
    
    const handleSend = () => {
      if ((!content || !content.trim()) && !selectedFile) return;
      if (!selectedConversationId) return;
      
      sendMessage({ 
        conversationId: selectedConversationId, 
          content: content,
          file: selectedFile});

        setContent("");
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      
      const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          //event.preventDefault();
          handleSend();
        }
      };
    
    if (isBlockedByYou || isBlockedByOther) {
        return (
            <div className="p-4 border-t border-border/40 text-center text-muted-foreground">
                <ShieldAlert className="h-6 w-6 mx-auto mb-2 text-destructive" />
                {isBlockedByYou 
                    ? `You have blocked ${otherUserName}. Unblock them to continue chatting.`
                    : `You have been blocked by ${otherUserName}.`
                }
            </div>
        );
    }

    return (
      <footer className="p-4 border-t border-border/40">
        {/* Image Preview */}
        {previewUrl && (
          <div className="relative w-24 h-24 mb-2">
            <img
              src={previewUrl}
              alt="Selected file preview"
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-0 right-0 h-6 w-6"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative">
          {/* Image File Input */}
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder="Type your message..."
            className="pl-12 pr-12 h-12 bg-muted"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
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