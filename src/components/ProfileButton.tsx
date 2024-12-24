import { useNavigate } from "react-router-dom";
import {  selectCurrentUser  } from '../features/auth/authSlice' 
import { useSelector } from 'react-redux'

import {  Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./LogoutButton";

export const ProfileButton = () => {


    const { user, avatar } = useSelector(selectCurrentUser);
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
     <DropdownMenu>
     <DropdownMenuTrigger asChild>  
        <Avatar onClick={handleProfileClick} className="w-8 h-8 rounded-full">
          <AvatarImage src={avatar||undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
          <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton/>
          </DropdownMenuItem>
          </DropdownMenuGroup>
          </DropdownMenuContent>
     </DropdownMenu>
       
    </div>
  )
}
