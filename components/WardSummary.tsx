import React from 'react';
import { Patient, Status, Condition } from '../types';
import { UsersIcon, BellIcon, CheckCircleIcon } from './icons';

interface WardSummaryProps {
  patients: Patient[];
}

const StatCard: React.FC<{ icon:React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className={`flex items-center p-3 rounded-lg ${color}`}>
        <div className="mr-3">{icon}</div>
        <div>
            <p className="text-sm text-white/90">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const WardSummary: React.FC<WardSummaryProps> = ({ patients }) => {
  const activePatients = patients.filter(p => p.condition !== Condition.Discharged);
  const totalPatients = activePatients.length;
  const criticalCount = activePatients.filter(p => p.status === Status.Critical).length;
  const stableCount = activePatients.filter(p => p.status === Status.Stable).length;

  const avgSpo2 = activePatients.length > 0 
    ? (activePatients.reduce((acc, p) => acc + p.vitals.oxygenSaturation, 0) / totalPatients).toFixed(1)
    : 'N/A';
  
  const avgHr = activePatients.length > 0
    ? Math.round(activePatients.reduce((acc, p) => acc + p.vitals.heartRate, 0) / totalPatients)
    : 'N/A';


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Ward Summary
      </h3>
      <div className="grid grid-cols-1 gap-2">
        <StatCard icon={<UsersIcon className="h-6 w-6 text-white"/>} label="Total Patients" value={totalPatients} color="bg-blue-500" />
        <StatCard icon={<BellIcon className="h-6 w-6 text-white"/>} label="Critical" value={criticalCount} color="bg-red-500" />
        <StatCard icon={<CheckCircleIcon className="h-6 w-6 text-white"/>} label="Stable" value={stableCount} color="bg-green-500" />
        <div className="grid grid-cols-2 gap-2 mt-2 text-center text-xs text-gray-600 dark:text-gray-300">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-2 rounded">
                <p>Avg SpO2</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{avgSpo2}%</p>
            </div>
             <div className="bg-gray-100 dark:bg-gray-700/50 p-2 rounded">
                <p>Avg HR</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{avgHr}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WardSummary;
