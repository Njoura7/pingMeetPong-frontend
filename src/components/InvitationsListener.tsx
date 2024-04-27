import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { addInvitation, selectInvitations } from '../features/invitations/invitationsSlice';
import { useGetInvitationsQuery } from '../features/invitations/invitationsApi';
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
    const invitations = useSelector(selectInvitations);

    const { data: serverResponse } = useGetInvitationsQuery(currentUserId || '');

    useEffect(() => {
      if (serverResponse) {
        serverResponse.forEach(invitation => {
          dispatch(addInvitation(invitation));
        });
      }
    }, [serverResponse, dispatch]);

    useEffect(() => {
        socket?.on('newNotification', (notificationData: NotificationData) => {
            if ('senderId' in notificationData && 'senderUsername' in notificationData && 'senderAvatar' in notificationData) {
                dispatch(addInvitation({
                    _id: notificationData.senderId,
                    username: notificationData.senderUsername,
                    avatar: notificationData.senderAvatar
                }));
                setNotification(notificationData);
            }
        });

        return () => {
          socket?.off('newNotification');
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
                    {dropdownOpen && invitations.map((invitation, index) => (
                        <DropdownMenuItem key={index}>
                            <div className="flex items-center px-4 py-2">
                                <img src={invitation.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-4" />
                                <p>You have a new friend request from {invitation.username}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
