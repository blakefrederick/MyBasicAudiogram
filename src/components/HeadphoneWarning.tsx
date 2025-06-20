'use client';

import { useState, useEffect } from 'react';
import { getHeadphoneModel, saveHeadphoneModel } from '@/lib/storage';

interface HeadphoneWarningProps {
  onHeadphoneConfirmed: (headphone: string) => void;
}

export default function HeadphoneWarning({ onHeadphoneConfirmed }: HeadphoneWarningProps) {
  const [headphone, setHeadphone] = useState('');
  const [savedHeadphone, setSavedHeadphone] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    const savedModel = getHeadphoneModel();
    setSavedHeadphone(savedModel);
    setHeadphone(savedModel);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (headphone) {
      saveHeadphoneModel(headphone);
      onHeadphoneConfirmed(headphone);
    }
  };
  
  const handleHeadphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeadphone = e.target.value;
    setHeadphone(newHeadphone);
    
    // Show warning if changing from a previously saved headphone
    if (savedHeadphone && newHeadphone !== savedHeadphone) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };
  
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Headphone Selection</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="headphone" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your headphone model:
          </label>
          <input
            type="text"
            id="headphone"
            value={headphone}
            onChange={handleHeadphoneChange}
            placeholder="e.g., Sony WH-1000XM5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {showWarning && (
            <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="font-medium">Warning: Headphone model changed</p>
              <p className="text-sm">
                Using different headphones will affect test result comparisons. 
                For accurate tracking, use the same headphones for all tests.
              </p>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Why is this important?</p>
            <p>
              Different headphones have different frequency responses. To ensure 
              accurate comparison between test sessions, you should use the same
              headphones each time.
            </p>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Confirm Headphones
          </button>
        </div>
      </form>
    </div>
  );
}
