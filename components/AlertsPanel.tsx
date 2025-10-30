import React from 'react';
import { Patient, Status } from '../types';
import { BellIcon, HeartIcon } from './icons';

interface AlertsPanelProps {
  patients: Patient[];
  onSelectPatient: (patientId: number) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ patients, onSelectPatient }) => {
    const alerts = patients.filter(p => p.status === Status.Critical && !p.acknowledgedAt);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 p-4 border-b dark:border-gray-700 flex items-center">
                <BellIcon className="h-5 w-5 mr-2 text-red-500" />
                Active Alerts
                {alerts.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {alerts.length}
                    </span>
                )}
            </h3>
            <div className="flex-1 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="text-center p-8 text-sm text-gray-500 dark:text-gray-400">
                        No active critical alerts.
                    </div>
                ) : (
                    <ul className="divide-y dark:divide-gray-700">
                        {alerts.map(patient => (
                            <li 
                                key={patient.id} 
                                onClick={() => onSelectPatient(patient.id)}
                                className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{patient.name}</p>
                                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{patient.status}</p>
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-gray-300">
                                    <HeartIcon className="h-3 w-3 mr-1 text-red-500"/>
                                    HR: {patient.vitals.heartRate} bpm &bull; SpO2: {patient.vitals.oxygenSaturation}%
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
