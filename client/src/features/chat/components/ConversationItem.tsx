import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
    name: string;
    lastMessage: string;
    isActive?: boolean;
}

const ConversationItem = ({
    name,
    lastMessage,
    isActive,
    }: ConversationItemProps) => {
    return (
        <div
        className={cn(
            "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted",
            isActive && "bg-customAccentTwo/20"
        )}
        >
        <Avatar>
            <AvatarImage
            src={`https://placehold.co/40x40/F8FFE5/4E4187?text=${name.charAt(
                0
            )}`}
            alt={name}
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-foreground truncate">{name}</p>
            <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
        </div>
        </div>
    );
};

export default ConversationItem;