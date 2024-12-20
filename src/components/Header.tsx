import { CreateMatchDialog } from './CreateMatchDialog';
import { DateProvider } from './DateContext';
import { JoinMatchDialog } from './JoinMatchDialog';
import { ProfileButton } from './ProfileButton';
import { LogoutButton } from './LogoutButton';
import { InvitationsListener } from './InvitationsListener';
import SearchComponent from './SearchComponent'

const Header = () => {

  return (
    <header className="p-4 text-white flex flex-col lg:flex-row justify-between items-center">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-24 h-24 flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
          <img className="w-full h-full object-cover" src="/pingMeetpong-logo.png" alt="Logo" />
        </div>
        <InvitationsListener />
        <SearchComponent />
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        <DateProvider>
          <CreateMatchDialog />
        </DateProvider>
        <JoinMatchDialog />
        <ProfileButton />
        <LogoutButton />
      </div>
    </header>
  )
}

export default Header