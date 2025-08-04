import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserProfile = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
            src="https://placehold.co/96x96/F8FFE5/4E4187?text=J"
            alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-customPrimary mb-1">John Doe</h2>
        <p className="text-muted-foreground">
            Status: <span className="text-destructive">Offline</span>
        </p>
        <p className="text-muted-foreground">Email: john.doe@example.com</p>
        <p className="text-muted-foreground mb-6">Joined at: 23/11/2025</p>
        <Button className="bg-destructive/80 hover:bg-destructive text-destructive-foreground">
            Block User
        </Button>
        </div>
    );
};

export default UserProfile;