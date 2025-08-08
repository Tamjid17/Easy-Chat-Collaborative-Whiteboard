import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Conversation } from "@/lib/types/conversation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({
    conversation,
    isSelected,
    onClick,
    }: ConversationItemProps) => {

    const loggedInUser = useAuthStore((state) => state.user);

    const otherUser = conversation.participants.find((p) => p._id !== loggedInUser?._id);
    const lastMessage = conversation.messages[conversation.messages.length - 1] || "No messages yet";

    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted",
          isSelected && "bg-customAccentTwo/20"
        )}
      >
        <Avatar>
          <AvatarImage
            src={otherUser?.profilePicture}
            alt={otherUser?.fullName}
          />
          <AvatarFallback>{otherUser?.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold text-foreground truncate">{otherUser?.fullName}</p>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    );
};

export default ConversationItem;