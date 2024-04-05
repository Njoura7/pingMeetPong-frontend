import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice' 
//shadcn components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card"

const Profile = () => {
  const { username, avatar } = useSelector(selectCurrentUser);

  return (
        <Card className="flex items-center p-4">
      <Avatar className="w-24 h-24  mt-8">
        <AvatarImage src={avatar||undefined} alt="avatar" className="w-full h-full object-cover rounded-full" />
        <AvatarFallback className="w-full h-full object-cover rounded-full bg-gray-700 text-gray-300">X</AvatarFallback>
      </Avatar>
      <div className="ml-4 mt-8 text-gray-200 text-2xl">{username}</div> 
        </Card>
  )
}

export default Profile