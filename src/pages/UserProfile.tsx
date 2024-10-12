import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import UserActionButton from '../components/UserActionButton';

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
    <Card>
      <Avatar>
        <AvatarImage src={user.avatar || undefined} alt="User Avatar" />
        <AvatarFallback>X</AvatarFallback>
      </Avatar>
      <div>{user.username}</div>
      {currentUser.user !== userId && <UserActionButton userId={safeUserId} />}
    </Card>
  );
};

export default UserProfile;