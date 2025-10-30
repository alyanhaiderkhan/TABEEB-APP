export enum UserRole {
  Viewer = 'Viewer',
  Admin = 'Admin',
}

export enum Condition {
  Stable = 'Stable',
  Observe = 'Observe',
  Critical = 'Critical',
  Discharged = 'Discharged',
}

export enum Status {
  Stable = 'Stable',
  Observe = 'Observe',
  Critical = 'Critical',
}

export enum IsolationStatus {
  Yes = 'Yes',
  No = 'No',
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export interface Vitals {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  ecg: number;
}

export interface VitalsHistory extends Vitals {
  timestamp: number;
}

export interface AlertAcknowledgement {
  acknowledgedBy: string;
  timestamp: number;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  condition: Condition;
  vitals: Vitals;
  deviceSerial: string;
  sensorModel: string;
  isolationStatus: IsolationStatus;
  calibrationDate: string;
  status: Status;
  notes: string;
  dateAdded: string;
  lastUpdated: string;
  lastHeartbeat: number;
  offlineBuffer: number;
  vitalsHistory: VitalsHistory[];
  acknowledgedAt?: AlertAcknowledgement;
}

export interface Device {
    serial: string;
    location: string;
    firmwareVersion: string;
    lastUpdateDate: string;
}
