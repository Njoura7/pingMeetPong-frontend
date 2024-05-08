import { useNavigate } from "react-router-dom";
import {  selectCurrentUser  } from '../features/auth/authSlice' 
import { useSelector } from 'react-redux'

import { Card } from "@/components/ui/card"
import {  Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const ProfileButton = () => {


    const { user,username, avatar } = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if (user) {
          navigate(`/profile/${user}`);
        } else {
          console.error('User or user ID is undefined');
        }
      };
  return (
    <div>
      <Card onClick={handleProfileClick}
            className="max-w-xs mx-4 bg-gray-800 hover:bg-gray-600 shadow-md 
                  rounded px-4 pt-4 pb-4 mb-4 lg:mb-0 lg:mx-0 flex items-center cursor-pointer">
        <Avatar className="w-8 h-8 rounded-full">
          <AvatarImage src={avatar||undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
          <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
        </Avatar>
        <div className="ml-2 text-gray-200 text-lg">{username}</div> 
      </Card>
    </div>
  )
}
