import React, { useMemo, useState, useEffect, useRef } from 'react';

interface SummaryDisplayProps {
  totalClasses: number;
  attendedClasses: number;
  minPercentage: number;
}

const AttendanceGauge: React.FC<{ title: string; percentage: number; statusColorClass: string }> = ({ title, percentage, statusColorClass }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="bg-slate-100/50 dark:bg-gray-900/30 p-4 rounded-xl text-center flex flex-col justify-center items-center h-full">
      <h4 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-slate-200/70 dark:text-gray-600/50"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={statusColorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-3xl font-bold ${statusColorClass}`}>{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};


export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ totalClasses, attendedClasses, minPercentage }) => {
  const [classesToMissInput, setClassesToMissInput] = useState('');

  const {
    currentPercentage,
    status,
    message,
    percentageAfterNextMiss,
    projectedPercentage,
    validMissedClasses,
  } = useMemo(() => {
    if (totalClasses <= 0 || attendedClasses > totalClasses) {
      return {
        currentPercentage: 0,
        status: 'gray',
        message: 'Enter valid class details to see the summary.',
        percentageAfterNextMiss: 0,
        projectedPercentage: 0,
        validMissedClasses: 0,
      };
    }

    const percentage = (attendedClasses / totalClasses) * 100;
    let currentStatus: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
    let summaryMessage = '';

    if (percentage >= minPercentage) {
      currentStatus = percentage >= minPercentage + 5 ? 'green' : 'yellow';
      const classesToMiss = Math.floor((100 * attendedClasses - minPercentage * totalClasses) / minPercentage);
      if (classesToMiss >= 0) {
        summaryMessage = `You can miss the next ${classesToMiss} class${classesToMiss !== 1 ? 'es' : ''}.`;
      } else {
         summaryMessage = "You're on the edge! Don't miss any more classes.";
      }
    } else {
      currentStatus = 'red';
      const classesToAttend = Math.ceil((minPercentage * totalClasses - 100 * attendedClasses) / (100 - minPercentage));
      summaryMessage = `You need to attend the next ${classesToAttend} class${classesToAttend !== 1 ? 'es' : ''} consecutively.`;
    }
    
    const nextMissPercentage = totalClasses > 0 ? (attendedClasses / (totalClasses + 1)) * 100 : 0;

    const missedClasses = parseInt(classesToMissInput, 10);
    const validMissedClasses = !isNaN(missedClasses) && missedClasses >= 0 ? missedClasses : 0;
    const projectedTotalClasses = totalClasses + validMissedClasses;
    const projectedPercentage = projectedTotalClasses > 0 ? (attendedClasses / projectedTotalClasses) * 100 : 0;

    return {
      currentPercentage: percentage,
      status: currentStatus,
      message: summaryMessage,
      percentageAfterNextMiss: nextMissPercentage,
      projectedPercentage,
      validMissedClasses,
    };
  }, [totalClasses, attendedClasses, minPercentage, classesToMissInput]);
  
  const colorMap = {
    green: 'text-green-500 dark:text-green-400',
    yellow: 'text-yellow-500 dark:text-yellow-400',
    red: 'text-red-500 dark:text-red-400',
    gray: 'text-gray-500 dark:text-gray-400'
  };
  
  const statusColorClass = colorMap[status];

  const getStatusForPercentage = (percentage: number) => {
    if (totalClasses <= 0) return 'gray';
    if (percentage < minPercentage) return 'red';
    if (percentage < minPercentage + 5) return 'yellow';
    return 'green';
  };
  
  const nextMissStatusColorClass = colorMap[getStatusForPercentage(percentageAfterNextMiss)];
  const projectedStatusColorClass = projectedPercentage < minPercentage ? colorMap['red'] : 'text-gray-800 dark:text-gray-300';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Live Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <AttendanceGauge 
                title="Current %"
                percentage={currentPercentage} 
                statusColorClass={statusColorClass}
            />
        </div>
        <div>
            <AttendanceGauge 
                title="If You Miss 1"
                percentage={percentageAfterNextMiss} 
                statusColorClass={nextMissStatusColorClass}
            />
        </div>
      </div>
      <div className={`mt-4 p-3 rounded-xl text-center bg-slate-100/50 dark:bg-gray-900/30`}>
        <p className={`font-semibold ${statusColorClass}`}>{message}</p>
      </div>

      <div className="mt-6 border-t border-slate-300/70 dark:border-gray-700/70 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Future Projection</h3>
        <div>
          <label htmlFor="classesToMiss" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">How many classes will you miss?</label>
          <input
            type="number"
            id="classesToMiss"
            value={classesToMissInput}
            onChange={(e) => setClassesToMissInput(e.target.value)}
            min="0"
            placeholder="e.g., 3"
            className="block w-full bg-slate-100/70 dark:bg-gray-900/50 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-md shadow-sm focus:ring-0 sm:text-sm h-10 px-3 text-center"
            aria-label="Number of classes to miss for projection"
          />
        </div>
        {classesToMissInput && parseInt(classesToMissInput) >= 0 && (
            <div className="mt-4 bg-slate-100/50 dark:bg-gray-900/30 p-4 rounded-xl text-center flex flex-col justify-between h-full">
                <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Attendance</h4>
                    <p className={`text-3xl font-bold ${projectedStatusColorClass}`}>{projectedPercentage.toFixed(2)}%</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">After missing {validMissedClasses} more class{validMissedClasses !== 1 ? 'es' : ''}</p>
            </div>
        )}
      </div>
    </div>
  );
};