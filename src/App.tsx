import React, { useState } from 'react';
import { Bluetooth, Loader2, Shield, ShieldAlert, SmartphoneNfc } from 'lucide-react';

interface BluetoothDevice {
  device: {
    name: string | null;
    id: string;
  };
  rssi: number;
}

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      setDevices([]);

      if (!navigator.bluetooth) {
        throw new Error('Bluetooth is not supported in your browser');
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: []
      });

      // Add the found device to our list
      setDevices(prev => [...prev, {
        device: {
          name: device.name,
          id: device.id
        },
        rssi: -50 // Note: Web Bluetooth API doesn't provide RSSI, using placeholder
      }]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message === 'User cancelled the requestDevice() chooser.' 
          ? 'Scan cancelled' 
          : err.message);
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-8 pt-8">
          <Bluetooth className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Aksel Bluetooth Scanner</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              onClick={startScanning}
              disabled={isScanning}
              className={`
                flex items-center px-6 py-3 rounded-lg text-white font-medium
                transition-all duration-200 transform hover:scale-105
                ${isScanning 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-red-700 active:bg-green-800'
                }
              `}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <SmartphoneNfc className="w-5 h-5 mr-2" />
                  Start Scan
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <ShieldAlert className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {!error && devices.length === 0 && !isScanning && (
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 mr-2" />
                 Click scan to start searching.
              </div>
            )}
          </div>

          {/* Device List */}
          {devices.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Found Devices</h2>
              <div className="space-y-3">
                {devices.map((device, index) => (
                  <div
                    key={device.device.id}
                    className="flex items-center justify-between bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Bluetooth className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-green-800">
                          {device.device.name || 'Unknown Device'}
                        </h3>
                        <p className="text-sm text-green-600">ID: {device.device.id}</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">
                      Signal: {device.rssi} dBm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-green-800">
          <p>
            Note: Due to security reasons, Bluetooth scanning requires user interaction
            and will show a browser prompt to select devices. Some browsers may have
            limited Bluetooth support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;