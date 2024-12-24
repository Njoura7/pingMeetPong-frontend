import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { SocketProvider } from '@/SocketContext'
import UpcomingMatches from '@/components/UpcomingMatches'
import RecentMatches from '@/components/RecentMatches'
import Header from '@/components/Header'
import { Card } from "@/components/ui/card"
import { DateProvider } from '@/components/DateContext'
import { CreateMatchDialog } from '@/components/CreateMatchDialog'
import { JoinMatchDialog } from '@/components/JoinMatchDialog'
import SearchComponent from '@/components/SearchComponent'


const Dashboard = () => {
  const { user: userId } = useSelector(selectCurrentUser);




  return (
    <SocketProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        {userId && (
          <main className="flex-grow p-6">
            <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
            <div className="flex-1 px-4 max-w-2xl mx-auto">
              <SearchComponent />
            </div>

            <DateProvider>
              <CreateMatchDialog />
            </DateProvider>
            <JoinMatchDialog />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <Card className="col-span-2 p-4">
                <UpcomingMatches playerId={userId} />
              </Card>

              <Card className="p-4">
                <RecentMatches />
              </Card>
            </div>
          </main>
        )}
      </div>
    </SocketProvider>
  )
}

export default Dashboard