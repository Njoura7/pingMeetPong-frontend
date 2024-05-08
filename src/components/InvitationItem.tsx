
import { useNavigate } from 'react-router-dom'; 

import { useGetUserByIdQuery } from '../features/users/usersApi';

interface InvitationItemProps {
  invitationId: string;
}

export const InvitationItem = ({ invitationId }: InvitationItemProps) => {
  const navigate = useNavigate(); 

  const { data: user, isSuccess } = useGetUserByIdQuery(invitationId);

  if (!isSuccess || !user) return null;
  const handleClick = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <div className="flex items-center px-4 py-2 cursor-pointer" onClick={handleClick}>
      <img src={user.avatar} alt={`${user.username}'s avatar`} className="w-6 h-6 rounded-full mr-2" />
      <p>New invitation received from {user.username}</p>
    </div>
  );
};