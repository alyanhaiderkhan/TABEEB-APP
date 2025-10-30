import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import DeviceInventory from './components/DeviceInventory';
import SecurityStatus from './components/SecurityStatus';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [page, setPage] = useState('dashboard');
    const [language, setLanguage] = useState('en');
    const [isDemoMode, setDemoMode] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className={`h-screen flex flex-col relative bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
            <Header 
                page={page} 
                setPage={setPage} 
            />
            <div className="flex-1 overflow-hidden">
                {page === 'dashboard' && <Dashboard isDemoMode={isDemoMode} language={language} />}
                {page === 'inventory' && <DeviceInventory />}
                {page === 'security' && <SecurityStatus />}
                {page === 'settings' && <Settings 
                    language={language} 
                    setLanguage={setLanguage}
                    isDemoMode={isDemoMode}
                    setDemoMode={setDemoMode}
                    theme={theme}
                    setTheme={setTheme}
                />}
            </div>
            {isDemoMode && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    DEMO MODE
                </div>
            )}
        </div>
    )
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
};

export default App;
