import React, { createContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        if (currentUser && currentUser.user) {
            const newSocket = io('http://localhost:7000', { // Update this line
                query: { userId: currentUser.user }
            });
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            return () => {
                newSocket.close();
            };
        }
    }, [currentUser]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;