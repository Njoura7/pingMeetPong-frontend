import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';
import { useSendInvitationMutation } from '../features/invitations/invitationsApi'; // Import from invitationsApi.ts
import { toast } from 'react-toastify';
//shadcn components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const UserProfile = () => {
  const { userId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const userIdOrCurrentUser = userId || currentUser.user;

  const { data: user, isError, isLoading } = useGetUserByIdQuery(userIdOrCurrentUser || '');
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const [invitationSent, setInvitationSent] = useState(false);

  const handleSendInvitation = async () => {
    if (user) {
      try {
        const response = await sendInvitation({ senderId: currentUser.user||'', recipientId: userId||'' }).unwrap();
        console.log('Response:', response); // Log the response
        // alert(response.message);
        toast.success(response.message);
        // Update the state variable when the invitation is sent successfully
        setInvitationSent(true);
      } catch (error) {
        console.error("Error sending invitation:", error);
        const typedError = error as any;
        if (typedError.data) {
          alert(typedError.data.message);
        } else {
          alert('An error occurred while sending the invitation.');
        }
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div className="p-6 text-2xl">User not found</div>;
  }

  return (
    <Card className="flex items-center p-4">
      <Avatar className="w-24 h-24 mt-8">
        <AvatarImage src={user.data.avatar || undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
        <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
      </Avatar>
      <div className="ml-4 mt-8 text-gray-200 text-2xl">{user.data.username}</div>
      {currentUser.user !== userId && (
         <Button className="m-4" onClick={handleSendInvitation} disabled={isSending || invitationSent}>
          {isSending ? 'Sending...' : invitationSent ? 'Invitation Sent' : 'Friend Request'}
        </Button>
      )}
    </Card>
  );
};

export default UserProfile;