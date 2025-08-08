import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

import { useBlockUser, useUnblockUser } from "@/hooks/useUser";
import type { User } from "@/lib/types/user";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useCreateConversation } from "@/hooks/useConversations";

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
    const { mutate: blockUser, isPending: isBlocking } = useBlockUser();
    const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser();

    const loggedInUser = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const { onlineUserIds } = useChatStore();
    const { mutate: createConversation, isPending: isCreating } = useCreateConversation();

    const handleStartConversation = () => {
        if (!user?._id) return;
        createConversation(user._id);
    };

    const isBlocked = loggedInUser?.blockedUsers.includes(user._id);
    const isOwnProfile = loggedInUser?._id === user._id;
    const isOnline = onlineUserIds.includes(user._id);

    const handleBlockUser = () => {
        if(!user?._id) return;
        blockUser(user._id);
    };

    const handleUnblockUser = () => {
        if(!user?._id) return;
        unblockUser(user._id);
    };

    const handleLogout = () => {
        clearAuth();
        window.location.reload();
    };
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Button
          onClick={handleStartConversation}
          disabled={isCreating}
          className="bg-customAccentTwo hover:bg-customAccentTwo/90 text-white font-semibold"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          {isCreating ? "Starting..." : "Start Chat"}
        </Button>
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
          Status
          <span className="text-destructive">
            {isOnline ? 
              (<p className="text-green-500">Online</p>) 
              : 
              (<p className="text-red-500">Offline</p>)
            }
          </span>
        </p>
        <p className="text-muted-foreground">Email: {user.email}</p>
        <p className="text-muted-foreground mb-6">Joined at: {user.joinedAt}</p>
        {!isOwnProfile ? (
          !isBlocked ? (
            <Button
              onClick={handleBlockUser}
              disabled={isBlocking}
              className="bg-destructive/80 hover:bg-destructive text-destructive-foreground"
            >
              {isBlocking ? "Blocking..." : "Block User"}
            </Button>
          ) : (
            <Button
              onClick={handleUnblockUser}
              disabled={isUnblocking}
              className="bg-destructive/80 hover:bg-destructive text-destructive-foreground"
            >
              {isUnblocking ? "Unblocking..." : "Unblock User"}
            </Button>
          )
        ) : (
          <Button
            onClick={handleLogout}
            className="bg-customAccentTwo cursor-pointer"
          >
            Log out
          </Button>
        )}
      </div>
    );
};

export default UserProfile;