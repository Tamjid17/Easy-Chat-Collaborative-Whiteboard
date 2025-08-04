import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = () => {
    return (
        <header className="flex items-center gap-4 p-4 border-b border-border/40">
        <Avatar>
            <AvatarImage
            src="https://placehold.co/40x40/F8FFE5/4E4187?text=J"
            alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-lg font-bold text-customPrimary">John Doe</h2>
            <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-customAccentOne"></span>
            <p className="text-sm text-muted-foreground">Online</p>
            </div>
        </div>
        </header>
    );
};

export default ChatHeader;