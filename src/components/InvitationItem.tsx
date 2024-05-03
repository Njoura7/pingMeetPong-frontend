
import { useGetUserByIdQuery } from '../features/users/usersApi';

interface InvitationItemProps {
  invitationId: string;
}

export const InvitationItem = ({ invitationId }: InvitationItemProps) => {
  const { data: user, isSuccess } = useGetUserByIdQuery(invitationId);

  if (!isSuccess || !user) return null;

  return (
    <div className="flex items-center px-4 py-2">
      <img src={user.avatar} alt={`${user.username}'s avatar`} className="w-6 h-6 rounded-full mr-2" />
      <p>New invitation received from {user.username}</p>
    </div>
  );
};