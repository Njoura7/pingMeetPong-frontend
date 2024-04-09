import { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client"; 

const SocketContext = createContext<Socket | null>(null); // Provide null as the default value

export const SocketContextProvider = ({ children, userId }: { children: ReactNode, userId: string }) => {
    const [socket, setSocket] = useState<Socket | null>(null); 

    useEffect(() => {
        const socketIo = io("http://localhost:7000", {
            query: { userId },
        });
        setSocket(socketIo);

        return () => {
            socketIo.disconnect(); 
        };
    }, [userId]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketContext;