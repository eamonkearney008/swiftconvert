'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  index: number;
}

export default function ImagePreview({ file, onRemove, index }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [forceReload, setForceReload] = useState(0);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        // Reset states
        setError(false);
        setIsLoading(true);
        setPreview(null);

        // Validate file before reading
        if (!file || !file.name || file.size === undefined) {
          console.error('Invalid file object:', file);
          setError(true);
          setIsLoading(false);
          return;
        }

        console.log('Loading preview for file:', file.name, 'Type:', file.type, 'Size:', file.size);
        console.log('File constructor:', file.constructor.name);
        console.log('File instanceof File:', file instanceof File);
        console.log('File instanceof Blob:', file instanceof Blob);

        // Check file type more thoroughly
        const isValidImage = file.type && (
          file.type.startsWith('image/') || 
          /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name)
        );

        if (!isValidImage) {
          console.error('File is not a valid image:', file.name, file.type);
          setError(true);
          setIsLoading(false);
          return;
        }

        // Check file size - increased limits for better support
        const isMobile = window.innerWidth <= 768;
        const maxSize = isMobile ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB on mobile, 50MB on desktop
        
        if (file.size > maxSize) {
          console.error(`File too large for preview: ${file.size} bytes (max: ${maxSize} bytes on ${isMobile ? 'mobile' : 'desktop'})`);
          setError(true);
          setIsLoading(false);
          return;
        }
        
        console.log(`File size check passed: ${file.size} bytes (${isMobile ? 'mobile' : 'desktop'} limit: ${maxSize} bytes)`);

        // For mobile and large files, try to resize first
        let fileToUse = file;
        if (isMobile && file.size > 2 * 1024 * 1024) { // 2MB threshold for resizing
          try {
            console.log('Large file on mobile - attempting to resize for preview...');
            fileToUse = await resizeImageForMobile(file);
          } catch (resizeError) {
            console.log('Resize failed, using original file:', resizeError);
            fileToUse = file;
          }
        }

        // Try multiple approaches in sequence
        let previewLoaded = false;

        // Approach 1: URL.createObjectURL (most reliable on mobile)
        try {
          console.log('Trying URL.createObjectURL...');
          console.log('File before URL.createObjectURL:', {
            name: fileToUse.name,
            type: fileToUse.type,
            size: fileToUse.size,
            lastModified: fileToUse.lastModified
          });
          
          const url = URL.createObjectURL(fileToUse);
          console.log('URL created:', url);
          setObjectURL(url);
          
          // Test if the URL works by creating an image
          const testImg = new Image();
          testImg.onload = () => {
            console.log('URL.createObjectURL success - image loaded');
            setPreview(url);
            setIsLoading(false);
            previewLoaded = true;
          };
          testImg.onerror = (error) => {
            console.log('URL.createObjectURL failed - image error:', error);
            console.log('Image error details:', {
              src: testImg.src,
              naturalWidth: testImg.naturalWidth,
              naturalHeight: testImg.naturalHeight
            });
            URL.revokeObjectURL(url);
            setObjectURL(null);
            
            // Approach 2: FileReader
            if (!previewLoaded) {
              tryFileReader();
            }
          };
          testImg.src = url;
          
          // Timeout for image test
          setTimeout(() => {
            if (!previewLoaded) {
              console.log('URL.createObjectURL timeout, trying FileReader...');
              URL.revokeObjectURL(url);
              setObjectURL(null);
              tryFileReader();
            }
          }, 3000);
          
        } catch (urlError) {
          console.error('URL.createObjectURL error:', urlError);
          tryFileReader();
        }

        function tryFileReader() {
          if (previewLoaded) return;
          
          try {
            console.log('Trying FileReader...');
            console.log('File for FileReader:', {
              name: fileToUse.name,
              type: fileToUse.type,
              size: fileToUse.size
            });
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
              try {
                const result = e.target?.result;
                console.log('FileReader result type:', typeof result);
                console.log('FileReader result length:', result ? result.length : 'null');
                console.log('FileReader result starts with data:', result ? result.startsWith('data:') : false);
                
                if (result && typeof result === 'string' && result.startsWith('data:')) {
                  console.log('FileReader success - data URL created');
                  
                  // Test if data URL works with Image
                  const testImg = new Image();
                  testImg.onload = () => {
                    console.log('Data URL image loaded successfully');
                    setPreview(result);
                    setIsLoading(false);
                    previewLoaded = true;
                  };
                  testImg.onerror = (error) => {
                    console.log('Data URL image failed to load:', error);
                    if (!previewLoaded) {
                      tryDirectURL();
                    }
                  };
                  testImg.src = result;
                } else {
                  console.error('FileReader returned invalid result:', result);
                  if (!previewLoaded) {
                    tryDirectURL();
                  }
                }
              } catch (loadError) {
                console.error('Error setting preview:', loadError);
                if (!previewLoaded) {
                  tryDirectURL();
                }
              }
            };

            reader.onerror = (error) => {
              console.error('FileReader error:', error);
              if (!previewLoaded) {
                tryDirectURL();
              }
            };

            reader.onabort = () => {
              console.error('FileReader aborted');
              if (!previewLoaded) {
                tryDirectURL();
              }
            };

            // Set timeout for FileReader
            const timeout = setTimeout(() => {
              if (!previewLoaded) {
                console.error('FileReader timeout');
                reader.abort();
                tryDirectURL();
              }
            }, 5000);

            reader.onloadend = () => {
              clearTimeout(timeout);
            };

            reader.readAsDataURL(fileToUse);
            
          } catch (readerError) {
            console.error('FileReader initialization error:', readerError);
            if (!previewLoaded) {
              tryDirectURL();
            }
          }
        }

        function tryDirectURL() {
          if (previewLoaded) return;
          
          try {
            console.log('Trying direct URL.createObjectURL without image test...');
            const url = URL.createObjectURL(fileToUse);
            setObjectURL(url);
            setPreview(url);
            setIsLoading(false);
            previewLoaded = true;
            console.log('Direct URL success - setting preview without image test');
          } catch (directError) {
            console.error('Direct URL also failed:', directError);
            if (!previewLoaded) {
              setError(true);
              setIsLoading(false);
            }
          }
        }

      } catch (error) {
        console.error('Error in loadPreview:', error);
        setError(true);
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [file, forceReload]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [objectURL]);

  // Function to resize image for mobile preview
  const resizeImageForMobile = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions (max 1200px on longest side for better quality)
          const maxSize = 1200;
          let { width, height } = img;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          // Use higher quality for better results
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
              console.log(`Image resized: ${file.size} → ${resizedFile.size} bytes`);
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to create resized image'));
            }
          }, 'image/jpeg', 0.9); // Increased quality from 0.8 to 0.9
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Retry function
  const handleRetry = () => {
    console.log('Retrying preview load...');
    setRetryCount(prev => prev + 1);
    setError(false);
    setIsLoading(true);
    setPreview(null);
    // Clean up existing object URL
    if (objectURL) {
      URL.revokeObjectURL(objectURL);
      setObjectURL(null);
    }
    // Force reload by updating forceReload
    setForceReload(prev => prev + 1);
  };

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
            <p className="text-xs text-red-500 dark:text-red-500 mt-1">
              File will still be converted
            </p>
            {file.size > 5 * 1024 * 1024 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Large file ({Math.round(file.size / 1024 / 1024)}MB) - preview may be slow
              </p>
            )}
            {retryCount < 2 && (
              <button
                onClick={handleRetry}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                Retry preview
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {retryCount < 2 && (
            <button
              onClick={handleRetry}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              title="Retry preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
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

