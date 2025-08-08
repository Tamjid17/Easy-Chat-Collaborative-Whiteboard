import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useChatStore } from "@/store/chatStore";
import { useGetChatHistory } from "@/hooks/useConversations";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/lib/types/user";

interface ChatHeaderProps {
  onUserSelect: (user: User) => void;
}

const ChatHeader = ({ onUserSelect }: ChatHeaderProps) => {
    const { selectedConversationId } = useChatStore();
    const loggedInUser = useAuthStore((state) => state.user);

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

    if (!otherUser) {
        return (
        <header className="flex items-center gap-4 p-4 border-b border-border/40">
        User not found
        </header>
        );
    }

    return (
        <header className="flex items-center gap-4 p-4 border-b border-border/40">
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
            <span className="h-2 w-2 rounded-full bg-customAccentOne"></span>
            <p className="text-sm text-muted-foreground">Online</p>
            </div>
        </div>
        </div>
        </header>
    );
};

export default ChatHeader;