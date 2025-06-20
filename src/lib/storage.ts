'use client';

import { HearingTestSession } from './types';

// Local storage keys
const SESSIONS_KEY = 'audiogram_sessions';
const HEADPHONE_KEY = 'headphone_model';

// Get sessions from localStorage
export const getSessions = (): HearingTestSession[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error('Error getting sessions from localStorage:', error);
    return [];
  }
};

// Save a new session to localStorage
export const saveSession = (session: HearingTestSession): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getSessions();
    localStorage.setItem(SESSIONS_KEY, JSON.stringify([...sessions, session]));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
};

// Get saved headphone model
export const getHeadphoneModel = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    return localStorage.getItem(HEADPHONE_KEY) || '';
  } catch (error) {
    console.error('Error getting headphone model from localStorage:', error);
    return '';
  }
};

// Save headphone model
export const saveHeadphoneModel = (model: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(HEADPHONE_KEY, model);
  } catch (error) {
    console.error('Error saving headphone model to localStorage:', error);
  }
};

// Export session data as JSON
export const exportSessionsAsJSON = (): string => {
  const sessions = getSessions();
  return JSON.stringify(sessions, null, 2);
};

// Export session data as CSV
export const exportSessionsAsCSV = (): string => {
  const sessions = getSessions();
  if (sessions.length === 0) return '';
  
  // Create CSV header
  const headers = ['Session ID', 'Timestamp', 'Headphone', 'Frequency', 'Ear', 'Gain Level'];
  
  // Create CSV rows
  const rows = sessions.flatMap(session => 
    session.data.map(result => [
      session.id,
      session.timestamp,
      session.headphone,
      result.frequency,
      result.ear,
      result.gainLevel
    ])
  );
  
  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};
