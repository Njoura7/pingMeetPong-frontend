import { useContext, useEffect , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { addPendingInvitation } from '../features/invitations/invitationsSlice';
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
import { selectPendingRequests } from '../features/invitations/invitationsSlice';

interface NotificationData {
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
}

export const InvitationsListener = () => {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const currentUserId = currentUser.user;
    const invitations = useSelector(selectPendingRequests); // Adjusted to use selectPendingRequests

    const { data: serverResponse } = useGetInvitationsQuery(currentUserId || '');

    useEffect(() => {
        if (serverResponse) {
          console.log('Server response received:', serverResponse);
          const uniqueInvitations = serverResponse.pendingRequests.filter(invitationId => !invitations.includes(invitationId));
          uniqueInvitations.forEach(invitationId => {
            dispatch(addPendingInvitation(invitationId));
          });
        }
      }, [serverResponse, dispatch, invitations]);

    useEffect(() => {
        console.log('Setting up socket listener'); // Debugging log
        const handleNewNotification = (notificationData: NotificationData) => {
            if ('senderId' in notificationData) {
                dispatch(addPendingInvitation(notificationData.senderId));
                setNotification(notificationData);
            }
        };
    
        socket?.on('newNotification', handleNewNotification);
    
        return () => {
            console.log('Cleaning up socket listener'); // Debugging log
            socket?.off('newNotification', handleNewNotification);
        };
    }, [socket, dispatch]);

    return (
        <div className="relative mb-4 lg:mb-0">
            <DropdownMenu onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                    <NotifSvg />
                    {notification && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        {dropdownOpen && invitations.map((invitationId, index) => (
                        <DropdownMenuItem key={index}>
                            <InvitationItem invitationId={invitationId} />
                        </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}