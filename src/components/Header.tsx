
import { LogoutButton } from './LogoutButton';
import { InvitationsListener } from './InvitationsListener';
import SearchComponent from './SearchComponent'


const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Left section with logo and brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img className="h-8 w-8" src="/pingMeetpong-logo.png" alt="Logo" />
            <span className="text-xl font-semibold text-purple-600">PingMeetPong</span>
          </div>
          
         
        </div>

        {/* Center section with search */}
        <div className="flex-1 px-4 max-w-2xl mx-auto">
          <SearchComponent />
        </div>

        {/* Right section with actions */}
        <div className="flex items-center space-x-4">
          <InvitationsListener />
          
      

          {/* User section */}
          <div className="flex items-center space-x-2 ml-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              JD
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header