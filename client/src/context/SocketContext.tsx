import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { SocketContext } from "@/hooks/useSocket";

export const SocketContextProvider = ({
    children,
    }: {
    children: React.ReactNode;
    }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
        const newSocket = io("http://localhost:3001", {
            query: {
            userId: user._id,
            },
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
        } else {
        if (socket) {
            socket.close();
            setSocket(null);
        }
        }
    }, [isAuthenticated, user, socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
        {children}
        </SocketContext.Provider>
    );
};
