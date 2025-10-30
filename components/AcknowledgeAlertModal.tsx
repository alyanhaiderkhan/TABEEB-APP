import React from 'react';
import { XIcon, BellIcon } from './icons';
import { Patient } from '../types';

interface AcknowledgeAlertModalProps {
  patient: Patient;
  onClose: () => void;
  onConfirm: () => void;
}

const AcknowledgeAlertModal: React.FC<AcknowledgeAlertModalProps> = ({ patient, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XIcon className="h-5 w-5" />
        </button>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                <BellIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Acknowledge Critical Alert</h3>
            <div className="mt-2 px-4 py-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    You are acknowledging a critical alert for patient <strong className="font-semibold">{patient.name}</strong>.
                </p>
                <div className="mt-3 text-left bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                    <p><strong>Status:</strong> <span className="text-red-600 dark:text-red-400 font-bold">{patient.status}</span></p>
                    <p><strong>Heart Rate:</strong> {patient.vitals.heartRate} bpm</p>
                    <p><strong>SpO2:</strong> {patient.vitals.oxygenSaturation}%</p>
                    <p><strong>Temperature:</strong> {patient.vitals.temperature}°C</p>
                </div>
            </div>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Acknowledge & Log
            </button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgeAlertModal;
