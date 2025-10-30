import React from 'react';
import { getDevices } from '../utils/vitals';

const DeviceInventory: React.FC = () => {
  const devices = getDevices();

  return (
    <div className="p-6 h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-6">Device Inventory</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <th className="px-5 py-3">Serial Number</th>
              <th className="px-5 py-3">Location (Bed #)</th>
              <th className="px-5 py-3">Firmware Version</th>
              <th className="px-5 py-3">Last Update</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {devices.map((device) => (
              <tr key={device.serial} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-5 py-4 text-sm">{device.serial}</td>
                <td className="px-5 py-4 text-sm">{device.location}</td>
                <td className="px-5 py-4 text-sm">{device.firmwareVersion}</td>
                <td className="px-5 py-4 text-sm">{device.lastUpdateDate}</td>
                <td className="px-5 py-4 text-sm">
                   <span className="relative inline-block px-3 py-1 font-semibold text-green-900 dark:text-green-200 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-green-200 dark:bg-green-800 opacity-50 rounded-full"></span>
                        <span className="relative">Operational</span>
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceInventory;
