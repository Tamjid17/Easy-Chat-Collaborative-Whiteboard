import { ImagePlus, SendHorizonal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSendMessage } from "@/hooks/useMessage";
import { useChatStore } from "@/store/chatStore";
import { useRef, useState } from "react";

const ChatInput = () => {
        const [content, setContent] = useState("");
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const { selectedConversationId } = useChatStore();
        const { mutate: sendMessage, isPending } = useSendMessage();

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