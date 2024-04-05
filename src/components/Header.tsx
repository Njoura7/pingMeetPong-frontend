import { CreateMatchDialog } from './CreateMatchDialog';
import { JoinMatchDialog } from './JoinMatchDialog';

import {  selectCurrentUser  } from '../features/auth/authSlice' 
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { logOut  } from '../features/auth/authSlice' 

import  NotifSvg  from '../svgs/NotifSvg';

//shadcn components 
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


const Header = () => {
    const dispatch = useDispatch()
    const { user,username, avatar } = useSelector(selectCurrentUser);
    const handleLogout = () => {
      dispatch(logOut())
    }
    const navigate = useNavigate();
    if (!username) {  
      navigate("/login"); 
    }
    const handleProfileClick = () => {
      if ( user) {
        navigate(`/profile/${user}`);
      } else {
        console.error('User or user ID is undefined');
      }
    };
  return (
    <>
        <header className="p-4 text-white flex flex-col lg:flex-row justify-between items-center">

    <div className="flex flex-col lg:flex-row items-center">
        <div className="font-bold text-xl w-24 h-24 flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
        <img className="w-full h-full object-cover" src="/public/pingMeetpong-logo.png" alt="Logo" /> 
        </div>
        <NotifSvg className="mb-4 lg:mb-0" />
    </div>

    <div className="flex flex-col lg:flex-row items-center">
        <div className="mb-4 lg:mb-0 lg:mr-4">
        <CreateMatchDialog />
        </div>
        <div className="mb-4 lg:mb-0 lg:mr-4">
        <JoinMatchDialog />
        </div>
        <Card onClick={handleProfileClick}
            className="max-w-xs mx-4 bg-gray-800 hover:bg-gray-600 shadow-md 
                    rounded px-4 pt-4 pb-4 mb-4 lg:mb-0 lg:mx-0 flex items-center cursor-pointer">
        <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage src={avatar||undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
            <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
        </Avatar>
        <div className="ml-2 text-gray-200 text-lg">{username}</div> 
        </Card>
        <Button 
        onClick={handleLogout} 
        variant="destructive"
        className="font-bold py-2 px-4 rounded">
        Logout
        </Button>
    </div>

        </header>
    </>
  )
}

export default Header