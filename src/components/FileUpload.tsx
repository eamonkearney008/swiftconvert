'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Upload, X, FileImage, Clipboard } from 'lucide-react';
import { ImageFormat } from '@/types';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: ImageFormat[];
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  className?: string;
}

const SUPPORTED_FORMATS: ImageFormat[] = [
  'jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif', 'tiff', 'bmp', 'gif', 'svg'
];

const FORMAT_EXTENSIONS = {
  'jpg': ['.jpg', '.jpeg'],
  'jpeg': ['.jpg', '.jpeg'],
  'png': ['.png'],
  'webp': ['.webp'],
  'avif': ['.avif'],
  'heic': ['.heic'],
  'heif': ['.heif'],
  'tiff': ['.tiff', '.tif'],
  'bmp': ['.bmp'],
  'gif': ['.gif'],
  'svg': ['.svg'],
};

export function FileUpload({
  onFilesSelected,
  acceptedFormats = SUPPORTED_FORMATS,
  maxFiles = 50,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedExtensions = useCallback(() => {
    return acceptedFormats.flatMap(format => FORMAT_EXTENSIONS[format] || []);
  }, [acceptedFormats]);

  const validateFile = useCallback((file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = getAcceptedExtensions();
    
    if (!acceptedExtensions.includes(extension)) {
      return `File type ${extension} is not supported`;
    }
    
    if (file.size > maxFileSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`;
    }
    
    return null;
  }, [getAcceptedExtensions, maxFileSize]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check total file count
    if (selectedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You're trying to add ${fileArray.length} files but already have ${selectedFiles.length}.`);
      return;
    }

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
      setError(null);
    }
  }, [selectedFiles, maxFiles, validateFile, onFilesSelected]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    onFilesSelected([]);
    setError(null);
  }, [onFilesSelected]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileFormat = (filename: string): ImageFormat => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension as ImageFormat || 'jpg';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card
        className={`relative border-2 border-dashed transition-colors cursor-pointer ${
          dragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                Drop your images here
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                or click to browse • Supports {acceptedFormats.join(', ').toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button type="button" className="px-6 py-3">
                <FileImage className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <Button type="button" variant="outline" className="px-6 py-3">
                <Clipboard className="w-4 h-4 mr-2" />
                Paste from Clipboard
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={getAcceptedExtensions().join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Selected Files ({selectedFiles.length})
            </h3>
            <Button variant="outline" size="sm" onClick={clearAllFiles}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileImage className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {getFileFormat(file.name).toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

