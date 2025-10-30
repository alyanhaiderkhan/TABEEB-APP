import React from 'react';
import { Patient, Status, Condition } from '../types';
import { HeartIcon, OxygenIcon, ThermometerIcon } from './icons';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onClick: () => void;
  isDeviceOffline: boolean;
}

const statusStyles: { [key in Status]: { border: string; bg: string; text: string } } = {
    [Status.Stable]: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-600' },
    [Status.Observe]: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
    [Status.Critical]: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-600' },
};

const VitalStat: React.FC<{ icon: React.ReactNode; value: string | number; }> = ({ icon, value }) => (
    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
        {icon}
        <span className="ml-1 font-semibold">{value}</span>
    </div>
);

const PatientCard: React.FC<PatientCardProps> = ({ patient, isSelected, onClick, isDeviceOffline }) => {
    const isDischarged = patient.condition === Condition.Discharged;
    const style = statusStyles[patient.status] || statusStyles[Status.Stable];

    const chartData = patient.vitalsHistory.map(v => ({ time: v.timestamp, value: v.heartRate }));

    if (isDischarged) {
        return (
            <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 opacity-60`}>
                <h4 className="font-bold text-gray-700 dark:text-gray-300">{patient.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Discharged</p>
            </div>
        )
    }

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${
                isSelected
                ? `${style.border} ${style.bg} ring-2 ring-blue-500`
                : `${style.border} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50`
            }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{patient.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{patient.age} y/o {patient.gender}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${style.bg.replace('10', '20')} ${style.text}`}>
                    {patient.status}
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-3">
                    <VitalStat icon={<HeartIcon className="h-4 w-4 text-red-500" />} value={patient.vitals.heartRate} />
                    <VitalStat icon={<OxygenIcon className="h-4 w-4 text-purple-500" />} value={`${patient.vitals.oxygenSaturation}%`} />
                    <VitalStat icon={<ThermometerIcon className="h-4 w-4 text-yellow-500" />} value={patient.vitals.temperature.toFixed(1)} />
                </div>
                <div className="h-8 w-16">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {isDeviceOffline && (
                 <div className="mt-2 text-xs text-center text-orange-800 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300 p-1 rounded-md">
                    Device Offline - Buffering {patient.offlineBuffer}%
                </div>
            )}
        </div>
    );
};

export default PatientCard;
