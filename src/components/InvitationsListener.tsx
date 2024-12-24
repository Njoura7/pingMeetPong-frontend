import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { addPendingRequest, selectPendingRequests } from '@/features/invitations/invitationsSlice';
import { useGetInvitationsQuery } from '@/features/invitations/invitationsApi';
import { InvitationItem } from './InvitationItem';
import SocketContext from '@/SocketContext';
import { NotifSvg } from '@/svgs/NotifSvg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationData {
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
}

export const InvitationsListener = () => {
    const dispatch = useDispatch();
    const { socket, isConnected } = useContext(SocketContext);
    const currentUser = useSelector(selectCurrentUser);
    const pendingRequests = useSelector(selectPendingRequests);

    const { data: invitationsData, refetch } = useGetInvitationsQuery(currentUser?.user || '', {
        skip: !currentUser?.user,
    });

    // Sync with initial data
    useEffect(() => {
        if (invitationsData?.pendingRequests) {
            invitationsData.pendingRequests.forEach(invitationId => {
                dispatch(addPendingRequest(invitationId));
            });
        }
    }, [invitationsData, dispatch]);

    // Handle real-time notifications
    useEffect(() => {
        if (!socket || !isConnected || !currentUser?.user) {
            return;
        }

        const handleNewNotification = (notificationData: NotificationData) => {
            console.log('Received new notification:', notificationData);
            dispatch(addPendingRequest(notificationData.senderId));
            refetch();
        };

        try {
            socket.on('newNotification', handleNewNotification);
        } catch (error) {
            console.error('Error setting up socket listener:', error);
        }

        return () => {
            if (socket) {
                try {
                    socket.off('newNotification', handleNewNotification);
                } catch (error) {
                    console.error('Error cleaning up socket listener:', error);
                }
            }
        };
    }, [socket, isConnected, currentUser, dispatch, refetch]);

    return (
        <div className="relative lg:mb-0">
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <div className="relative">
                        <NotifSvg />
                        {pendingRequests.length > 0 && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((invitationId) => (
                            <DropdownMenuItem key={invitationId}>
                                <InvitationItem invitationId={invitationId} />
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
