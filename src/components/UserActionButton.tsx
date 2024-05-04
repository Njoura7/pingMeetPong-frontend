
import { Button } from '@/components/ui/button';
import { useSendInvitationMutation, useHandleInvitationMutation } from '../features/invitations/invitationsApi';
import { selectPendingRequests, selectSentRequests, selectFriends, addFriend } from '../features/invitations/invitationsSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

import { useSelector,useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

const UserActionButton = () => {
  const pendingRequests = useSelector(selectPendingRequests);
  const sentRequests = useSelector(selectSentRequests);
  const friends = useSelector(selectFriends);
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useSelector(selectCurrentUser);
  const safeUserId = userId || ''; // Ensure userId is never undefined
  const [handleInvitation, { isLoading: isHandlingInvitation }] = useHandleInvitationMutation();
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
    
  if (friends.includes(safeUserId)) {
    return <span>Friend</span>;
  } else if (sentRequests.includes(safeUserId)) {
    return <Button disabled>Invitation Sent</Button>;
  } else if (pendingRequests.includes(safeUserId)) {
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

export default UserActionButton;