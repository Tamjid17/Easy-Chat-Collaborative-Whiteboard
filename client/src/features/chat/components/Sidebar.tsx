import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConversationItem from "./ConversationItem";

const Sidebar = () => {
    return (
        <aside className="w-full max-w-xs h-screen flex flex-col bg-card border-r border-border/40 p-4">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage
                src="https://placehold.co/40x40/F8FFE5/4E4187?text=U"
                alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-foreground">Your Name</span>
            </div>
            <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10 bg-background" />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto -mr-4 pr-4">
            <div className="space-y-2">
            {/* Example Conversation Items */}
            <ConversationItem
                name="John Doe"
                lastMessage="How are you?"
                isActive={true}
            />
            <ConversationItem name="Jane Smith" lastMessage="I am fine" />
            <ConversationItem name="Alice" lastMessage="See you tomorrow!" />
            <ConversationItem name="Bob" lastMessage="Okay, sounds good." />
            </div>
        </div>
        </aside>
    );
};

export default Sidebar;