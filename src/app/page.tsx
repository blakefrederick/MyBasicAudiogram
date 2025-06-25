'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSessions } from '@/lib/storage';

export default function Home() {
  const [sessionCount, setSessionCount] = useState(0);
  
  useEffect(() => {
    const sessions = getSessions();
    setSessionCount(sessions.length);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">MyBasicAudiogram</h1>
        <p className="text-xl text-gray-600 mb-8">
          Track your hearing thresholds over time
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link 
            href="/test" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
          >
            Start New Test
          </Link>
          <Link 
            href="/frequencies" 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg"
          >
            High Frequency Test
          </Link>
          {sessionCount > 0 && (
            <Link 
              href="/history" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg"
            >
              View History ({sessionCount})
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Put on your headphones</li>
            <li>Listen for tones at different frequencies</li>
            <li>Adjust volume until you can just barely hear it</li>
            <li>Save your results to track changes over time</li>
          </ol>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Very Important</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>This is NOT a medical diagnostic tool</li>
            <li>Consult a healthcare professional immediately for hearing concerns</li>
            <li>Always use the same headphones for consistent results</li>
            <li>Test in a quiet environment</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">About Audiograms</h2>
        <p className="text-gray-700 mb-4">
          An audiogram is a graph that shows the softest sounds a person can hear at different 
          frequencies (pitches). This app represents a simplified and rudimentary method to help you track relative
          changes in your hearing over time.
        </p>
        <p className="text-gray-700">
          Regular testing may help you monitor your hearing health and detect changes early.
          However, this app is NOT a substitute for professional hearing tests.
        </p>
      </div>
    </div>
  );
}
