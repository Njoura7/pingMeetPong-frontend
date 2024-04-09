
import { useSelector} from 'react-redux'
import {  selectCurrentUser  } from '../features/auth/authSlice' 
import  { SocketContextProvider } from '../SocketContext';

import DisplayMatches from '../components/DisplayMatches'
import  Header  from '../components/Header'
// shadcn componenets
import { Card } from "@/components/ui/card"




const Dashboard = () => {

  const { user: userId } = useSelector(selectCurrentUser);


  return  (
    <SocketContextProvider userId={userId}>


      <div className="flex flex-col h-screen">
        <Header/>
      {userId&&(

        <main className="flex-grow p-4 text-gray-200 flex justify-between flex-col md:flex-row">
      <Card className="w-full md:w-2/3 mx-4  shadow-md rounded p-4 mb-4 flex flex-col items-center">
        <div className="text-gray-200 my-3 text-lg">Matches</div> 
        <DisplayMatches playerId={userId} />
      </Card>

      <Card className="w-full md:w-1/3 mx-4 bg-gray-800 hover:bg-gray-600 shadow-md rounded p-4  mb-4 flex flex-col items-center">
        <div className="text-gray-200 text-lg">Friends</div> 
        <div>
          <p>dummy friends</p>
          <p>dummy friends</p>
          <p>dummy friends</p>
          <p>dummy friends</p>
          <p>dummy friends</p>
          <p>dummy friends</p>
        </div>
      </Card>
    </main>
    )}
  </div>
    </SocketContextProvider>
 
  )
}

export default Dashboard