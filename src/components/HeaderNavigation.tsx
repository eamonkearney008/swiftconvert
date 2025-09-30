'use client';

import React, { useEffect } from 'react';
import { memoryManager } from '@/lib/memory-manager';

export default function HeaderNavigation() {
  useEffect(() => {
    const updateMemoryStatus = () => {
      const memoryStatusElement = document.getElementById('memory-status');
      if (memoryStatusElement) {
        const memoryPressure = memoryManager.getMemoryPressureLevel();
        if (memoryPressure === 'high') {
          memoryStatusElement.textContent = '⚠️ Low memory mode';
          memoryStatusElement.className = 'text-xs text-orange-600 dark:text-orange-400 hidden sm:inline';
        } else if (memoryPressure === 'medium') {
          memoryStatusElement.textContent = '⚡ Memory optimized';
          memoryStatusElement.className = 'text-xs text-blue-600 dark:text-blue-400 hidden sm:inline';
        } else {
          memoryStatusElement.textContent = '';
          memoryStatusElement.className = 'hidden';
        }
      }
    };

    // Update memory status on mount and periodically
    updateMemoryStatus();
    const interval = setInterval(updateMemoryStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      {/* Navigation */}
      <div className="hidden md:flex items-center space-x-6 mr-8">
        <a
          href="/"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          Convert
        </a>
        <a
          href="/blog"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          Guides
        </a>
        <a
          href="/tutorials"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          Tutorials
        </a>
        <a
          href="/faq"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          FAQ
        </a>
        <a
          href="/about"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          About
        </a>
      </div>
      
      {/* Mobile Navigation Button */}
      <div className="md:hidden mr-4 px-2">
        <a
          href="/blog"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
        >
          Guides
        </a>
      </div>
      
      {/* Status */}
      <div className="flex items-center space-x-2 md:space-x-4 ml-2 md:ml-8">
        <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
          Processing locally
        </span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="text-xs text-slate-500 dark:text-slate-500">
          <span className="hidden sm:inline">Ctrl+O to open files</span>
          <span className="sm:hidden">Tap to upload</span>
        </div>
        <div className="text-xs text-orange-600 dark:text-orange-400 hidden sm:inline" id="memory-status">
          {/* Memory status will be updated by JavaScript */}
        </div>
      </div>
    </div>
  );
}
