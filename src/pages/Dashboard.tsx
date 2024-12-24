import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { SocketProvider } from '../SocketContext'
import DisplayMatches from '../components/DisplayMatches'
import Header from '../components/Header'
import { Card } from "@/components/ui/card"
import { DateProvider } from '@/components/DateContext'
import { CreateMatchDialog } from '@/components/CreateMatchDialog'
import { JoinMatchDialog } from '@/components/JoinMatchDialog'
import SearchComponent from '@/components/SearchComponent'

const Dashboard = () => {
  const { user: userId } = useSelector(selectCurrentUser);

  // Mock data for stats (you can replace these with real data later)
  // const stats = [
  //   { title: "Total Matches", value: "28", subtext: "+2 from last week" },
  //   { title: "Win Rate", value: "67%", subtext: "+5% from last month" },
  //   { title: "Tournament Wins", value: "3", subtext: "Won last weekend" },
  //   { title: "Active Players", value: "124", subtext: "+12 new this week" },
  // ];

  return (
    <SocketProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        {userId && (
          <main className="flex-grow p-6">
            <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
              {/* Center section with search */}
        <div className="flex-1 px-4 max-w-2xl mx-auto">
          <SearchComponent />
        </div>
            {/* Stats Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{stat.title}</span>
                    <span className="text-2xl font-bold mt-1">{stat.value}</span>
                    <span className="text-xs text-muted-foreground mt-1">{stat.subtext}</span>
                  </div>
                </Card>
              ))}
            </div> */}
             {/* <div className="flex items-center space-x-2"> */}

            <DateProvider>
          <CreateMatchDialog />
        </DateProvider>
        <JoinMatchDialog />
             {/* </div> */}
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Matches Section */}
              <Card className="col-span-2 p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  Upcoming Matches
                </h2>
                <DisplayMatches playerId={userId} />
              </Card>

              {/* Recent Matches Section */}
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
                <div className="space-y-4">
                  {/* You can replace this with a component that shows recent matches */}
                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary"/>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">2024-02-20</p>
                      </div>
                    </div>
                    <span className="text-green-500">21-18</span>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        )}
      </div>
    </SocketProvider>
  )
}

export default Dashboard