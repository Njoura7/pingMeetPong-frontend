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
import { useFindMatchesByPlayerQuery } from '../features/matches/matchesApi'
import { Match } from '@/types'

const Dashboard = () => {
  const { user: userId } = useSelector(selectCurrentUser);
  const { data: matches } = useFindMatchesByPlayerQuery(userId || '');

  // Get recent matches (last 5 matches with scores)
  const recentMatches = matches?.data
    ?.filter((match: Match) => match.score)
    ?.sort((a: Match, b: Match) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    ?.slice(0, 5);

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
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  Upcoming Matches
                </h2>
                <DisplayMatches playerId={userId} />
              </Card>

              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
                <div className="space-y-4">
                  {recentMatches?.length ? (
                    recentMatches.map((match: Match) => {
                      const date = match.date instanceof Date ? match.date : new Date(match.date);
                      return (
                        <div key={match._id} className="flex items-center justify-between p-2 hover:bg-accent rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary"/>
                            <div>
                              <p className="font-medium">{match.name}</p>
                              <p className="text-sm text-muted-foreground">{date.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="text-green-500">{match.score}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-sm">No recent matches with scores</p>
                  )}
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