import React, { useState } from 'react';
import { Patient, Condition, Status, IsolationStatus, UserRole } from '../types';
import { XIcon } from './icons';

type NewPatientData = Omit<Patient, 'id' | 'vitals' | 'vitalsHistory' | 'lastHeartbeat' | 'lastUpdated' | 'dateAdded' | 'status' | 'vitals'>;

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: NewPatientData) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
    const initialState: NewPatientData = {
        name: '',
        age: 0,
        gender: 'Male',
        condition: Condition.Stable,
        deviceSerial: '',
        sensorModel: '',
        isolationStatus: IsolationStatus.No,
        calibrationDate: new Date().toISOString().split('T')[0],
        notes: '',
        offlineBuffer: 0,
    };

    const [patientData, setPatientData] = useState<NewPatientData>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatientData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPatient(patientData);
        setPatientData(initialState);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <XIcon className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add New Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="name" value={patientData.name} onChange={handleChange} className="mt-1 block w-full input-style" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                            <input type="number" name="age" value={patientData.age} onChange={handleChange} className="mt-1 block w-full input-style" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                            <select name="gender" value={patientData.gender} onChange={handleChange} className="mt-1 block w-full input-style">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
                            <select name="condition" value={patientData.condition} onChange={handleChange} className="mt-1 block w-full input-style">
                                {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Device Serial</label>
                            <input type="text" name="deviceSerial" value={patientData.deviceSerial} onChange={handleChange} className="mt-1 block w-full input-style" placeholder="e.g., SN-TABEEB-1016" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Isolation</label>
                            <select name="isolationStatus" value={patientData.isolationStatus} onChange={handleChange} className="mt-1 block w-full input-style">
                                {Object.values(IsolationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Notes</label>
                        <textarea name="notes" value={patientData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full input-style"></textarea>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Add Patient
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .input-style {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    background-color: white;
                    color: #111827;
                }
                .dark .input-style {
                    border-color: #4B5563;
                    background-color: #374151;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default AddPatientModal;
