'use client';

import { HearingTestSession, ToneResult } from './types';
import { getSessions, saveSession } from './storage';

// Create a new session with a timestamp and headphone model
export const createSession = (headphone: string): HearingTestSession => {
  return {
    id: generateSessionId(),
    timestamp: new Date().toISOString(),
    headphone,
    data: []
  };
};

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Add a result to a session
export const addResultToSession = (
  session: HearingTestSession,
  result: ToneResult
): HearingTestSession => {
  // Check if we already have a result for this frequency and ear
  const existingIndex = session.data.findIndex(
    item => item.frequency === result.frequency && item.ear === result.ear
  );
  
  if (existingIndex >= 0) {
    // Update existing result
    const updatedData = [...session.data];
    updatedData[existingIndex] = result;
    
    return {
      ...session,
      data: updatedData
    };
  } else {
    // Add new result
    return {
      ...session,
      data: [...session.data, result]
    };
  }
};

// Check if a session is complete (has all required frequencies and ears)
export const isSessionComplete = (
  session: HearingTestSession,
  frequencies: number[],
  ears: string[]
): boolean => {
  return frequencies.every(freq => 
    ears.every(ear => 
      session.data.some(result => 
        result.frequency === freq && result.ear === ear
      )
    )
  );
};

// Save a completed session
export const finalizeAndSaveSession = (session: HearingTestSession): void => {
  saveSession(session);
};

// Get session by ID
export const getSessionById = (sessionId: string): HearingTestSession | undefined => {
  const sessions = getSessions();
  return sessions.find(session => session.id === sessionId);
};

// Compare two sessions and get the differences
export const compareSessionsData = (
  sessionA: HearingTestSession,
  sessionB: HearingTestSession
): { frequency: number; ear: string; sessionAGain: number; sessionBGain: number; difference: number }[] => {
  const comparisons: { frequency: number; ear: string; sessionAGain: number; sessionBGain: number; difference: number }[] = [];
  
  // Only compare if headphones match
  if (sessionA.headphone !== sessionB.headphone) {
    console.warn('Cannot compare sessions with different headphone models');
    return [];
  }
  
  // Get all unique frequency/ear combinations
  const frequencyEarPairs = new Set<string>();
  [...sessionA.data, ...sessionB.data].forEach(result => {
    frequencyEarPairs.add(`${result.frequency}-${result.ear}`);
  });
  
  // Compare each frequency/ear pair
  frequencyEarPairs.forEach(pair => {
    const [frequency, ear] = pair.split('-');
    const freqNum = parseInt(frequency, 10);
    
    const resultA = sessionA.data.find(r => r.frequency === freqNum && r.ear === ear);
    const resultB = sessionB.data.find(r => r.frequency === freqNum && r.ear === ear);
    
    if (resultA && resultB) {
      comparisons.push({
        frequency: freqNum,
        ear,
        sessionAGain: resultA.gainLevel,
        sessionBGain: resultB.gainLevel,
        difference: resultB.gainLevel - resultA.gainLevel
      });
    }
  });
  
  return comparisons;
};
