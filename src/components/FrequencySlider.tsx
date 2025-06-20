'use client';

import { useState } from 'react';
import { Ear } from '@/lib/types';
import { playTone, gainToDB } from '@/lib/tonePlayer';

interface FrequencySliderProps {
  frequency: number;
  ear: Ear;
  onHeardIt: (frequency: number, ear: Ear, gainLevel: number) => void;
  savedGainLevel?: number;
}

export default function FrequencySlider({ 
  frequency, 
  ear, 
  onHeardIt,
  savedGainLevel
}: FrequencySliderProps) {
  const [gainLevel, setGainLevel] = useState(savedGainLevel || 50);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayTone = () => {
    setIsPlaying(true);
    playTone(frequency, gainLevel, ear);
    
    // Reset playing state after tone duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };
  
  const handleHeardIt = () => {
    onHeardIt(frequency, ear, gainLevel);
  };
  
  // Format frequency display
  const formatFrequency = (freq: number) => {
    return freq >= 1000 ? `${freq / 1000}kHz` : `${freq}Hz`;
  };
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">
          {formatFrequency(frequency)} ({ear === 'left' ? 'Left' : 'Right'})
        </h3>
        <span className="text-sm text-gray-500">
          {gainToDB(gainLevel).toFixed(1)} dB
        </span>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={handlePlayTone}
          disabled={isPlaying}
          className={`flex-none px-3 py-2 rounded-md ${
            isPlaying 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isPlaying ? 'Playing...' : 'Play Tone'}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={gainLevel}
          onChange={(e) => setGainLevel(parseInt(e.target.value, 10))}
          className="flex-grow h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
        />
      </div>
      
      <button
        onClick={handleHeardIt}
        className={`w-full py-2 rounded-md ${
          savedGainLevel !== undefined
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {savedGainLevel !== undefined ? 'Update Response' : 'I Heard It'}
      </button>
    </div>
  );
}
