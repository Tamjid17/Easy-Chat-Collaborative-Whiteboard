import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import UserProfile from "./components/UserProfile";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import type { User } from "@/lib/types/user";
import { useCall } from "@/hooks/useCall";
import { CallModal } from "./components/CallModal";
import { IncomingCallNotification } from "./components/IncomingCallNotification";

export default function ChatPage() {
  const { call, callAccepted } = useCall();

  const { selectedConversationId, setSelectedConversationId } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const [profileUser, setProfileUser] = useState<User | null>(user);


  const handleUserSelect = (user: User) => {
    setProfileUser(user);
    setSelectedConversationId(null);
  };

  const isChatView = !!selectedConversationId;
  const isProfileView = !!profileUser && !isChatView;

  return (
    <div className="font-sans h-screen w-full flex bg-customBackground">
      {/* Sidebar */}
      <Sidebar onUserSelect={handleUserSelect} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {isChatView ? (
          <>
            <ChatHeader onUserSelect={handleUserSelect} />
            <ChatMessages />
            <ChatInput />
          </>
        ) : isProfileView ? (
          <UserProfile user={profileUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading user profile...</p>
          </div>
        )}
      </main>
      {(call?.isReceivingCall || callAccepted) && <CallModal />}
      <IncomingCallNotification />
    </div>
  );
}
