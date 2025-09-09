'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, FileImage, Download } from 'lucide-react';

interface ProgressItem {
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  originalSize?: number;
  convertedSize?: number;
  compressionRatio?: number;
}

interface EnhancedProgressTrackerProps {
  items: ProgressItem[];
  overallProgress: number;
  isComplete: boolean;
  onRetry?: (fileName: string) => void;
  className?: string;
}

export default function EnhancedProgressTracker({
  items,
  overallProgress,
  isComplete,
  onRetry,
  className = ''
}: EnhancedProgressTrackerProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        );
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-slate-300 dark:bg-slate-600';
    }
  };

  const completedCount = items.filter(item => item.status === 'completed').length;
  const errorCount = items.filter(item => item.status === 'error').length;
  const processingCount = items.filter(item => item.status === 'processing').length;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {/* Overall Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Conversion Progress
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {completedCount} of {items.length} completed
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="relative">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white mix-blend-difference">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex items-center space-x-4 mt-3 text-sm">
          {completedCount > 0 && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>{completedCount} completed</span>
            </div>
          )}
          {processingCount > 0 && (
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
              <span>{processingCount} processing</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errorCount} failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Individual File Progress */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={`${item.fileName}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
          >
            {/* File Icon */}
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileImage className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {item.fileName}
                </p>
                {getStatusIcon(item.status)}
              </div>
              
              {/* Progress Bar */}
              {item.status === 'processing' && (
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-1">
                  <motion.div
                    className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* File Size Info */}
              {item.originalSize && item.convertedSize && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatFileSize(item.originalSize)}</span>
                  <span>→</span>
                  <span>{formatFileSize(item.convertedSize)}</span>
                  {item.compressionRatio && (
                    <span className="text-green-600 dark:text-green-400">
                      ({item.compressionRatio}% smaller)
                    </span>
                  )}
                </div>
              )}

              {/* Error Message */}
              {item.status === 'error' && item.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {item.error}
                </p>
              )}
            </div>

            {/* Retry Button */}
            {item.status === 'error' && onRetry && (
              <button
                onClick={() => onRetry(item.fileName)}
                className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Retry
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Summary */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
              Conversion Complete!
            </h4>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            {completedCount} files processed successfully
            {errorCount > 0 && `, ${errorCount} failed`}
          </p>
        </motion.div>
      )}
    </div>
  );
}
