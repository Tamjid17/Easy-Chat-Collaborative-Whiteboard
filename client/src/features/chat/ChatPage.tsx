import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import UserProfile from "./components/UserProfile";
import { useState } from "react";

export default function ChatPage() {

    const [selectedChat, setSelectedChat] = useState(true);

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
            <UserProfile />
            )}
        </main>
        </div>
    );
}
