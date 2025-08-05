import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useBlockUser } from "@/hooks/useUser";
import type { User } from "@/lib/types/user";

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
    const { mutate: blockUser, isPending: isBlocking } = useBlockUser();

    const handleBlockUser = () => {
        if(!user?._id) return;
        blockUser(user._id);
    };
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
            src={
                user.profilePicture ||
                `https://placehold.co/96x96/F8FFE5/4E4187?text=${user.fullName.charAt(
                0
                )}`
            }
            alt={user.fullName}
            />
            <AvatarFallback>
            {user.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-customPrimary mb-1">
            {user.fullName}
        </h2>
        <p className="text-muted-foreground">
            Status: <span className="text-destructive">{user.activeStatus ? 'Active' : 'Inactive'}</span>
        </p>
        <p className="text-muted-foreground">Email: {user.email}</p>
        <p className="text-muted-foreground mb-6">Joined at: {user.joinedAt}</p>
        <Button
            onClick={handleBlockUser}
            disabled={isBlocking}
            className="bg-destructive/80 hover:bg-destructive text-destructive-foreground"
        >
            {isBlocking ? 'Blocking...' : 'Block User'}
        </Button>
        </div>
    );
};

export default UserProfile;