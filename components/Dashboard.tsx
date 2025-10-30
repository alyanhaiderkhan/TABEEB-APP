import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Patient, Condition, Status, UserRole } from '../types';
import { getInitialPatients, updateVitals } from '../utils/vitals';
import { useAuth } from '../hooks/useAuth';
import PatientCard from './PatientCard';
import PatientDetail from './PatientDetail';
import WardSummary from './WardSummary';
import AlertsPanel from './AlertsPanel';
import AddPatientModal from './AddPatientModal';
import AcknowledgeAlertModal from './AcknowledgeAlertModal';
import { PlusIcon } from './icons';

interface DashboardProps {
    isDemoMode: boolean;
    language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ isDemoMode }) => {
    const { userRole } = useAuth();
    const [patients, setPatients] = useState<Patient[]>(() => getInitialPatients());
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(() => patients.find(p => p.condition !== Condition.Discharged)?.id ?? null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [patientToAcknowledge, setPatientToAcknowledge] = useState<Patient | null>(null);

    useEffect(() => {
        if (!isDemoMode) return;
        const interval = setInterval(() => {
            setPatients(prevPatients => updateVitals(prevPatients));
        }, 2000);
        return () => clearInterval(interval);
    }, [isDemoMode]);

    const handleSelectPatient = (id: number) => {
        setSelectedPatientId(id);
    };

    const handleAddPatient = useCallback((newPatientData: Omit<Patient, 'id' | 'vitals' | 'vitalsHistory' | 'lastHeartbeat' | 'lastUpdated' | 'dateAdded' | 'status' | 'vitals'>) => {
        setPatients(prev => {
            const newId = Math.max(...prev.map(p => p.id)) + 1;
            const newPatient: Patient = {
                ...newPatientData,
                id: newId,
                status: Status.Stable,
                vitals: { heartRate: 72, bloodPressure: { systolic: 120, diastolic: 80 }, respiratoryRate: 16, temperature: 37.0, oxygenSaturation: 98, ecg: 72 },
                vitalsHistory: [],
                dateAdded: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                lastHeartbeat: Date.now()
            };
            return [...prev, newPatient];
        });
    }, []);

    const handleAcknowledgeConfirm = useCallback(() => {
        if (patientToAcknowledge) {
            setPatients(prev => prev.map(p => p.id === patientToAcknowledge.id ? { ...p, acknowledgedAt: { acknowledgedBy: userRole === UserRole.Admin ? 'Doctor' : 'Nurse', timestamp: Date.now() } } : p));
            setPatientToAcknowledge(null);
        }
    }, [patientToAcknowledge, userRole]);

    const handleEditNotes = useCallback((patientId: number, notes: string) => {
        setPatients(prev => prev.map(p => p.id === patientId ? { ...p, notes } : p));
    }, []);

    const selectedPatient = useMemo(() => patients.find(p => p.id === selectedPatientId) || null, [patients, selectedPatientId]);

    const filteredPatients = useMemo(() => {
        const activePatients = patients.filter(p => p.condition !== Condition.Discharged);
        const dischargedPatients = patients.filter(p => p.condition === Condition.Discharged);
        
        const sortedActive = activePatients.sort((a, b) => {
            const statusOrder = { [Status.Critical]: 0, [Status.Observe]: 1, [Status.Stable]: 2 };
            return statusOrder[a.status] - statusOrder[b.status];
        }).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return [...sortedActive, ...dischargedPatients];
    }, [patients, searchTerm]);


    return (
        <div className="grid grid-cols-12 gap-4 p-4 h-full">
            <div className="col-span-12 lg:col-span-3 xl:col-span-2 h-full flex flex-col gap-4">
                <WardSummary patients={patients} />
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col min-h-0">
                    <div className="p-3 border-b dark:border-gray-700">
                         <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2">
                        {filteredPatients.map(patient => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                isSelected={selectedPatientId === patient.id}
                                onClick={() => handleSelectPatient(patient.id)}
                                isDeviceOffline={patient.offlineBuffer > 0}
                            />
                        ))}
                    </div>
                     {userRole === UserRole.Admin && (
                        <div className="p-2 mt-auto border-t dark:border-gray-700">
                             <button onClick={() => setShowAddPatientModal(true)} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                <PlusIcon className="h-4 w-4 mr-1" /> Add Patient
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-6 xl:col-span-7 h-full">
                <PatientDetail 
                    patient={selectedPatient} 
                    onAcknowledge={setPatientToAcknowledge}
                    onEditNotes={handleEditNotes}
                />
            </div>

            <div className="col-span-12 lg:col-span-3 xl:col-span-3 h-full">
                <AlertsPanel patients={patients} onSelectPatient={handleSelectPatient} />
            </div>

            <AddPatientModal
                isOpen={showAddPatientModal}
                onClose={() => setShowAddPatientModal(false)}
                onAddPatient={handleAddPatient}
            />

            {patientToAcknowledge && (
                <AcknowledgeAlertModal
                    patient={patientToAcknowledge}
                    onClose={() => setPatientToAcknowledge(null)}
                    onConfirm={handleAcknowledgeConfirm}
                />
            )}
        </div>
    );
};

export default Dashboard;
