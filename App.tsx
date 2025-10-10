import React, { useState, useEffect, useMemo } from 'react';
// import { StudentRecord, SortConfig, SortKey } from './types';
import { CalculatorForm } from './components/CalculatorForm';
// import { RecordsTable } from './components/RecordsTable';
// import { generateAvatar } from './lib/avatarGenerator';

const App: React.FC = () => {
  // All record-related state removed

  // Effect to set theme based on system preference and listen for changes
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (isDark: boolean) => {
      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    };

    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches);
    };

    applyTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header 
          className="flex justify-between items-center mt-10 mb-10"
        >
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-300 dark:to-blue-500">
              Attendance Pro
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Track your attendance, stay on top of your requirements.</p>
          </div>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-1 gap-8 justify-center">
          <div 
            className="lg:col-span-1"
          >
            <CalculatorForm />
          </div>
        </main>
        
        <footer 
          className="text-center mt-12 text-gray-500 dark:text-gray-500 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Attendance Calculator Pro. All rights reserved.</p>
          <p className="mt-1">Note: Data is stored locally in your browser. No information is sent to a server.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
