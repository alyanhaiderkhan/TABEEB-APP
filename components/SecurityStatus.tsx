import React from 'react';
import { ShieldCheckIcon, WifiIcon, ServerIcon } from './icons';

const StatusItem: React.FC<{ icon: React.ReactNode; label: string; status: string; color: string; }> = ({icon, label, status, color}) => (
    <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 font-medium text-gray-700 dark:text-gray-200">{label}</span>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${color}`}>
            {status}
        </span>
    </div>
);

const SecurityStatus: React.FC = () => {
  return (
    <div className="p-6 h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-6">Security & Compliance</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Connection Status</h3>
            <div className="space-y-4">
                <StatusItem icon={<WifiIcon className="h-6 w-6 text-blue-500"/>} label="Device Connectivity (MQTT)" status="Secure" color="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" />
                <StatusItem icon={<ServerIcon className="h-6 w-6 text-blue-500"/>} label="Backend API" status="Secure" color="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" />
                 <StatusItem icon={<ShieldCheckIcon className="h-6 w-6 text-blue-500"/>} label="End-to-End Encryption" status="Enabled" color="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" />
            </div>
        </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Security Protocol</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Our system ensures the highest level of security for patient data by utilizing industry-standard protocols. All device-to-server communication is performed over <strong className="font-semibold text-gray-800 dark:text-gray-100">MQTT over TLS v1.3</strong>, which provides a secure and encrypted channel.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                We employ <strong className="font-semibold text-gray-800 dark:text-gray-100">mutual authentication (mTLS)</strong>, where both the device and the server present certificates to verify each other's identity before establishing a connection. This prevents unauthorized devices from connecting to our network and protects against man-in-the-middle attacks.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                Failed authentication attempts are rigorously logged and monitored to detect and respond to potential security threats in real-time.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityStatus;
