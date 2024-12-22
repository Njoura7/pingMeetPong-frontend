import React, { createContext, useEffect, useRef, } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const SocketProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const currentUser = useSelector(selectCurrentUser);
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);

    useEffect(() => {
        if (currentUser?.user && !socketRef.current) {
            const socket = io(import.meta.env.VITE_BACKEND_URL, {
                query: { userId: currentUser.user },
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                transports: ['websocket']
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setIsConnected(false);
            });

            socketRef.current = socket;

            return () => {
                if (socket) {
                    socket.disconnect();
                    socketRef.current = null;
                    setIsConnected(false);
                }
            };
        }
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            isConnected
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
