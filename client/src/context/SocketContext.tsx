import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { SocketContext } from "@/hooks/useSocket";
import { useChatStore } from "@/store/chatStore";

export const SocketContextProvider = ({
    children,
    }: {
    children: React.ReactNode;
    }) => {
    const socketRef = useRef<Socket | null>(null);
    const { user, isAuthenticated } = useAuthStore();
    const { setOnlineUserIds } = useChatStore();

    useEffect(() => {
        if (isAuthenticated && user && !socketRef.current) {
            const newSocket = io("http://localhost:3001", {
                query: {
                userId: user._id,
                },
            });

            socketRef.current = newSocket;

            newSocket.on("onlineUsers", (ids: string[]) => {
                setOnlineUserIds(ids);
            });
    }
    return () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    };
  }, [isAuthenticated, user, setOnlineUserIds]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
        </SocketContext.Provider>
    );
};
