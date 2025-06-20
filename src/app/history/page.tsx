'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AudiogramChart from '@/components/AudiogramChart';
import { HearingTestSession } from '@/lib/types';
import { getSessions, exportSessionsAsJSON, exportSessionsAsCSV } from '@/lib/storage';
import { compareSessionsData } from '@/lib/session';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<HearingTestSession[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [showLeftEar, setShowLeftEar] = useState(true);
  const [showRightEar, setShowRightEar] = useState(true);
  const [comparisonData, setComparisonData] = useState<Array<{
    frequency: number;
    ear: string;
    sessionAGain: number;
    sessionBGain: number;
    difference: number;
  }>>([]);
  
  // Load sessions on component mount
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
    
    // Auto-select the most recent session if available
    if (loadedSessions.length > 0) {
      setSelectedSessionIds([loadedSessions[0].id]);
    }
  }, []);
  
  // Update comparison data when selected sessions change
  useEffect(() => {
    if (selectedSessionIds.length === 2) {
      const sessionA = sessions.find(s => s.id === selectedSessionIds[0]);
      const sessionB = sessions.find(s => s.id === selectedSessionIds[1]);
      
      if (sessionA && sessionB) {
        const comparison = compareSessionsData(sessionA, sessionB);
        setComparisonData(comparison);
      }
    } else {
      setComparisonData([]);
    }
  }, [selectedSessionIds, sessions]);
  
  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionIds(prev => {
      // If already selected, remove it
      if (prev.includes(sessionId)) {
        return prev.filter(id => id !== sessionId);
      }
      
      // If we already have 2 sessions selected, replace the oldest one
      if (prev.length >= 2) {
        return [prev[1], sessionId];
      }
      
      // Otherwise add it
      return [...prev, sessionId];
    });
  };
  
  const handleExportJSON = () => {
    const jsonData = exportSessionsAsJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `audiogram_sessions_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleExportCSV = () => {
    const csvData = exportSessionsAsCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `audiogram_sessions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Check if two sessions can be compared (same headphone model)
  const canCompare = (sessionA: HearingTestSession, sessionB: HearingTestSession) => {
    return sessionA.headphone === sessionB.headphone;
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test History</h1>
        <Link 
          href="/test" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Take New Test
        </Link>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600 mb-4">No test sessions found.</p>
          <Link 
            href="/test" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Take Your First Test
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Select Sessions</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select up to two sessions to compare. You can only compare tests taken with the same headphones.
              </p>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.map(session => (
                  <div 
                    key={session.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedSessionIds.includes(session.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {formatTimestamp(session.timestamp)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Headphones: {session.headphone}
                        </div>
                      </div>
                      {selectedSessionIds.includes(session.id) && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          {selectedSessionIds.indexOf(session.id) + 1}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium mb-2">Display Options</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showLeftEar}
                      onChange={() => setShowLeftEar(!showLeftEar)}
                      className="mr-2"
                    />
                    Left Ear
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showRightEar}
                      onChange={() => setShowRightEar(!showRightEar)}
                      className="mr-2"
                    />
                    Right Ear
                  </label>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium mb-2">Export Data</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {/* Chart Display */}
            {selectedSessionIds.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <AudiogramChart
                  sessions={sessions}
                  selectedSessionIds={selectedSessionIds}
                  showLeftEar={showLeftEar}
                  showRightEar={showRightEar}
                />
              </div>
            )}
            
            {/* Session Comparison */}
            {selectedSessionIds.length === 2 && comparisonData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Session Comparison</h2>
                
                {/* Check if headphones match */}
                {!canCompare(
                  sessions.find(s => s.id === selectedSessionIds[0])!,
                  sessions.find(s => s.id === selectedSessionIds[1])!
                ) ? (
                  <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
                    <p className="font-medium">Warning: Different Headphones</p>
                    <p className="text-sm">
                      These sessions were taken with different headphones, which may affect comparison accuracy.
                    </p>
                  </div>
                ) : null}
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Frequency</th>
                        <th className="px-4 py-2">Ear</th>
                        <th className="px-4 py-2">
                          Session 1 <span className="text-xs text-gray-500">
                            ({formatTimestamp(sessions.find(s => s.id === selectedSessionIds[0])?.timestamp || '')})
                          </span>
                        </th>
                        <th className="px-4 py-2">
                          Session 2 <span className="text-xs text-gray-500">
                            ({formatTimestamp(sessions.find(s => s.id === selectedSessionIds[1])?.timestamp || '')})
                          </span>
                        </th>
                        <th className="px-4 py-2">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((comp, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2">{comp.frequency} Hz</td>
                          <td className="px-4 py-2">{comp.ear}</td>
                          <td className="px-4 py-2">{comp.sessionAGain}%</td>
                          <td className="px-4 py-2">{comp.sessionBGain}%</td>
                          <td className={`px-4 py-2 font-medium ${
                            comp.difference > 0 
                              ? 'text-green-600' 
                              : comp.difference < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {comp.difference > 0 ? '+' : ''}{comp.difference}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Note:</span> A positive change means a higher volume 
                    was needed to hear the tone in the second session, which may indicate hearing loss 
                    at that frequency. A negative change suggests improvement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
