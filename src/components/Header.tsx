
import { CreateMatchDialog } from './CreateMatchDialog';
import { JoinMatchDialog } from './JoinMatchDialog';
import { ProfileButton } from './ProfileButton';
import { LogoutButton } from './LogoutButton';
import { InvitationsListenner } from './InvitationsListenner';

const Header = () => {


  return (
    <>
        <header className="p-4 text-white flex flex-col lg:flex-row justify-between items-center">
    <div className="flex flex-col lg:flex-row items-center">
      <div className="  w-24 h-24 flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
        <img className="w-full h-full object-cover" src="/public/pingMeetpong-logo.png" alt="Logo" /> 
        <InvitationsListenner/>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row items-center">
      
        <CreateMatchDialog />
        <JoinMatchDialog />
         <ProfileButton/>
          <LogoutButton/>

    </div>
        </header>  
    </>
  )
}

export default Header