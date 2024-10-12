import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { addPendingRequest, selectPendingRequests } from '../features/invitations/invitationsSlice';
import { useGetInvitationsQuery } from '../features/invitations/invitationsApi';
import { InvitationItem } from './InvitationItem';
import SocketContext from '../SocketContext';
import NotifSvg from '../svgs/NotifSvg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Assuming selectInvitations is meant to select either pendingRequests or sentRequests
// Adjust according to your actual selector

interface NotificationData {
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
}

export const InvitationsListener = () => {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const currentUser = useSelector(selectCurrentUser);
    const pendingRequests = useSelector(selectPendingRequests);

    const { data: invitationsData, refetch } = useGetInvitationsQuery(currentUser?.user || '', {
        skip: !currentUser?.user,
    });

    useEffect(() => {
        if (invitationsData) {
            console.log('Invitations data received:', invitationsData);
            invitationsData.pendingRequests.forEach(invitationId => {
                if (!pendingRequests.includes(invitationId)) {
                    dispatch(addPendingRequest(invitationId));
                }
            });
        }
    }, [invitationsData, dispatch, pendingRequests]);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notificationData: NotificationData) => {
            console.log('New notification received:', notificationData);
            setNotifications(prev => [...prev, notificationData]);
            dispatch(addPendingRequest(notificationData.senderId));
            refetch();
        };

        socket.on('newNotification', handleNewNotification);

        socket.on('connect', () => {
            console.log('Socket connected in InvitationsListener');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error in InvitationsListener:', error);
        });

        return () => {
            socket.off('newNotification', handleNewNotification);
            socket.off('connect');
            socket.off('connect_error');
        };
    }, [socket, dispatch, refetch]);

    const clearNotification = (senderId: string) => {
        setNotifications(prev => prev.filter(notif => notif.senderId !== senderId));
    };

    return (
        <div className="relative mb-4 lg:mb-0">
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <div className="relative">
                        <NotifSvg />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <DropdownMenuItem key={index} onSelect={() => clearNotification(notif.senderId)}>
                                <InvitationItem invitationId={notif.senderId} />
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
