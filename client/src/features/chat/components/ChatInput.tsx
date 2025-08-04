import { SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatInput = () => {
    return (
        <footer className="p-4 border-t border-border/40">
        <div className="relative">
            <Input
            placeholder="Type your message..."
            className="pr-12 h-12 bg-muted"
            />
            <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-customPrimary hover:bg-customPrimary/90"
            >
            <SendHorizonal className="h-5 w-5" />
            </Button>
        </div>
        </footer>
    );
};

export default ChatInput;