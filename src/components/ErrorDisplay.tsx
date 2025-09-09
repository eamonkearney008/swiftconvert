'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  X, 
  RefreshCw, 
  Info,
  FileX,
  Zap
} from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  type?: 'conversion' | 'upload' | 'download' | 'general';
  className?: string;
}

export function ErrorDisplay({
  error,
  onDismiss,
  onRetry,
  type = 'general',
  className = ''
}: ErrorDisplayProps) {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (type) {
      case 'conversion':
        return <Zap className="h-4 w-4" />;
      case 'upload':
        return <FileX className="h-4 w-4" />;
      case 'download':
        return <FileX className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'conversion':
        return 'Conversion Error';
      case 'upload':
        return 'Upload Error';
      case 'download':
        return 'Download Error';
      default:
        return 'Error';
    }
  };

  const getErrorSuggestions = () => {
    switch (type) {
      case 'conversion':
        return [
          'Check if the image format is supported',
          'Try reducing the image size or quality',
          'Ensure the image file is not corrupted',
          'Try converting one image at a time'
        ];
      case 'upload':
        return [
          'Check your internet connection',
          'Try uploading smaller files',
          'Ensure the file format is supported',
          'Clear your browser cache and try again'
        ];
      case 'download':
        return [
          'Check your internet connection',
          'Try downloading individual files',
          'Clear your browser cache',
          'Check if you have enough disk space'
        ];
      default:
        return [
          'Try refreshing the page',
          'Check your internet connection',
          'Clear your browser cache',
          'Try again in a few moments'
        ];
    }
  };

  return (
    <Alert variant="destructive" className={className}>
      {getErrorIcon()}
      <AlertTitle className="flex items-center justify-between">
        {getErrorTitle()}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">Suggestions:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {getErrorSuggestions().map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>

        {onRetry && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

