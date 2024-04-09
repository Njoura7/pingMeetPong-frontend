import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addInvitation } from '../features/invitations/invitationsSlice';

import SocketContext from '../SocketContext';
import { CreateMatchDialog } from './CreateMatchDialog';
import { JoinMatchDialog } from './JoinMatchDialog';
import { ProfileButton } from './ProfileButton';
import { LogoutButton } from './LogoutButton';

import  NotifSvg  from '../svgs/NotifSvg';


// Define the type of the notification data
interface NotificationData {
  senderId: string;
  senderUsername: string;
  senderAvatar: string;
}

const Header = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  // Define the type of notification when declaring it with useState
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
    
    useEffect(() => {
      if (socket) {
        socket.on('newNotification', (notificationData: NotificationData) => {
          // Check if senderId, recipientId, senderUsername, and senderAvatar are present in notificationData
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
            console.log('New notification received. Notification data:', notificationData);
          }
        });
      }
    }, [socket, dispatch]);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Rest of your component
  return (
    <>
        <header className="p-4 text-white flex flex-col lg:flex-row justify-between items-center">
    <div className="flex flex-col lg:flex-row items-center">
      <div className="font-bold text-xl w-24 h-24 flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
        <img className="w-full h-full object-cover" src="/public/pingMeetpong-logo.png" alt="Logo" /> 
        <div className="relative mb-4 lg:mb-0" onClick={handleDropdown}>
          <div className="relative">
            <NotifSvg />
            {notification && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
          </div>
          {dropdownOpen && notification && (
            <div className="absolute top-0 mt-12 right-0 bg-white text-black shadow-lg rounded py-2 w-64">
              <div className="px-4 py-2">
                <img src={notification.senderAvatar} alt="Avatar" className="w-8 h-8 rounded-full mr-3" />
                <p>You have a new friend request from {notification.senderUsername}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row items-center">
      
        <CreateMatchDialog />
        <JoinMatchDialog />
         <ProfileButton/>
          <LogoutButton/>

    </div>
        </header>  
    </>
  )
}

export default Header