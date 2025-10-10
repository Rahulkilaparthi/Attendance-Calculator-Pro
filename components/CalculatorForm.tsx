import React, { useState, useMemo, useEffect } from 'react';

import { SummaryDisplay } from './SummaryDisplay';

export const CalculatorForm: React.FC = () => {
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [minPercentage, setMinPercentage] = useState('75');
  const [error, setError] = useState('');

  const parsedValues = useMemo(() => {
    const total = parseInt(totalClasses, 10);
    const attended = parseInt(attendedClasses, 10);
    const min = parseInt(minPercentage, 10);
    return {
      total: !isNaN(total) && total >= 0 ? total : 0,
      attended: !isNaN(attended) && attended >= 0 ? attended : 0,
      min: !isNaN(min) && min >= 0 && min <= 100 ? min : 75,
    };
  }, [totalClasses, attendedClasses, minPercentage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedValues.attended > parsedValues.total) {
      setError('Attended classes cannot be more than total classes.');
      return;
    }
    if (parsedValues.total <= 0) {
      setError('Total classes must be greater than zero.');
      return;
    }
    setError('');
  };
  
  const formIsValid = parsedValues.total > 0 && parsedValues.attended <= parsedValues.total;

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-300">Calculate Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalClasses" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Total Classes</label>
            <input type="number" id="totalClasses" value={totalClasses} onChange={(e) => setTotalClasses(e.target.value)} min="0" className="mt-1 block w-full bg-slate-100/70 dark:bg-gray-900/50 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-md shadow-sm focus:ring-0 sm:text-sm h-10 px-3" />
          </div>
          <div>
            <label htmlFor="attendedClasses" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Attended Classes</label>
            <input type="number" id="attendedClasses" value={attendedClasses} onChange={(e) => setAttendedClasses(e.target.value)} min="0" max={totalClasses || undefined} className="mt-1 block w-full bg-slate-100/70 dark:bg-gray-900/50 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-md shadow-sm focus:ring-0 sm:text-sm h-10 px-3" />
          </div>
        </div>
        <div>
          <label htmlFor="minPercentage" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Required % ({minPercentage}%)</label>
          <input type="range" id="minPercentage" value={minPercentage} onChange={(e) => setMinPercentage(e.target.value)} min="1" max="100" className="mt-1 block w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500 dark:accent-teal-400" />
        </div>
        <div className="pt-4 space-y-3">
           <button type="submit" disabled={!formIsValid} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-teal-500'} `}>
            Calculate
          </button>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-center">{error}</p>}
      </form>
      <div className="mt-6 border-t border-slate-300/70 dark:border-gray-700/70 pt-6">
        <SummaryDisplay 
          totalClasses={parsedValues.total} 
          attendedClasses={parsedValues.attended} 
          minPercentage={parsedValues.min} 
        />
      </div>
    </div>
  );
};