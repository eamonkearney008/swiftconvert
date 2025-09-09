'use client';

import React from 'react';

export default function HeaderNavigation() {
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
      </div>
      
      {/* Mobile Navigation Button */}
      <div className="md:hidden mr-8">
        <a
          href="/blog"
          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
        >
          Guides
        </a>
      </div>
      
      {/* Status */}
      <div className="flex items-center space-x-4 ml-8">
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
