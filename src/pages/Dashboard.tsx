
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { logOut, selectCurrentUser  } from '../features/auth/authSlice' // replace with the path to your auth slice
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Dashboard = () => {
  const dispatch = useDispatch()
  const { username, avatar } = useSelector(selectCurrentUser);
  const handleLogout = () => {
    dispatch(logOut())
  }
  const navigate = useNavigate();
  if (!username) {
    navigate("/login"); // or redirect to login page, or any other component you want to show while user is null
  }
  return (
    <div className="flex flex-col h-screen">
    <header className="p-4 bg-blue-900 text-white flex justify-between items-center">
      <div className="font-bold text-xl">Dashboard</div>
  
      <div className="flex items-center">
        <Card className="max-w-xs mx-4 bg-gray-800 hover:bg-gray-600 shadow-md 
                         rounded px-4 pt-4 pb-4 mb-4 flex items-center cursor-pointer">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage src={avatar||undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
            <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
          </Avatar>
          <div className="ml-2 text-gray-200 text-lg">{username}</div> 
        </Card>
  
        <Button 
          onClick={handleLogout} 
          variant="destructive"
          className="font-bold py-2 px-4 rounded"
        >
          Logout
        </Button>
      </div>
    </header>
  
    <main className="flex-grow p-4 bg-gray-900 text-gray-200">
      {/* Other content */}
    </main>
  </div>
  )
}

export default Dashboard