import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useChatStore } from "@/store/chatStore";
import { useGetChatHistory } from "@/hooks/useConversations";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/lib/types/user";
import { useCall } from "@/hooks/useCall";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface ChatHeaderProps {
  onUserSelect: (user: User) => void;
}

const ChatHeader = ({ onUserSelect }: ChatHeaderProps) => {
    const { selectedConversationId } = useChatStore();
    const loggedInUser = useAuthStore((state) => state.user);
    const { onlineUserIds } = useChatStore();

    const { callUser } = useCall();

    const { data: conversationData, isLoading } = useGetChatHistory(selectedConversationId);

    if (isLoading) {
      return (
        <header className="flex items-center gap-4 p-4 border-b border-border/40">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </header>
      );
    }

    const otherUser = conversationData?.conversation.participants.find((p: any) => p._id !== loggedInUser?._id);
    const isOnline = otherUser ? onlineUserIds.includes(otherUser._id) : false;

    if (!otherUser) {
        return (
        <header className="flex items-center gap-4 p-4 border-b border-border/40">
        User not found
        </header>
        );
    }

    return (
        <header className="flex items-center justify-between p-4 border-b border-border/40">
        <div
            className="cursor-pointer flex items-center gap-3"
            onClick={() => onUserSelect(otherUser)}
        >
        <Avatar>
            <AvatarImage
            src={otherUser.profilePicture} alt={otherUser.fullName}
            />
            <AvatarFallback>{otherUser.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-lg font-bold text-customPrimary">{otherUser.fullName}</h2>
            <div className="flex items-center gap-2">
             {isOnline ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-customAccentOne"></span>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400"></span>
            <p className="text-sm text-muted-foreground">Offline</p>
            </div>
          )}
            </div>
        </div>
        </div>
        <div className="flex items-center pr-4 gap-3">
          <Button size="lg" 
          className="bg-customAccentOne/90 text-white cursor-pointer hover:bg-customAccentOne/80 transition-colors"
          variant="outline" 
          onClick={() => callUser(otherUser._id)}>
            <Video className="h-5 w-5 text-customPrimary" />
          </Button>
      </div>
        </header>
    );
};

export default ChatHeader;