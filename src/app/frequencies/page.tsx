'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeadphoneWarning from '@/components/HeadphoneWarning';
import FrequencySlider from '@/components/FrequencySlider';
import AudiogramChart from '@/components/AudiogramChart';
import CalibrationComponent from '@/components/CalibrationComponent';
import { Ear, ToneResult, HIGH_FREQUENCIES, HearingTestSession } from '@/lib/types';
import { getHeadphoneModel } from '@/lib/storage';
import { createSession, addResultToSession, finalizeAndSaveSession } from '@/lib/session';

const PRESET_GAIN_LEVEL = 2.4; 

export default function FrequenciesPage() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<HearingTestSession | null>(null);
  const [headphoneConfirmed, setHeadphoneConfirmed] = useState(false);
  const [calibrationConfirmed, setCalibrationConfirmed] = useState(false);
  const [selectedEar, setSelectedEar] = useState<Ear>('left');
  const [testProgress, setTestProgress] = useState(0);
  
  // Initialize session with headphone model if available
  useEffect(() => {
    const savedHeadphone = getHeadphoneModel();
    if (savedHeadphone) {
      setHeadphoneConfirmed(true);
      const session = createSession(savedHeadphone);
      // Set testType to highFrequency to distinguish from standard tests
      session.testType = 'highFrequency';
      setCurrentSession(session);
    }
  }, []);
  
  // Update progress when session data changes
  useEffect(() => {
    if (currentSession) {
      const totalTests = HIGH_FREQUENCIES.length * 2; // left and right ears
      const completedTests = currentSession.data.length;
      setTestProgress(Math.round((completedTests / totalTests) * 100));
    }
  }, [currentSession]);
  
  const handleHeadphoneConfirmed = (headphone: string) => {
    setHeadphoneConfirmed(true);
    const session = createSession(headphone);
    session.testType = 'highFrequency';
    setCurrentSession(session);
  };
  
  const handleCalibrationConfirmed = () => {
    setCalibrationConfirmed(true);
  };
  
  const handleHeardIt = (frequency: number, ear: Ear, gainLevel: number) => {
    if (!currentSession) return;
    
    const result: ToneResult = {
      frequency,
      ear,
      gainLevel,
    };
    
    const updatedSession = addResultToSession(currentSession, result);
    setCurrentSession(updatedSession);
  };
  
  const handleToggleEar = () => {
    setSelectedEar(prev => prev === 'left' ? 'right' : 'left');
  };
  
  const handleFinishTest = () => {
    if (!currentSession) return;
    
    finalizeAndSaveSession(currentSession);
    router.push('/frequencies'); // Stay on the same page to view results
  };
  
  // Get saved gain level for a frequency and ear if it exists, otherwise return preset
  const getSavedGainLevel = (frequency: number, ear: Ear) => {
    if (!currentSession) return PRESET_GAIN_LEVEL;
    
    const result = currentSession.data.find(
      (r: ToneResult) => r.frequency === frequency && r.ear === ear
    );
    
    return result?.gainLevel ?? PRESET_GAIN_LEVEL;
  };
  
  // Check if all frequencies have been tested for current ear
  const isEarComplete = (ear: Ear) => {
    if (!currentSession) return false;
    
    return HIGH_FREQUENCIES.every(freq => 
      currentSession.data.some(
        (r: ToneResult) => r.frequency === freq && r.ear === ear
      )
    );
  };
  
  // Check if the entire test is complete
  const isTestComplete = () => {
    return isEarComplete('left') && isEarComplete('right');
  };
  
  // Check if we have any test data to show
  const hasTestData = () => {
    return currentSession && currentSession.data.length > 0;
  };
  
  if (!headphoneConfirmed) {
    return <HeadphoneWarning onHeadphoneConfirmed={handleHeadphoneConfirmed} />;
  }
  
  if (!calibrationConfirmed) {
    return <CalibrationComponent onContinue={handleCalibrationConfirmed} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">High Frequency Hearing Test</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedEar('left')}
              className={`px-4 py-2 rounded-md ${
                selectedEar === 'left' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Left Ear {isEarComplete('left') ? '✓' : ''}
            </button>
            <button
              onClick={() => setSelectedEar('right')}
              className={`px-4 py-2 rounded-md ${
                selectedEar === 'right' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Right Ear {isEarComplete('right') ? '✓' : ''}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Progress: {testProgress}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${testProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {HIGH_FREQUENCIES.map(freq => (
          <FrequencySlider
            key={`${freq}-${selectedEar}`}
            frequency={freq}
            ear={selectedEar}
            onHeardIt={handleHeardIt}
            savedGainLevel={getSavedGainLevel(freq, selectedEar)}
          />
        ))}
      </div>
      
      {hasTestData() && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">High Frequency Test Results</h2>
          <AudiogramChart 
            sessions={[currentSession!]} 
            selectedSessionIds={[currentSession!.id]}
            showLeftEar={true}
            showRightEar={true}
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={handleToggleEar}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Switch to {selectedEar === 'left' ? 'Right' : 'Left'} Ear
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Main
          </button>
          
          <button
            onClick={handleFinishTest}
            disabled={!hasTestData()}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              hasTestData()
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Results
          </button>
        </div>
      </div>
      
      {!hasTestData() && (
        <p className="mt-2 text-sm text-gray-600">
          Start testing frequencies. You can save results at any time - not all frequencies need to be tested.
        </p>
      )}
    </div>
  );
}
