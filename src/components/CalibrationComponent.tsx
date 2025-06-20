'use client';

import { useState } from 'react';
import { playTone } from '@/lib/tonePlayer';
import { useVolumeCalibration } from '@/lib/calibration';

interface CalibrationComponentProps {
  onCalibrated: () => void;
}

export default function CalibrationComponent({ onCalibrated }: CalibrationComponentProps) {
  const { calibrate, resetCalibration, showVolumeWarning } = useVolumeCalibration();
  const [playingState, setPlayingState] = useState(false);
  const [step, setStep] = useState<'intro' | 'playing' | 'adjust' | 'complete'>('intro');

  const handlePlayReferenceSound = () => {
    setPlayingState(true);
    setStep('playing');
    
    // Play a 1000 Hz tone at 50% volume as a reference
    playTone(1000, 50, 'left', 2.0);
    
    setTimeout(() => {
      setPlayingState(false);
      setStep('adjust');
    }, 2000);
  };

  const handleConfirmCalibration = () => {
    calibrate();
    setStep('complete');
    onCalibrated();
  };

  const handleSkipCalibration = () => {
    onCalibrated();
  };

  const handleResetCalibration = () => {
    resetCalibration();
    setStep('intro');
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Audio Calibration</h2>
      
      {showVolumeWarning && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">System volume may have changed</p>
          <p className="text-sm">
            It appears your system volume has changed since calibration. For accurate results,
            please recalibrate or ensure volume is at the same level as your previous tests.
          </p>
        </div>
      )}
      
      {step === 'intro' && (
        <>
          <p className="mb-4 text-gray-700">
            To ensure consistent test results, you should calibrate your headphone volume before testing.
            This sets a baseline volume that you should maintain for all future tests.
          </p>
          
          <button
            onClick={handlePlayReferenceSound}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
          >
            Play Reference Tone
          </button>
          
          <button
            onClick={handleSkipCalibration}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Skip Calibration
          </button>
        </>
      )}
      
      {step === 'playing' && (
        <div className="text-center p-8">
          <div className={playingState ? "animate-pulse" : ""}>
            <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m3.172-9.9a9 9 0 012.12-2.12" />
            </svg>
          </div>
          <p className="mt-4 text-gray-700">
            Playing reference tone...
          </p>
        </div>
      )}
      
      {step === 'adjust' && (
        <>
          <p className="mb-4 text-gray-700">
            Adjust your headphone volume to a comfortable level where you can clearly hear the reference tone.
            Remember this volume setting for future tests.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handlePlayReferenceSound}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Play Again
            </button>
            
            <button
              onClick={handleConfirmCalibration}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Confirm Calibration
            </button>
          </div>
        </>
      )}
      
      {step === 'complete' && (
        <>
          <p className="mb-4 text-green-600 font-medium">
            Calibration complete! Keep your volume at this level for consistent test results.
          </p>
          
          <button
            onClick={handleResetCalibration}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Recalibrate
          </button>
        </>
      )}
    </div>
  );
}
