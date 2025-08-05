import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConversationItem from "./ConversationItem";
import { useEffect, useState } from "react";
import { useSearchUsers } from "@/hooks/useUser";
import type { User } from "@/lib/types/user";
import { useAuthStore } from "@/store/authStore"; 
import UserSettingsModal from "./UserSettingsModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Sidebar = () => {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const handleLogout = () => {
        clearAuth();
        toast.info("You have been logged out.");
        navigate("/login");
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

      const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedQuery);

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
              <AvatarFallback>
                {user?.fullName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-foreground">
              {user?.fullName}
            </span>
          </div>
          <div className="flex items-center">
            <UserSettingsModal />
            <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Search Results
            </p>
            {isSearching && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}
            {searchResults?.users?.map((user: User) => (
              <div
                key={user._id}
                className="p-2 hover:bg-muted rounded-lg cursor-pointer"
              >
                {user.fullName}
              </div>
            ))}
          </div>
        )}

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