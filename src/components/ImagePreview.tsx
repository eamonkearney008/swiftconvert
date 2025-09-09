'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  index: number;
}

export function ImagePreview({ file, onRemove, index }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'IMG';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded-lg flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {file.name}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Failed to load preview
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image Preview */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={preview!}
          alt={file.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-bold text-white bg-black/50 rounded backdrop-blur-sm">
            {getFileExtension(file.name)}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium text-white bg-black/50 rounded backdrop-blur-sm">
            #{index + 1}
          </span>
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="ml-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

