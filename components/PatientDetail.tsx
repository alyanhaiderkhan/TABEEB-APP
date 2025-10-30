import React, { useState, useEffect, useMemo } from 'react';
import { Patient, UserRole, Condition, VitalsHistory } from '../types';
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, OxygenIcon, ThermometerIcon, ClockIcon, PencilIcon, DocumentTextIcon, ShieldCheckIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons';
import VitalsCard from './VitalsCard';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface PatientDetailProps {
    patient: Patient | null;
    onAcknowledge: (patient: Patient) => void;
    onEditNotes: (patientId: number, notes: string) => void;
}

type TimeRange = '1h' | '24h' | '7d';

const TrendChart: React.FC<{ data: VitalsHistory[], dataKey: keyof VitalsHistory, label: string, unit: string, color: string, value: number | string }> = ({ data, dataKey, label, unit, color, value }) => {
    const startValue = data.length > 0 ? data[0][dataKey] : 0;
    const endValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
    const change = endValue - startValue;
    const changePercentage = startValue !== 0 ? (change / startValue) * 100 : 0;

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value} <span className="text-sm font-normal">{unit}</span></p>
                </div>
                <div className={`flex items-center text-xs font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                    <span>{changePercentage.toFixed(1)}%</span>
                </div>
            </div>
            <div className="h-16 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', fontSize: '12px' }}/>
                        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#color-${dataKey})`} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onAcknowledge, onEditNotes }) => {
    const { userRole } = useAuth();
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');

    useEffect(() => {
        if (patient) {
            setNotes(patient.notes);
        }
        setIsEditingNotes(false);
    }, [patient]);

    const filteredHistory = useMemo(() => {
        if (!patient) return [];
        const now = Date.now();
        const timeFilter = {
            '1h': now - 3600 * 1000,
            '24h': now - 24 * 3600 * 1000,
            '7d': now - 7 * 24 * 3600 * 1000,
        }[timeRange];

        return patient.vitalsHistory.filter(v => v.timestamp >= timeFilter);
    }, [patient, timeRange]);

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Patient Selected</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a patient from the list to view their details.</p>
                </div>
            </div>
        );
    }
    
    if (patient.condition === Condition.Discharged) {
        return (
             <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-center p-8">
                    <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">{patient.name}</h3>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-300">This patient has been discharged.</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All monitoring has been concluded.</p>
                </div>
            </div>
        )
    }

    const handleSaveNotes = () => {
        onEditNotes(patient.id, notes);
        setIsEditingNotes(false);
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{patient.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{patient.age} y/o {patient.gender} &bull; Condition: {patient.condition}</p>
                </div>
                {patient.status === 'Critical' && !patient.acknowledgedAt && (
                    <button onClick={() => onAcknowledge(patient)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition-colors animate-pulse">
                        ACKNOWLEDGE ALERT
                    </button>
                )}
            </div>
             {patient.acknowledgedAt && (
                <div className="mt-2 text-xs text-center text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300 p-2 rounded-md">
                    Critical alert acknowledged by <strong>{patient.acknowledgedAt.acknowledgedBy}</strong> at {new Date(patient.acknowledgedAt.timestamp).toLocaleTimeString()}
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <VitalsCard label="Heart Rate" value={patient.vitals.heartRate} unit="bpm" trend="stable" icon={<HeartIcon />} color="text-red-500" />
                <VitalsCard label="SpO2" value={`${patient.vitals.oxygenSaturation}`} unit="%" trend="stable" icon={<OxygenIcon />} color="text-purple-500" />
                <VitalsCard label="Temperature" value={patient.vitals.temperature.toFixed(1)} unit="°C" trend="stable" icon={<ThermometerIcon />} color="text-yellow-500" />
                <VitalsCard label="Resp. Rate" value={patient.vitals.respiratoryRate} unit="/min" trend="stable" icon={<div />} color="text-blue-500" />
                <VitalsCard label="Blood Pressure" value={`${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic}`} unit="mmHg" trend="stable" icon={<div />} color="text-green-500" />
            </div>

            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Vitals Trend</h3>
                     <div className="flex items-center space-x-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {(['1h', '24h', '7d'] as TimeRange[]).map(range => (
                            <button 
                                key={range} 
                                onClick={() => setTimeRange(range)} 
                                className={`px-3 py-1 text-xs rounded-md ${timeRange === range ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white font-semibold shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <TrendChart data={filteredHistory} dataKey="heartRate" label="Heart Rate" unit="bpm" color="#ef4444" value={patient.vitals.heartRate} />
                    <TrendChart data={filteredHistory} dataKey="oxygenSaturation" label="SpO2" unit="%" color="#8b5cf6" value={patient.vitals.oxygenSaturation} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex justify-between items-center">
                        Doctor's Notes
                         {userRole === UserRole.Admin && !isEditingNotes && (
                            <button onClick={() => setIsEditingNotes(true)} className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <PencilIcon className="h-3 w-3 mr-1" /> Edit
                            </button>
                        )}
                    </h3>
                    {isEditingNotes ? (
                        <div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full h-24 p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button onClick={() => setIsEditingNotes(false)} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">Cancel</button>
                                <button onClick={handleSaveNotes} className="px-3 py-1 text-xs bg-blue-600 text-white rounded">Save</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{notes}</p>
                    )}
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                     <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Device Information</h3>
                     <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                         <p><strong>Serial:</strong> {patient.deviceSerial}</p>
                         <p><strong>Model:</strong> {patient.sensorModel}</p>
                         <p><strong>Last Calibration:</strong> {patient.calibrationDate}</p>
                         <p><strong>Isolation:</strong> {patient.isolationStatus}</p>
                     </div>
                 </div>
            </div>

        </div>
    );
};

export default PatientDetail;