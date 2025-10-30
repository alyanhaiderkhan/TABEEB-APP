import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons';

interface VitalsCardProps {
    label: string;
    value: string | number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    icon: React.ReactNode;
    color: string;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ label, value, unit, trend, icon, color }) => {

    const trendIcon = {
        up: <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />,
        down: <ArrowTrendingDownIcon className="h-4 w-4 text-blue-500" />,
        stable: <div className="w-4 h-4" />
    }[trend];

    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm relative overflow-hidden">
            <div className={`absolute -top-4 -right-4 h-16 w-16 ${color} opacity-10 dark:opacity-20`}>
                {icon}
            </div>
            <h4 className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</h4>
            <div className="flex items-baseline space-x-1 mt-1">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{unit}</p>
            </div>
            <div className="flex items-center justify-end h-4 mt-1">
                {trendIcon}
            </div>
        </div>
    );
};

export default VitalsCard;
