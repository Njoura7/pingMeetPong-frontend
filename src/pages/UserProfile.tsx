
import type { RootState } from '../../src/app/store'; 
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';
import { useSendInvitationMutation } from '../features/invitations/invitationsApi'; 
import { updateInvitationStatus, selectInvitationStatus } from '../features/invitations/invitationsSlice';
import { toast } from 'react-toastify';
//shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const safeUserId = userId || ''; // Ensure userId is never undefined
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const { data: user, isError, isLoading } = useGetUserByIdQuery(safeUserId);
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const invitationStatus = useSelector((state: RootState) => selectInvitationStatus(state, safeUserId));
  console.log("invitationStatus:", invitationStatus)
  console.log("user:", user)
  const handleSendInvitation = async () => {
    if (currentUser.user && safeUserId) { 
      try {
        const response = await sendInvitation({ senderId: currentUser.user, recipientId: safeUserId }).unwrap();
        dispatch(updateInvitationStatus({ userId: safeUserId, status: 'sent' }));
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
    switch (invitationStatus) {
      case 'sent':
        return <Button disabled>Invitation Sent</Button>;
      case 'received':
        return (
          <>
            <Button onClick={() => toast.info("Accept functionality not implemented yet")}>Accept</Button>
            <Button onClick={() => toast.info("Decline functionality not implemented yet")}>Decline</Button>
          </>
        );
      default:
        return <Button onClick={handleSendInvitation} disabled={isSending || currentUser.user === userId}>
          {isSending ? 'Sending...' : 'Send Invitation'}
        </Button>;
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
