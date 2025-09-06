import React from 'react';
import { User, Notification } from '../../types';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
    user: User | null;
    onLogoClick: () => void;
    onSignUp: () => void;
    onLogin: () => void;
    onLogout: () => void;
}

const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const UpgradeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>;
const WelcomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const mockNotifications: Notification[] = [
    { id: 1, icon: <WelcomeIcon />, title: "Welcome to CareerAid Clinic!", description: "Your account has been successfully created. Take the assessment to get started.", timestamp: "5m ago", read: false },
    { id: 2, icon: <UpgradeIcon />, title: "Unlock Your Full Potential", description: "Upgrade to a premium plan to access unlimited assessments and custom roadmaps.", timestamp: "2h ago", read: false },
    { id: 3, icon: <ProfileIcon />, title: "Your Profile is Ready!", description: "Your career profile has been generated. View your recommendations now.", timestamp: "1d ago", read: true },
];


const Header: React.FC<HeaderProps> = ({ user, onLogoClick, onSignUp, onLogin, onLogout }) => {
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setIsNotificationOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="w-full py-4 px-6 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onLogoClick}
        >
          <img src="/public/assets/logo.png" alt="CareerAid Clinic Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-white">CareerAid Clinic</span>
        </div>
        <div className="flex items-center space-x-4">
            {user ? (
                <>
                    {/* Language Switcher */}
                    <div className="relative group">
                        <button className="flex items-center space-x-1 text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 16l4-4m0 0l4 4m-4-4v12" /></svg>
                            <span>EN</span>
                        </button>
                        <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">English</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Yoruba</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Hausa</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Igbo</a>
                        </div>
                    </div>
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button onClick={() => setIsNotificationOpen(prev => !prev)} className="relative text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                             {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-gray-900">{unreadCount}</span>}
                        </button>
                        {isNotificationOpen && <NotificationPanel notifications={mockNotifications} onClose={() => setIsNotificationOpen(false)} />}
                    </div>
                    <span className="text-gray-300 hidden sm:block">Welcome, {user.name.split(' ')[0]}!</span>
                    <button 
                        onClick={onLogout} 
                        className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <button onClick={onLogin} className="text-gray-300 hover:text-white transition-colors duration-200">Login</button>
                    <button 
                        onClick={onSignUp} 
                        className="bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                </>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;