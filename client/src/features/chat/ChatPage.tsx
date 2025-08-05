import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import UserProfile from "./components/UserProfile";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function ChatPage() {

    
    const user = useAuthStore((state) => state.user);
    const [selectedChat, setSelectedChat] = useState(false);

    return (
        <div className="font-sans h-screen w-full flex bg-customBackground">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
            {selectedChat ? (
            <>
                <ChatHeader />
                <ChatMessages />
                <ChatInput />
            </>
            ) : (
                    user ? (
                        <UserProfile user={user} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground">Loading user profile...</p>
                        </div>
                    )
                )}
        </main>
        </div>
    );
}
