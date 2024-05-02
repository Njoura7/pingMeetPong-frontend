import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';
import { useSendInvitationMutation, useGetInvitationsQuery } from '../features/invitations/invitationsApi';
import { selectPendingRequests, selectSentRequests } from '../features/invitations/invitationsSlice';

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

  // Fetch current user's invitations to determine if there is an existing invitation
  // Assuming currentUser.user.id is the correct way to access the current user's ID
  const { data: invitationsData } = useGetInvitationsQuery(currentUser?.user || '', {
    skip: !currentUser?.user, // Skip the query if currentUser.user.id is not available
  });

  const pendingRequests = useSelector(selectPendingRequests);
  const sentRequests = useSelector(selectSentRequests);
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();

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

  const renderButtonBasedOnStatus = () => {
    if (sentRequests.includes(safeUserId)) {
      return <Button disabled>Invitation Sent</Button>;
    } else if (pendingRequests.includes(safeUserId)) {
      return (
        <>
          <Button onClick={() => toast.info("Accept functionality not implemented yet")}>Accept</Button>
          <Button onClick={() => toast.info("Decline functionality not implemented yet")}>Decline</Button>
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