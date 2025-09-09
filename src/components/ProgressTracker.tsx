'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  AlertCircle,
  Pause,
  Play,
  X
} from 'lucide-react';
import { BatchConversion, ConversionJob } from '@/types';
import { formatFileSize } from '@/lib/image-metadata';

interface ProgressTrackerProps {
  batch: BatchConversion;
  onCancel?: () => void;
  onDownload?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
}

export function ProgressTracker({
  batch,
  onCancel,
  onDownload,
  onPause,
  onResume,
  className = ''
}: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  // Calculate statistics
  const completedJobs = batch.jobs.filter(job => job.status === 'completed');
  const errorJobs = batch.jobs.filter(job => job.status === 'error');
  const processingJobs = batch.jobs.filter(job => job.status === 'processing');
  const pendingJobs = batch.jobs.filter(job => job.status === 'pending');

  const totalOriginalSize = batch.jobs.reduce((sum, job) => sum + job.file.size, 0);
  const totalConvertedSize = completedJobs.reduce((sum, job) => sum + (job.actualSize || 0), 0);
  const totalSavings = totalOriginalSize - totalConvertedSize;
  const compressionRatio = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0;

  // Estimate remaining time
  useEffect(() => {
    if (processingJobs.length > 0 && batch.progress > 0) {
      const startTime = Date.now() - (batch.progress / 100) * 60000; // Rough estimate
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = 100 - batch.progress;
      const estimatedRemaining = (elapsedTime / batch.progress) * remainingProgress;
      setEstimatedTime(estimatedRemaining);
    } else {
      setEstimatedTime(null);
    }
  }, [batch.progress, processingJobs.length]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.round(milliseconds / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    return `${hours}h`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(batch.status)}
              Batch Conversion
            </CardTitle>
            <CardDescription>
              {batch.completedFiles} of {batch.totalFiles} files completed
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {batch.status === 'processing' && (
              <>
                <Button variant="outline" size="sm" onClick={onPause}>
                  <Pause className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={onResume}>
                  <Play className="w-4 h-4" />
                </Button>
              </>
            )}
            {batch.status === 'completed' && onDownload && (
              <Button size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </Button>
            )}
            {batch.status !== 'completed' && onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(batch.progress)}%</span>
          </div>
          <Progress value={batch.progress} className="h-2" />
          {estimatedTime && (
            <p className="text-xs text-slate-500">
              Estimated time remaining: {formatTime(estimatedTime)}
            </p>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedJobs.length}
            </div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {errorJobs.length}
            </div>
            <div className="text-xs text-slate-500">Errors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {processingJobs.length}
            </div>
            <div className="text-xs text-slate-500">Processing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {pendingJobs.length}
            </div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>
        </div>

        {/* File Size Statistics */}
        {completedJobs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">File Size Reduction</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Original Size</div>
                <div className="font-medium">{formatFileSize(totalOriginalSize)}</div>
              </div>
              <div>
                <div className="text-slate-500">Converted Size</div>
                <div className="font-medium">{formatFileSize(totalConvertedSize)}</div>
              </div>
              <div>
                <div className="text-slate-500">Space Saved</div>
                <div className="font-medium text-green-600 dark:text-green-400">
                  {formatFileSize(totalSavings)}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Compression</div>
                <div className="font-medium text-green-600 dark:text-green-400">
                  {compressionRatio.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Summary */}
        {errorJobs.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <div className="font-medium">{errorJobs.length} files failed to convert</div>
              <div className="text-sm">
                {errorJobs.slice(0, 3).map(job => job.file.name).join(', ')}
                {errorJobs.length > 3 && ` and ${errorJobs.length - 3} more...`}
              </div>
            </div>
          </Alert>
        )}

        {/* Individual File Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Individual Files</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {batch.jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(job.status)}
                    <span className="text-sm truncate">{job.file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    {job.status === 'completed' && job.actualSize && (
                      <span className="text-xs text-slate-500">
                        {formatFileSize(job.actualSize)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

