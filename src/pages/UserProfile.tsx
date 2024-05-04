import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserByIdQuery } from '../features/users/usersApi';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import UserActionButton from '../components/UserActionButton'; // Import the UserActionButton component

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const safeUserId = userId || ''; // Ensure userId is never undefined
  const currentUser = useSelector(selectCurrentUser);
  const { data: user, isError, isLoading } = useGetUserByIdQuery(safeUserId, {
    skip: !safeUserId, // Skip the query if safeUserId is not available
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
      {/* Conditionally render UserActionButton if the profile is not of the current user */}
      {currentUser.user !== userId && <UserActionButton />}
    </Card>
  );
};

export default UserProfile;