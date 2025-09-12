'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from '../components/ui/toast';
import { Skeleton, ConversionSkeleton, StatsSkeleton, HistorySkeleton } from '../components/ui/skeleton';
import { LazyImagePreview, LazyConversionResults, LazyProgressTracker, LazyConversionSettings, LazyFileUpload } from '../components/LazyComponents';
import { Tooltip } from '../components/ui/tooltip';
import { FormatConverter } from '../lib/format-converters';
import { getPerformanceMonitor } from '../lib/performance';
import { memoryManager } from '../lib/memory-manager';
import HeaderNavigation from '../components/HeaderNavigation';
import { InContentAd } from '../components/AdSense';

function HomeContent() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conversionResults, setConversionResults] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionProgress, setConversionProgress] = useState({ current: 0, total: 0, currentFile: '' });
  const { addToast } = useToast();
  const [currentSettings, setCurrentSettings] = useState({
    format: 'webp' as 'webp' | 'jpg' | 'png' | 'avif' | 'heic' | 'tiff' | 'gif' | 'bmp' | 'ico',
    quality: 85,
    preserveExif: false,
    preserveColorProfile: false,
  });
  const [currentView, setCurrentView] = useState<'convert' | 'history' | 'stats'>('convert');
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionMethod, setConversionMethod] = useState<'local' | 'edge'>('local');
  const [conversionHistory, setConversionHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalFiles: 0,
    totalSpaceSaved: 0,
    averageReduction: 0,
    totalConversions: 0
  });
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'recent' | 'large-savings'>('all');
  const [memoryStatus, setMemoryStatus] = useState<'low' | 'medium' | 'high'>('low');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history and statistics from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    const savedStats = localStorage.getItem('conversionStatistics');
    
    if (savedHistory) {
      try {
        setConversionHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading conversion history:', error);
      }
    }
    
    if (savedStats) {
      try {
        setStatistics(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading conversion statistics:', error);
      }
    }
  }, []);

  // Save history and statistics to localStorage when they change
  useEffect(() => {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]);

  useEffect(() => {
    localStorage.setItem('conversionStatistics', JSON.stringify(statistics));
  }, [statistics]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'o':
            e.preventDefault();
            fileInputRef.current?.click();
            break;
          case 'Escape':
            if (isConverting) {
              e.preventDefault();
              handleCancelConversion();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConverting]);

  // Cleanup Web Worker and initialize performance monitoring
  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== 'undefined') {
      const perfMonitor = getPerformanceMonitor();
      
      // Log metrics after page load
      setTimeout(() => {
        perfMonitor.logMetrics();
      }, 3000);
    }

    // Monitor memory status (only in browser)
    const updateMemoryStatus = () => {
      if (typeof window !== 'undefined') {
        setMemoryStatus(memoryManager.getMemoryPressureLevel());
      }
    };
    
    // Update memory status every 3 seconds (only in browser)
    let memoryInterval: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined') {
      memoryInterval = setInterval(updateMemoryStatus, 3000);
      updateMemoryStatus(); // Initial update
    }

    return () => {
      if (typeof Worker !== 'undefined') {
        import('../lib/worker-manager').then(({ destroyWorkerManager }) => {
          destroyWorkerManager();
        });
      }
      if (memoryInterval) {
        clearInterval(memoryInterval);
      }
    };
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Use memory manager for intelligent cleanup (only in browser)
      if (typeof window !== 'undefined' && memoryManager.shouldUseLightCleanup()) {
        memoryManager.forceCleanup();
      }
      
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        
        // Validate files before processing
        const validFiles: File[] = [];
        const errors: string[] = [];
        
        files.forEach(file => {
          try {
            // Check if file is valid
            if (!file || !file.name || file.size === undefined) {
              errors.push(`Invalid file: ${file?.name || 'unknown'}`);
              return;
            }
            
            // Check file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
              errors.push(`File too large: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
              return;
            }
            
            // Check if it's an image
            if (file.type && file.type.startsWith('image/')) {
              validFiles.push(file);
            } else {
              errors.push(`Not an image: ${file.name}`);
            }
          } catch (fileError) {
            console.error('Error processing file:', fileError);
            errors.push(`Error processing file: ${file.name}`);
          }
        });
        
        if (validFiles.length > 0) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
          setError(null);
          addToast({
            type: 'success',
            title: 'Files Added',
            description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} ready for conversion`
          });
        }
        
        if (errors.length > 0) {
          addToast({
            type: 'error',
            title: 'File Upload Issues',
            description: errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : '')
          });
        }
      }
    } catch (error) {
      console.error('File input error:', error);
      addToast({
        type: 'error',
        title: 'Upload Failed',
        description: 'An error occurred while processing the files. Please try again.'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles]);
      setError(null);
      addToast({
        type: 'success',
        title: 'Files Dropped',
        description: `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} added successfully`
      });
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Files',
        description: 'Please drop only image files'
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const file = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    addToast({
      type: 'info',
      title: 'File Removed',
      description: `${file.name} has been removed`
    });
  };

  const handleStartConversion = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setIsLoading(true);
    setError(null);
    setConversionResults([]);
    setConversionProgress({ current: 0, total: selectedFiles.length, currentFile: '' });

    // Check for large files and warn user
    const largeFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    const hasLargeFiles = largeFiles.length > 0;
    
    addToast({
      type: 'info',
      title: 'Conversion Started',
      description: hasLargeFiles 
        ? `Processing ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} (${largeFiles.length} large file${largeFiles.length > 1 ? 's' : ''} - may take longer)...`
        : `Processing ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}...`
    });

    try {
      const results: any[] = [];
      
      if (conversionMethod === 'local') {
        // Use memory manager for intelligent batch sizing and cleanup (only in browser)
        const batchSize = typeof window !== 'undefined' ? memoryManager.getRecommendedBatchSize() : 3;
        const delay = typeof window !== 'undefined' ? memoryManager.getRecommendedDelay() : 50;
        
        // Intelligent memory cleanup before starting conversion (only in browser)
        if (typeof window !== 'undefined' && memoryManager.shouldUseLightCleanup()) {
          memoryManager.forceCleanup();
        }
        
        const batches = [];
        for (let i = 0; i < selectedFiles.length; i += batchSize) {
          batches.push(selectedFiles.slice(i, i + batchSize));
        }
        
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          
          // Process batch sequentially for mobile to avoid memory issues
          for (let fileIndex = 0; fileIndex < batch.length; fileIndex++) {
            const file = batch[fileIndex];
            const globalIndex = batchIndex * batchSize + fileIndex;
            
            setConversionProgress({ 
              current: globalIndex + 1, 
              total: selectedFiles.length, 
              currentFile: file.name 
            });
            
            const result = await convertImageLocally(file, currentSettings);
            setConversionResults(prev => [...prev, result]);
            results.push(result);
            
            // Intelligent memory cleanup after each file (only in browser)
            if (typeof window !== 'undefined' && memoryManager.shouldUseLightCleanup()) {
              memoryManager.forceCleanup();
              // Dynamic delay based on memory pressure
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
          
          // Dynamic delay between batches for memory cleanup
          if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * 2));
          }
        }
      } else {
        // Edge processing using API
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          
          setConversionProgress({ 
            current: i + 1, 
            total: selectedFiles.length, 
            currentFile: file.name 
          });
          
          const result = await convertImageOnEdge(file, currentSettings);
          results.push(result);
          setConversionResults(prev => [...prev, result]);
        }
      }

      // Update statistics and history after all conversions are complete
      updateStatisticsAndHistory(results);
      
      addToast({
        type: 'success',
        title: 'Conversion Complete',
        description: `Successfully converted ${results.length} file${results.length > 1 ? 's' : ''}`
      });
      
    } catch (err) {
      setError('Conversion failed. Please try again.');
      addToast({
        type: 'error',
        title: 'Conversion Failed',
        description: 'An error occurred during conversion. Please try again.'
      });
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
      setIsLoading(false);
    }
  };

  const convertImageLocally = async (file: File, settings: any) => {
    try {
      // Check file size and warn for very large files
      const fileSizeMB = file.size / (1024 * 1024);
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      
      console.log('=== MOBILE CONVERSION DEBUG ===');
      console.log('Converting file:', file.name, 'Size:', fileSizeMB.toFixed(1), 'MB');
      console.log('Is Mobile:', isMobile);
      console.log('Format:', settings.format, 'Quality:', settings.quality);
      console.log('===============================');
      
      if (fileSizeMB > 20) {
        console.warn(`Large file detected: ${fileSizeMB.toFixed(1)}MB - conversion may take longer`);
      }

      // Use requestIdleCallback to avoid blocking the main thread
      return new Promise((resolve, reject) => {
        const processConversion = async () => {
          try {
            // Add timeout for large files - longer on mobile
            const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
            const baseTimeout = isMobile ? 45000 : 30000; // 45s base on mobile, 30s on desktop
            const timeoutMs = fileSizeMB > 10 ? (baseTimeout * 2) : baseTimeout;
            
            console.log(`Conversion timeout: ${timeoutMs}ms (mobile: ${isMobile}, fileSize: ${fileSizeMB}MB)`);
            
            const conversionPromise = FormatConverter.convertToFormat(file, settings.format, settings.quality);
            const timeoutPromise = new Promise((_, timeoutReject) => {
              setTimeout(() => timeoutReject(new Error('Conversion timeout - file may be too large')), timeoutMs);
            });

            const result = await Promise.race([conversionPromise, timeoutPromise]) as any;
            
            resolve({
              originalFile: file,
              convertedFile: result.blob,
              originalSize: file.size,
              convertedSize: result.blob.size,
              format: settings.format,
              actualFormat: result.actualFormat,
              fallbackUsed: result.fallbackUsed,
              quality: settings.quality,
              method: 'optimized-main-thread'
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Conversion failed for ${file.name}:`, errorMessage);
            reject(new Error(`Failed to convert image: ${errorMessage}`));
          }
        };

        // Use requestIdleCallback if available, otherwise use setTimeout
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processConversion, { timeout: 200 });
        } else {
          setTimeout(processConversion, 0);
        }
      });
    } catch (error) {
      throw new Error(`Failed to convert image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const convertImageOnEdge = async (file: File, settings: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('settings', JSON.stringify({
      format: settings.format,
      quality: settings.quality,
      preserveExif: settings.preserveExif,
      preserveColorProfile: settings.preserveColorProfile
    }));

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge conversion failed: ${errorText}`);
    }

    const blob = await response.blob();
    const originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
    const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || '0');
    
    return {
      originalFile: file,
      convertedFile: blob,
      originalSize: originalSize || file.size,
      convertedSize: compressedSize || blob.size,
      format: settings.format,
      actualFormat: settings.format, // Edge processing should support the requested format
      fallbackUsed: false, // Edge processing doesn't use fallbacks
      quality: settings.quality,
      method: 'edge'
    };
  };

  const handleCancelConversion = () => {
    setIsConverting(false);
  };

  const handleSettingsChange = useCallback((settings: any) => {
    setCurrentSettings(settings);
  }, []);

  // Update statistics and history
  const updateStatisticsAndHistory = useCallback((results: any[]) => {
    if (results.length === 0) return;

    const totalFiles = results.length;
    const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
    const totalConvertedSize = results.reduce((sum, result) => sum + result.convertedSize, 0);
    const totalSpaceSaved = totalOriginalSize - totalConvertedSize;
    const averageReduction = totalOriginalSize > 0 ? (totalSpaceSaved / totalOriginalSize) * 100 : 0;

    // Update statistics
    setStatistics(prev => ({
      totalFiles: prev.totalFiles + totalFiles,
      totalSpaceSaved: prev.totalSpaceSaved + totalSpaceSaved,
      averageReduction: prev.totalFiles > 0 ? 
        ((prev.totalSpaceSaved + totalSpaceSaved) / (prev.totalFiles + totalFiles)) * 100 : 
        averageReduction,
      totalConversions: prev.totalConversions + 1
    }));

    // Add to history
    const historyEntry = {
      id: `conversion_${results[0]?.originalFile.name || 'batch'}_${results.length}`,
      timestamp: new Date().toISOString(),
      files: results.map(result => ({
        name: result.originalFile.name,
        originalSize: result.originalSize,
        convertedSize: result.convertedSize,
        format: result.format,
        method: result.method
      })),
      totalFiles,
      totalSpaceSaved,
      averageReduction
    };

    setConversionHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  const handleDownloadAll = async () => {
    if (conversionResults.length === 0) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      conversionResults.forEach((result, index) => {
        const fileName = `converted_${index + 1}.${result.actualFormat || result.format}`;
        zip.file(fileName, result.convertedFile);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to create ZIP file. Please try again.');
    }
  };

  const handleDownloadSingle = (result: any, index: number) => {
    const url = URL.createObjectURL(result.convertedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${index + 1}.${result.actualFormat || result.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        SnapCovert
              </h1>
            </div>
            <HeaderNavigation />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setCurrentView('convert')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'convert'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Convert
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'stats'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentView === 'convert' && (
          <>
            {/* Hero Section */}
            <motion.div
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 mobile-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Convert Images with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lightning Speed
                </span>
              </motion.h2>
              <motion.p
                className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transform your images with advanced compression and format conversion. 
                Process multiple files simultaneously with our powerful local processing engine.
              </motion.p>
            </motion.div>

            {/* Ad Placement */}
            <div className="flex justify-center mb-8">
              <InContentAd />
            </div>


            {/* File Upload */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border p-4 sm:p-6 md:p-8 transition-all duration-200 ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 border-2' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {isDragOver ? 'Drop Images Here' : 'Upload Images'}
                  </h3>
                  <p id="upload-description" className="text-slate-600 dark:text-slate-400 mb-6">
                    {isDragOver 
                      ? 'Release to upload your images' 
                      : 'Drag and drop your images here, or click to browse'
                    }
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                    aria-label="Choose image files to upload"
                    aria-describedby="upload-description"
                  >
                    Choose Files
                  </button>
                  
                  {/* Memory Status Indicator */}
                  {memoryStatus !== 'low' && (
                    <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
                      memoryStatus === 'high' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          memoryStatus === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <span>
                          {memoryStatus === 'high' 
                            ? 'High memory usage detected - processing will be optimized for stability'
                            : 'Multiple tabs detected - using optimized processing'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Selected Files ({selectedFiles.length})
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedFiles([]);
                        addToast({
                          type: 'info',
                          title: 'Files Cleared',
                          description: 'All selected files have been removed'
                        });
                      }}
                      className="text-sm text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {selectedFiles.map((file, index) => (
                        <LazyImagePreview
                          key={`${file.name}-${index}`}
                          file={file}
                          index={index}
                          onRemove={() => handleRemoveFile(index)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Conversion Method Selection */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Conversion Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setConversionMethod('local')}
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      conversionMethod === 'local'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        conversionMethod === 'local'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-slate-400 to-slate-500'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Local Processing</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Fast, private, offline</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setConversionMethod('edge')}
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      conversionMethod === 'edge'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        conversionMethod === 'edge'
                          ? 'bg-gradient-to-br from-green-500 to-green-600'
                          : 'bg-gradient-to-br from-slate-400 to-slate-500'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Edge Processing</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Cloud-powered, advanced</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Presets */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Quick Presets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'webp', quality: 85 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Web Optimized</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">WebP, 85% quality</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'jpg', quality: 60 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">C</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">High Compression</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">JPG, 60% quality</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'png', quality: 100 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">L</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Lossless</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PNG, 100% quality</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'heic', quality: 90 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Apple Format</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">HEIC, 90% quality</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'tiff', quality: 100 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Professional</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">TIFF, 100% quality</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSettingsChange({ ...currentSettings, format: 'gif', quality: 80 })}
                    className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Animation</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">GIF, 80% quality</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Advanced Settings */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Advanced Settings
                  </h3>
                  <Tooltip content="Fine-tune your conversion settings for optimal results">
                    <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Output Format
                      </label>
                      <Tooltip content="Choose the output format. WebP offers the best compression, AVIF is the newest format with excellent quality, PNG is lossless, and JPEG is widely compatible.">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Tooltip>
                    </div>
                    <select
                      value={currentSettings.format}
                      onChange={(e) => handleSettingsChange({ ...currentSettings, format: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select output image format"
                      aria-describedby="format-description"
                    >
                      <option value="webp">WebP - Best compression</option>
                      <option value="avif">AVIF - Next-gen format</option>
                      <option value="png">PNG - Lossless</option>
                      <option value="jpg">JPEG - Universal</option>
                      <option value="heic">HEIC - Apple format</option>
                      <option value="tiff">TIFF - Professional</option>
                      <option value="gif">GIF - Animation</option>
                      <option value="bmp">BMP - Uncompressed</option>
                      <option value="ico">ICO - Icons</option>
                    </select>
                    <div id="format-description" className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentSettings.format === 'webp' && "WebP offers excellent compression with good quality. Best for web use."}
                        {currentSettings.format === 'avif' && "AVIF is the newest format with superior compression. Limited browser support."}
                        {currentSettings.format === 'png' && "PNG is lossless and supports transparency. Best for graphics and screenshots."}
                        {currentSettings.format === 'jpg' && "JPEG is widely supported and good for photos. No transparency support."}
                        {currentSettings.format === 'heic' && "HEIC is Apple's format with excellent compression. Limited browser support."}
                        {currentSettings.format === 'tiff' && "TIFF is used in professional photography and publishing. Large file sizes."}
                        {currentSettings.format === 'gif' && "GIF supports animation and transparency. Limited to 256 colors."}
                        {currentSettings.format === 'bmp' && "BMP is uncompressed and maintains maximum quality. Very large file sizes."}
                        {currentSettings.format === 'ico' && "ICO is used for Windows icons and favicons. Multiple sizes in one file."}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Quality: {currentSettings.quality}%
                      </label>
                      <Tooltip content={
                        currentSettings.format === 'png' || currentSettings.format === 'tiff' || currentSettings.format === 'bmp' 
                          ? "Lossless format - quality setting not applicable"
                          : currentSettings.format === 'gif'
                          ? "GIF uses color reduction - lower values mean fewer colors"
                          : "Higher quality means larger file sizes but better image fidelity. Lower quality reduces file size but may introduce artifacts."
                      }>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Tooltip>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={currentSettings.quality}
                      onChange={(e) => handleSettingsChange({ ...currentSettings, quality: parseInt(e.target.value) })}
                      disabled={currentSettings.format === 'png' || currentSettings.format === 'tiff' || currentSettings.format === 'bmp'}
                      className={`w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider ${
                        currentSettings.format === 'png' || currentSettings.format === 'tiff' || currentSettings.format === 'bmp' 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                      aria-label="Image quality setting"
                      aria-valuemin={10}
                      aria-valuemax={100}
                      aria-valuenow={currentSettings.quality}
                      aria-valuetext={`${currentSettings.quality}% quality`}
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Smaller</span>
                      <span>Larger</span>
                    </div>
                    {(currentSettings.format === 'png' || currentSettings.format === 'tiff' || currentSettings.format === 'bmp') && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Lossless format - quality setting disabled
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Convert Button */}
            {selectedFiles.length > 0 && (
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <button
                  onClick={handleStartConversion}
                  disabled={isConverting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                  aria-label={isConverting ? 'Converting images, please wait' : `Convert ${selectedFiles.length} image file${selectedFiles.length > 1 ? 's' : ''} to ${currentSettings.format.toUpperCase()} format`}
                >
                  {isConverting ? 'Converting...' : `Convert ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
                </button>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-red-800 dark:text-red-300 font-medium mb-1">Conversion Error</h4>
                      <p className="text-red-700 dark:text-red-400 mb-3">{error}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setError(null)}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 text-sm rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            setError(null);
                            handleStartConversion();
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {isLoading && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Converting Images...
                  </h3>
                  
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {conversionProgress.currentFile ? `Processing: ${conversionProgress.currentFile}` : 'Preparing...'}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {conversionProgress.current} of {conversionProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${conversionProgress.total > 0 ? (conversionProgress.current / conversionProgress.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                      {conversionProgress.total > 0 ? `${Math.round((conversionProgress.current / conversionProgress.total) * 100)}% complete` : 'Starting conversion...'}
                    </p>
                  </div>
                  
                  <ConversionSkeleton />
                </div>
              </motion.div>
            )}

            {conversionResults.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Conversion Results
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDownloadAll}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download All</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {conversionResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Tooltip content={result.fallbackUsed ? `Converted to ${(result.actualFormat || result.format).toUpperCase()} (${result.format.toUpperCase()} not supported in browser)` : `${(result.actualFormat || result.format).toUpperCase()} format`}>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded flex items-center justify-center relative cursor-help">
                              <span className="text-white text-xs font-bold">
                                {(result.actualFormat || result.format).toUpperCase()}
                              </span>
                              {result.fallbackUsed && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">!</span>
                                </div>
                              )}
                            </div>
                          </Tooltip>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {result.originalFile.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(result.originalSize / 1024 / 1024).toFixed(2)} MB → {(result.convertedSize / 1024 / 1024).toFixed(2)} MB
                              <span className="ml-2 text-green-600 dark:text-green-400">
                                ({(((result.originalSize - result.convertedSize) / result.originalSize) * 100).toFixed(1)}% smaller)
                              </span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleDownloadSingle(result, index);
                            addToast({
                              type: 'success',
                              title: 'Download Started',
                              description: `${result.originalFile.name} is being downloaded`
                            });
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {currentView === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-0">
                  Conversion History
                </h2>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All conversions</option>
                    <option value="recent">Recent (last 7 days)</option>
                    <option value="large-savings">Large savings (&gt;50%)</option>
                  </select>
                </div>
              </div>
              
              {conversionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No History Yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your conversion history will appear here after you process some images.
                  </p>
                </div>
              ) : (() => {
                const filteredHistory = conversionHistory.filter((entry) => {
                  // Search filter
                  if (historySearch) {
                    const searchLower = historySearch.toLowerCase();
                    const hasMatchingFile = entry.files.some((file: any) => 
                      file.name.toLowerCase().includes(searchLower)
                    );
                    if (!hasMatchingFile) return false;
                  }
                  
                  // Date filter
                  if (historyFilter === 'recent') {
                    const entryDate = new Date(entry.timestamp);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    if (entryDate < weekAgo) return false;
                  }
                  
                  // Savings filter
                  if (historyFilter === 'large-savings') {
                    if (entry.averageReduction < 50) return false;
                  }
                  
                  return true;
                });

                return filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No Results Found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {entry.totalFiles} file{entry.totalFiles > 1 ? 's' : ''} converted
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {((entry.totalSpaceSaved / 1024 / 1024) * 100).toFixed(1)} MB saved
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {entry.averageReduction.toFixed(1)}% reduction
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {entry.files.map((file: any, fileIndex: number) => (
                          <div key={fileIndex} className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-700 rounded px-3 py-2 min-w-0 overflow-hidden">
                            <span className="text-slate-900 dark:text-white truncate flex-1 min-w-0 mr-2">{file.name}</span>
                            <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 min-w-0 flex-shrink-0 max-w-[220px] overflow-hidden">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs flex-shrink-0">
                                {file.format.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs flex-shrink-0">
                                {file.method}
                              </span>
                              <span className="text-xs text-green-600 dark:text-green-400 flex-shrink-0">
                                {((file.originalSize - file.convertedSize) / file.originalSize * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {currentView === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.totalFiles}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Files Processed</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(statistics.totalSpaceSaved / 1024 / 1024).toFixed(1)} MB
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">Space Saved</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {statistics.averageReduction.toFixed(1)}%
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">Average Reduction</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">{statistics.totalConversions}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Total Sessions</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}