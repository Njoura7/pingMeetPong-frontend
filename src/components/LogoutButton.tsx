import { useEffect } from 'react';
import {  selectCurrentUser  } from '../features/auth/authSlice' 
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { logOut  } from '../features/auth/authSlice' 

//shadcn components 
import { Button } from "@/components/ui/button"

export const LogoutButton = () => {
    const dispatch = useDispatch()
    const { username } = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(logOut())
    }

    // Navigate to the login page when the username becomes null or undefined
    useEffect(() => {
      if (!username) {
        navigate("/login");
      }
    }, [username, navigate]);

    return (
      <>
        <Button 
          onClick={handleLogout} 
          variant="destructive"
          className="font-bold py-2 px-4 rounded">
          Logout
        </Button>
      </>
    )
}