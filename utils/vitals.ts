import { Patient, Vitals, Condition, Status, IsolationStatus, Device, VitalsHistory } from '../types';

const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, float = false): number => {
    const num = Math.random() * (max - min) + min;
    return float ? num : Math.floor(num);
};

const generateVitals = (): Vitals => ({
    heartRate: getRandomNumber(60, 100),
    bloodPressure: {
        systolic: getRandomNumber(100, 140),
        diastolic: getRandomNumber(60, 90),
    },
    respiratoryRate: getRandomNumber(12, 20),
    temperature: getRandomNumber(36.5, 37.5, true),
    oxygenSaturation: getRandomNumber(95, 100),
    ecg: getRandomNumber(60, 100),
});

const getStatusFromVitals = (vitals: Vitals): Status => {
    if (vitals.heartRate > 120 || vitals.heartRate < 50 || vitals.oxygenSaturation < 90) {
        return Status.Critical;
    }
    if (vitals.heartRate > 100 || vitals.heartRate < 60 || vitals.oxygenSaturation < 94 || vitals.temperature > 38.0) {
        return Status.Observe;
    }
    return Status.Stable;
};

const generateVitalsHistory = (days: number): VitalsHistory[] => {
    const history: VitalsHistory[] = [];
    let currentVitals = generateVitals();
    const now = Date.now();
    const points = days * 24 * 4; // 1 point every 15 minutes

    for (let i = 0; i < points; i++) {
        currentVitals.heartRate += getRandomNumber(-2, 2);
        currentVitals.oxygenSaturation += getRandomNumber(-1, 1);
        currentVitals.temperature = parseFloat((currentVitals.temperature + getRandomNumber(-0.1, 0.1, true)).toFixed(1));
        
        currentVitals.heartRate = Math.max(45, Math.min(160, currentVitals.heartRate));
        currentVitals.oxygenSaturation = Math.max(88, Math.min(100, currentVitals.oxygenSaturation));

        history.push({
            ...currentVitals,
            timestamp: now - (points - i) * 15 * 60 * 1000
        });
    }
    return history;
}


export const getInitialPatients = (count = 15): Patient[] => {
    const patients: Patient[] = [];
    for (let i = 1; i <= count; i++) {
        const vitalsHistory = generateVitalsHistory(7);
        const vitals = vitalsHistory[vitalsHistory.length -1];
        const condition = getRandomElement([Condition.Stable, Condition.Observe, Condition.Critical, Condition.Discharged]);
        const status = condition === Condition.Discharged ? Status.Stable : getStatusFromVitals(vitals);

        patients.push({
            id: i,
            name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
            age: getRandomNumber(20, 80),
            gender: getRandomElement(['Male', 'Female']),
            condition,
            vitals,
            deviceSerial: `SN-TABEEB-${1000 + i}`,
            sensorModel: `VitalSense Pro ${getRandomElement(['X', 'S', 'G'])}`,
            isolationStatus: getRandomElement([IsolationStatus.Yes, IsolationStatus.No]),
            calibrationDate: new Date(Date.now() - getRandomNumber(1, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status,
            notes: 'Patient is resting comfortably. No immediate concerns noted during the last check-up.',
            dateAdded: new Date(Date.now() - getRandomNumber(1, 10) * 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: new Date().toISOString(),
            lastHeartbeat: Date.now(),
            offlineBuffer: 0,
            vitalsHistory,
        });
    }
    return patients;
};

export const updateVitals = (patients: Patient[]): Patient[] => {
    return patients.map(p => {
        if (p.condition === Condition.Discharged) return p;

        const isOffline = Math.random() < 0.05; // 5% chance of device going offline
        if (isOffline && p.offlineBuffer < 100) {
             return { ...p, offlineBuffer: Math.min(100, p.offlineBuffer + 10) };
        }

        const newVitals = { ...p.vitals };
        let wasCritical = p.status === Status.Critical;

        newVitals.heartRate += getRandomNumber(-3, 3);
        newVitals.oxygenSaturation += getRandomNumber(-1, 1);
        newVitals.temperature = parseFloat((newVitals.temperature + getRandomNumber(-0.2, 0.2, true)).toFixed(1));
        
        // Clamp values to realistic ranges
        newVitals.heartRate = Math.max(40, Math.min(180, newVitals.heartRate));
        newVitals.oxygenSaturation = Math.max(85, Math.min(100, newVitals.oxygenSaturation));

        const newStatus = getStatusFromVitals(newVitals);

        const newHistory: VitalsHistory = { ...newVitals, timestamp: Date.now() };
        const updatedHistory = [...p.vitalsHistory.slice(1), newHistory];

        let acknowledgedAt = p.acknowledgedAt;
        if(newStatus !== Status.Critical && wasCritical) {
            // If patient recovers from critical, clear acknowledgement
            acknowledgedAt = undefined;
        }

        return {
            ...p,
            vitals: newVitals,
            status: newStatus,
            vitalsHistory: updatedHistory,
            lastUpdated: new Date().toISOString(),
            lastHeartbeat: Date.now(),
            offlineBuffer: isOffline ? p.offlineBuffer : 0,
            acknowledgedAt,
        };
    });
};

export const getDevices = (count = 20): Device[] => {
    const devices: Device[] = [];
    for (let i = 1; i <= count; i++) {
        devices.push({
            serial: `SN-TABEEB-${1000 + i}`,
            location: `Bed ${100 + i}`,
            firmwareVersion: `v${getRandomNumber(1,3)}.${getRandomNumber(0,9)}.${getRandomNumber(0,9)}`,
            lastUpdateDate: new Date(Date.now() - getRandomNumber(1, 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
    }
    return devices;
};