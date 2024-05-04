import { useSelector,useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';
import { useSendInvitationMutation, useGetInvitationsQuery, useHandleInvitationMutation } from '../features/invitations/invitationsApi';
import { selectPendingRequests, selectSentRequests, selectFriends, addFriend } from '../features/invitations/invitationsSlice';

import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const safeUserId = userId || ''; // Ensure userId is never undefined
  const currentUser = useSelector(selectCurrentUser);
  const { data: user, isError, isLoading } = useGetUserByIdQuery(safeUserId, {
    skip: !safeUserId, // Skip the query if safeUserId is not available
  });

  const [handleInvitation, { isLoading: isHandlingInvitation }] = useHandleInvitationMutation();

  // Fetch current user's invitations to determine if there is an existing invitation

  useGetInvitationsQuery(currentUser?.user || '', {
    skip: !currentUser?.user,
  });

  const pendingRequests = useSelector(selectPendingRequests);
  const sentRequests = useSelector(selectSentRequests);
  const friends = useSelector(selectFriends); // Selector to check if the user is already a friend
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const dispatch = useDispatch();

  const handleSendInvitation = async () => {
    if (currentUser.user && safeUserId && currentUser.user !== safeUserId) {
      try {
        const response = await sendInvitation({ senderId: currentUser.user, recipientId: safeUserId }).unwrap();
        toast.success(response.message);
      } catch (error: unknown) { 
        // First, check if it's an object with a 'data' property
        if (typeof error === "object" && error !== null && 'data' in error) {
            const serverError = (error as { data: { message?: string } }).data;
            console.log("serverError", serverError);
        if (serverError.message) {
          toast.error(serverError.message);
        } 
      } 
      else {
        // Generic fallback error message
        toast.error("An unknown error occurred");     
      }
    }
    }
  };
  const handleInvitationResponse = async (action: 'accept' | 'reject') => {
    if (!currentUser.user) {
      toast.error("Current user ID is not available.");
      return; // Exit the function if currentUser.user is null
    }
  
    try {
      const response = await handleInvitation({
        userId: currentUser.user, // Now guaranteed to be a string
        senderId: safeUserId,
        action: action
      }).unwrap();
      console.log("Response:", response);
      toast.success(`Invitation ${action}ed successfully.`);
      if (action === 'accept') {
        dispatch(addFriend(safeUserId)); // Update the state to include the new friend
      }
      // Additional logic to update UI or state as needed
    } catch (error) {
      toast.error(`Failed to ${action} invitation.`);
      // Error handling logic
    }
  };
  const renderButtonBasedOnStatus = () => {
    if (friends.includes(safeUserId)) {
      return <span>Friend</span>; // Display "Friend" if the user is already a friend
    } else if (sentRequests.includes(safeUserId)) {
      return <Button disabled>Invitation Sent</Button>;
    } else if (pendingRequests.includes(safeUserId)){
      return (
        <>
          <Button onClick={() => handleInvitationResponse('accept')} disabled={isHandlingInvitation}>
            {isHandlingInvitation ? 'Processing...' : 'Accept'}
          </Button>
          <Button onClick={() => handleInvitationResponse('reject')} disabled={isHandlingInvitation}>
            {isHandlingInvitation ? 'Processing...' : 'Decline'}
          </Button>
        </>
      );
    } else {
      return (
        <Button onClick={handleSendInvitation} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Invitation'}
        </Button>
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <div>User not found</div>;

  return (
    <Card>
      <Avatar>
        <AvatarImage src={user.avatar || undefined} alt="User Avatar" />
        <AvatarFallback>X</AvatarFallback>
      </Avatar>
      <div>{user.username}</div>
      {currentUser.user !== userId && renderButtonBasedOnStatus()}
    </Card>
  );
};

export default UserProfile;