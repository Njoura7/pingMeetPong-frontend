import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useGetUserByIdQuery } from '@/features/users/usersApi';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import UserActionButton from '@/components/UserActionButton';

import BackArrowSvg from '@/svgs/BackArrowSvg.svg';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const safeUserId = userId || '';
  const currentUser = useSelector(selectCurrentUser);
  const { data: user, isError, isLoading } = useGetUserByIdQuery(safeUserId, {
    skip: !safeUserId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <div>User not found</div>;

  return (
    <>
      <Link to="/dashboard">
        <img src={BackArrowSvg} alt="back-arrow" className="cursor-pointer" />
      </Link>
      <Card className="p-10 flex justify-around items-center">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.avatar || undefined} alt="User Avatar" />
          <AvatarFallback>X</AvatarFallback>
        </Avatar>
        <div className="text-2xl font-semibold">{user.username}</div>
        {currentUser.user !== userId && <UserActionButton userId={safeUserId} />}
      </Card>
    </>
  );
};

export default UserProfile;
