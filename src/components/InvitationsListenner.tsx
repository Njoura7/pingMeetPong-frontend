import { useContext, useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { addInvitation, selectInvitations } from '../features/invitations/invitationsSlice';
import { useGetInvitationsQuery } from '../features/invitations/invitationsApi';

import SocketContext from '../SocketContext';

import  NotifSvg  from '../svgs/NotifSvg';
//shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NotificationData {
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
  }

  
export const InvitationsListenner = () => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    // Define the type of notification when declaring it with useState
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const currentUser = useSelector(selectCurrentUser);
    const currentUserId = currentUser.user;
      // Select the invitations from the state
      const invitations = useSelector(selectInvitations);
  
    // Fetch invitations from the server
    const { data: serverResponse } = useGetInvitationsQuery(currentUserId||'');
    
    useEffect(() => {
      // Check if serverResponse and serverResponse.data exist
      if (serverResponse && serverResponse.data) {
        // Store the invitations in the state
        serverResponse.data.forEach(invitation => {
          dispatch(addInvitation(invitation));
        });
      }
    }, [serverResponse, dispatch]);
  
      useEffect(() => {
        if (socket) {
          socket.on('newNotification', (notificationData: NotificationData) => {
            // Check if senderId, senderUsername, and senderAvatar are present in notificationData
            if (
              'senderId' in notificationData && typeof notificationData.senderId === 'string' &&
              'senderUsername' in notificationData && typeof notificationData.senderUsername === 'string' &&
              'senderAvatar' in notificationData && typeof notificationData.senderAvatar === 'string'
            ) {
              
              // Dispatch the action to add the new invitation to the state
              dispatch(addInvitation({
                _id: notificationData.senderId,
                username: notificationData.senderUsername,
                avatar: notificationData.senderAvatar
              }));
      
              // Set the notification data in state
              setNotification(notificationData);
            }
          });
        }
      }, [socket, dispatch]);
  
   
  return (
    <>
       <div className="relative mb-4 lg:mb-0">
       <DropdownMenu  onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger>
              <NotifSvg />
              {notification && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
            
          
          {dropdownOpen && (
            <>
            {invitations.map((invitation, index) => (
              <DropdownMenuItem>
              <div key={index} className="flex items-center  px-4 py-2">
                <img src={invitation.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-4" />
                <p>You have a new friend request from {invitation.username}</p>
              </div>
                </DropdownMenuItem>
              ))}
              </>  
            
          )}
          </DropdownMenuContent>
              </DropdownMenu>
        </div>
    </>
  )
}
