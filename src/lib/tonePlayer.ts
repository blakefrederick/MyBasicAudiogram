'use client';

import { Ear } from './types';

let audioContext: AudioContext | null = null;

// Initialize audio context if not already created
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    // Handle webkit prefix with proper type safety
    const AudioContextClass = window.AudioContext || 
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    
    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser');
    }
    
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

/**
 * Play a tone with specified frequency, gain, and pan settings
 * 
 * @param frequency - Frequency in Hz
 * @param gain - Gain value from 0 to 100
 * @param ear - Which ear to play the tone in ('left' | 'right')
 * @param duration - Duration of the tone in seconds
 */
export const playTone = (
  frequency: number,
  gain: number, // 0-100
  ear: Ear,
  duration: number = 1.0
): void => {
  try {
    const context = getAudioContext();
    
    // Create oscillator
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Create gain node (convert from 0-100 to 0-1)
    const gainNode = context.createGain();
    const normalizedGain = gain / 100;
    gainNode.gain.value = normalizedGain;
    
    // Create stereo panner
    const panner = context.createStereoPanner();
    panner.pan.value = ear === 'left' ? -1 : 1;
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(context.destination);
    
    // Start and stop the oscillator
    const now = context.currentTime;
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    // Clean up when done
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      panner.disconnect();
    };
  } catch (error) {
    console.error('Error playing tone:', error);
  }
};

// Convert linear gain value (0-100) to dB (approximately -10dB to 120dB)
export const gainToDB = (gain: number): number => {
  if (gain <= 0) return -10; // Minimum dB value for normal hearing
  return -10 + (130 * (gain / 100)); // Map 0-100 gain to -10 to 120 dB
};

// Convert dB value to linear gain (0-100)
export const dbToGain = (db: number): number => {
  if (db <= -60) return 0;
  return 100 * Math.pow(10, db / 20);
};
