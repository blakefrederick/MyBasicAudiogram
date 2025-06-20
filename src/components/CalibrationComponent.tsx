'use client';

import { useState } from 'react';
import { useVolumeCalibration } from '@/lib/calibration';

export default function CalibrationComponent({ onContinue }) {
  const {
    isCalibrated,
    calibrate,
    resetCalibration,
  } = useVolumeCalibration();

  const [volumeInput, setVolumeInput] = useState('');

  const handleCalibrate = () => {
    if (volumeInput) {
      const isPercentage = volumeInput.includes('%');
      const calibrationValue = isPercentage
        ? volumeInput.trim()
        : `${volumeInput.trim()} ticks`;
      localStorage.setItem('audiogram_calibration_volume', calibrationValue);
      calibrate();
      // After calibration, continue to the test
      onContinue();
    } else {
      alert('Please enter your system volume level as either a percentage (ex. 30%) or number of "macOS volume ticks" (ex. 4).');
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <h2 className="text-lg font-medium mb-4">Volume Calibration</h2>

      {!isCalibrated ? (
        <div>
          <p className="mb-2">
            Please enter your current system volume level as either a percentage (ex. 30%) or number of "macOS volume ticks" (ex. 4):
          </p>
          <input
            type="text"
            value={volumeInput}
            onChange={(e) => setVolumeInput(e.target.value)}
            placeholder="ex. 30% or 4"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleCalibrate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calibrate
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">
            {`Please set your system volume to ${localStorage.getItem('audiogram_calibration_volume')} for consistent results.`}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={resetCalibration}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Calibration
            </button>
            <button
              onClick={onContinue}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
