import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface SettingsProps {
    language: string;
    setLanguage: (lang: string) => void;
    isDemoMode: boolean;
    setDemoMode: (demo: boolean) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div>
            {children}
        </div>
    </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

const Settings: React.FC<SettingsProps> = ({ language, setLanguage, isDemoMode, setDemoMode, theme, setTheme }) => {
    return (
        <div className="p-6 h-full bg-gray-50 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
                <SettingsCard title="Theme" description="Switch between light and dark mode.">
                    <div className="flex items-center p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                        <button onClick={() => setTheme('light')} className={`p-2 rounded-full ${theme === 'light' ? 'bg-white dark:bg-gray-500 shadow' : ''}`}>
                            <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300"/>
                        </button>
                         <button onClick={() => setTheme('dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>
                            <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-100"/>
                        </button>
                    </div>
                </SettingsCard>
                 <SettingsCard title="Language" description="Choose your preferred language.">
                    <div className="flex items-center space-x-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <button onClick={() => setLanguage('en')} className={`px-4 py-1 text-sm rounded-md ${language === 'en' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white font-semibold shadow' : 'text-gray-600 dark:text-gray-300'}`}>English</button>
                        <button onClick={() => setLanguage('ur')} className={`px-4 py-1 text-sm rounded-md ${language === 'ur' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white font-semibold shadow' : 'text-gray-600 dark:text-gray-300'}`}>Roman Urdu</button>
                    </div>
                </SettingsCard>
                <SettingsCard title="Demo Mode" description="Enable synthetic data for presentation.">
                    <Toggle checked={isDemoMode} onChange={setDemoMode} />
                </SettingsCard>
            </div>
        </div>
    );
};

export default Settings;
