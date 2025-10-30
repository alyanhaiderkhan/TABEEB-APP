import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { HospitalIcon, ChartBarIcon, ServerIcon, ShieldCheckIcon, CogIcon } from './icons';

interface HeaderProps {
    page: string;
    setPage: (page: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
        {icon}
        <span className="ml-2">{label}</span>
    </button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
  const { userRole, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-2 flex flex-col sm:flex-row justify-between items-center sm:px-4 border-b dark:border-gray-700">
      <div className="flex items-center mb-2 sm:mb-0">
        <HospitalIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white ml-2">TABEEB</h1>
      </div>
      
      <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-lg mb-2 sm:mb-0">
          <NavItem icon={<ChartBarIcon className="h-5 w-5"/>} label="Dashboard" isActive={page === 'dashboard'} onClick={() => setPage('dashboard')} />
          <NavItem icon={<ServerIcon className="h-5 w-5"/>} label="Devices" isActive={page === 'inventory'} onClick={() => setPage('inventory')} />
          <NavItem icon={<ShieldCheckIcon className="h-5 w-5"/>} label="Security" isActive={page === 'security'} onClick={() => setPage('security')} />
          <NavItem icon={<CogIcon className="h-5 w-5"/>} label="Settings" isActive={page === 'settings'} onClick={() => setPage('settings')} />
      </nav>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Role: <span className="font-semibold">{userRole}</span></span>
        <button
          onClick={logout}
          className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
