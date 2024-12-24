
import { InvitationsListener } from './InvitationsListener';
import { ProfileButton } from './ProfileButton';


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
        <div className="flex items-center justify-center space-x-4"> 
    <div className="flex items-center space-x-2"> 
        <InvitationsListener /> 
    </div>
    <div className="flex items-center space-x-2"> 
        <ProfileButton /> 
    </div>
</div>
      </div>
    </header>
  )
}

export default Header