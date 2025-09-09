'use client';

import React from 'react';

export default function Navigation() {
  return (
    <div className="flex items-center snapconvert-navigation-v5">
      {/* Navigation */}
      <div className="hidden md:flex items-center snapconvert-nav-desktop">
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
      </div>
      
      {/* Mobile Navigation Button */}
      <div className="md:hidden snapconvert-nav-mobile">
        <a
          href="/blog"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
        >
          Guides
        </a>
      </div>
      
      {/* Status */}
      <div className="flex items-center snapconvert-status">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Processing locally
        </span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="text-xs text-slate-500 dark:text-slate-500">
          <span className="hidden sm:inline">Ctrl+O to open files</span>
          <span className="sm:hidden">Tap to upload</span>
        </div>
      </div>
    </div>
  );
}
