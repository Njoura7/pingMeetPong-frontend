import React from 'react';
import { Button } from '@/components/ui/button';
import { useSendInvitationMutation, useHandleInvitationMutation, useGetInvitationsQuery } from '../features/invitations/invitationsApi';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface UserActionButtonProps {
  userId: string;
}

const UserActionButton: React.FC<UserActionButtonProps> = ({ userId }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const [handleInvitation, { isLoading: isHandling }] = useHandleInvitationMutation();
  const { data: invitations, isLoading: isLoadingInvitations, isError } = useGetInvitationsQuery(currentUser?.user || '', {
    skip: !currentUser?.user,
  });

  const handleSendInvitation = async () => {
    if (!currentUser?.user || currentUser.user === userId) return;

    try {
      const response = await sendInvitation({ senderId: currentUser.user, recipientId: userId }).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send invitation');
    }
  };

  const handleInvitationResponse = async (action: 'accept' | 'reject') => {
    if (!currentUser?.user) {
      toast.error("Current user ID is not available.");
      return;
    }

    try {
      const response = await handleInvitation({
        userId: currentUser.user,
        invitationId: userId,
        action
      }).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      console.error(`Error ${action}ing invitation:`, error);
      toast.error(error.data?.message || `Failed to ${action} invitation`);
    }
  };

  if (!currentUser?.user || !userId || isLoadingInvitations) {
    return <Button disabled>Loading...</Button>;
  }

  if (isError) {
    return <Button disabled>Error loading invitations</Button>;
  }

  if (invitations) {
    const { friends, sentRequests, pendingRequests } = invitations;
    if (friends.includes(userId)) {
      return <Button disabled>Friends</Button>;
    } else if (sentRequests.includes(userId)) {
      return <Button disabled>Invitation Sent</Button>;
    } else if (pendingRequests.includes(userId)) {
      return (
        <>
          <Button onClick={() => handleInvitationResponse('accept')} disabled={isHandling}>
            {isHandling ? 'Processing...' : 'Accept'}
          </Button>
          <Button onClick={() => handleInvitationResponse('reject')} disabled={isHandling}>
            {isHandling ? 'Processing...' : 'Decline'}
          </Button>
        </>
      );
    }
  }

  return (
    <Button onClick={handleSendInvitation} disabled={isSending}>
      {isSending ? 'Sending...' : 'Send Invitation'}
    </Button>
  );
};

export default UserActionButton;
