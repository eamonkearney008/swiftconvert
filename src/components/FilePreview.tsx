'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Eye, 
  FileImage, 
  AlertCircle,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { formatFileSize } from '@/lib/image-metadata';

interface FilePreviewProps {
  files: File[];
  onRemoveFile?: (index: number) => void;
  onDownloadFile?: (file: File, index: number) => void;
  className?: string;
}

export function FilePreview({
  files,
  onRemoveFile,
  onDownloadFile,
  className = ''
}: FilePreviewProps) {
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [loadingPreviews, setLoadingPreviews] = useState<Set<number>>(new Set());
  const [expandedPreview, setExpandedPreview] = useState<number | null>(null);

  // Generate preview URLs for images
  useEffect(() => {
    const newPreviewUrls = new Map<number, string>();
    const newLoadingPreviews = new Set<number>();

    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        newLoadingPreviews.add(index);
        const url = URL.createObjectURL(file);
        newPreviewUrls.set(index, url);
      }
    });

    setPreviewUrls(newPreviewUrls);
    setLoadingPreviews(newLoadingPreviews);

    // Clean up loading state after a short delay
    const timer = setTimeout(() => {
      setLoadingPreviews(new Set());
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up object URLs
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleRemoveFile = (index: number) => {
    if (onRemoveFile) {
      onRemoveFile(index);
    }
  };

  const handleDownloadFile = (file: File, index: number) => {
    if (onDownloadFile) {
      onDownloadFile(file, index);
    } else {
      // Default download behavior
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const toggleExpandedPreview = (index: number) => {
    setExpandedPreview(expandedPreview === index ? null : index);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileImage className="w-4 h-4" />;
  };

  const getFileTypeColor = (file: File) => {
    if (file.type.startsWith('image/')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Selected Files ({files.length})
        </CardTitle>
        <CardDescription>
          Preview and manage your selected image files
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => {
            const previewUrl = previewUrls.get(index);
            const isLoading = loadingPreviews.has(index);
            const isExpanded = expandedPreview === index;

            return (
              <div
                key={`${file.name}-${index}`}
                className="relative group border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"
              >
                {/* File Preview */}
                <div className="aspect-square bg-slate-50 dark:bg-slate-900 relative">
                  {previewUrl && file.type.startsWith('image/') ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className={`w-full h-full object-cover transition-all duration-200 ${
                          isExpanded ? 'cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        onClick={() => toggleExpandedPreview(index)}
                        onLoad={() => {
                          setLoadingPreviews(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(index);
                            return newSet;
                          });
                        }}
                      />
                      
                      {/* Loading overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      
                      {/* Expand icon */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleExpandedPreview(index)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      ) : (
                        <div className="text-center">
                          {getFileIcon(file)}
                          <p className="text-xs text-slate-500 mt-2">Preview not available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getFileTypeColor(file)}>
                          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadFile(file, index)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {onRemoveFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Preview Modal */}
        {expandedPreview !== null && previewUrls.has(expandedPreview) && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedPreview(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={previewUrls.get(expandedPreview)!}
                alt={files[expandedPreview].name}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setExpandedPreview(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
                <p className="text-sm font-medium">{files[expandedPreview].name}</p>
                <p className="text-xs opacity-75">
                  {formatFileSize(files[expandedPreview].size)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

