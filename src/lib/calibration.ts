'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to calibrate and track system volume
 */
export function useVolumeCalibration() {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationVolume, setCalibrationVolume] = useState<number | null>(null);
  const [showVolumeWarning, setShowVolumeWarning] = useState(false);

  // Get current system volume if available in browser
  const getCurrentVolume = async (): Promise<number | null> => {
    try {
      // This is a simplified approach. In reality, getting system volume 
      // requires platform-specific APIs that may not be available in all browsers
      
      // For demonstration, we'll just check if audio is muted
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        return 0; // Audio might be muted
      }
      
      // In a real implementation, we might use more advanced techniques or just rely on user input
      return null;
    } catch (error) {
      console.error('Error getting system volume:', error);
      return null;
    }
  };

  // Initialize volume monitoring
  useEffect(() => {
    const checkVolume = async () => {
      const volume = await getCurrentVolume();
      
      // Compare with calibrated volume if we have one
      if (calibrationVolume !== null && volume !== null) {
        const volumeChanged = Math.abs((volume - calibrationVolume) / calibrationVolume) > 0.1;
        setShowVolumeWarning(volumeChanged);
      }
    };
    
    // Check initially
    checkVolume();
    
    // Check periodically
    const intervalId = setInterval(checkVolume, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [calibrationVolume]);

  // Calibrate volume
  const calibrate = async () => {
    const volume = await getCurrentVolume();
    setCalibrationVolume(volume);
    setIsCalibrated(true);
    setShowVolumeWarning(false);
    
    // Store calibration in localStorage
    if (volume !== null) {
      localStorage.setItem('audiogram_calibration_volume', volume.toString());
    }
  };

  // Reset calibration
  const resetCalibration = () => {
    setCalibrationVolume(null);
    setIsCalibrated(false);
    setShowVolumeWarning(false);
    localStorage.removeItem('audiogram_calibration_volume');
  };

  // Load calibration from localStorage on mount
  useEffect(() => {
    const savedCalibration = localStorage.getItem('audiogram_calibration_volume');
    if (savedCalibration) {
      setCalibrationVolume(parseFloat(savedCalibration));
      setIsCalibrated(true);
    }
  }, []);

  return {
    isCalibrated,
    calibrate,
    resetCalibration,
    showVolumeWarning
  };
}
