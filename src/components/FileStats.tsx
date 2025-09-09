'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  HardDrive, 
  Zap, 
  Clock, 
  FileImage,
  Download,
  RefreshCw,
  Award,
  Target
} from 'lucide-react';
import { FileManagerStats, fileManager } from '@/lib/file-manager';
import { formatFileSize } from '@/lib/image-metadata';

interface FileStatsProps {
  className?: string;
}

export function FileStats({ className = '' }: FileStatsProps) {
  const [stats, setStats] = useState<FileManagerStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setIsLoading(true);
    try {
      const currentStats = fileManager.getStats();
      const activity = fileManager.getRecentActivity();
      setStats(currentStats);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
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

  const getEfficiencyLevel = (compressionRatio: number) => {
    if (compressionRatio >= 80) return { level: 'Excellent', color: 'text-green-600 dark:text-green-400', icon: Award };
    if (compressionRatio >= 60) return { level: 'Good', color: 'text-blue-600 dark:text-blue-400', icon: TrendingUp };
    if (compressionRatio >= 40) return { level: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', icon: Target };
    return { level: 'Poor', color: 'text-red-600 dark:text-red-400', icon: Target };
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-slate-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No statistics available</p>
            <p className="text-sm">Start converting images to see your stats</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const efficiency = getEfficiencyLevel(stats.averageCompressionRatio);
  const EfficiencyIcon = efficiency.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Conversion Statistics
              </CardTitle>
              <CardDescription>
                Your image conversion performance and efficiency metrics
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Conversions
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalConversions}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <FileImage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Processed */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Files Processed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalFilesProcessed}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Space Saved */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Space Saved
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatFileSize(stats.totalSpaceSaved)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Compression */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg Compression
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.averageCompressionRatio.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Processing Time</span>
              <span className="font-medium">{formatTime(stats.totalProcessingTime)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Most Used Format</span>
              <Badge variant="outline">{stats.mostUsedFormat.toUpperCase()}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Most Used Preset</span>
              <Badge variant="outline">{stats.mostUsedPreset}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Efficiency Level</span>
              <div className="flex items-center gap-2">
                <EfficiencyIcon className={`w-4 h-4 ${efficiency.color}`} />
                <span className={`font-medium ${efficiency.color}`}>{efficiency.level}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Files Converted</span>
                  <span className="font-medium">{recentActivity.totalFiles}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Space Saved</span>
                  <span className="font-medium">{formatFileSize(recentActivity.totalSpaceSaved)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Batches Processed</span>
                  <span className="font-medium">{recentActivity.batches.length}</span>
                </div>
                
                {recentActivity.totalFiles === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity in the last 24 hours</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Efficiency Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {stats.totalFilesProcessed > 0 ? Math.round(stats.totalSpaceSaved / stats.totalFilesProcessed / 1024) : 0}KB
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average Space Saved per File
              </div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {stats.totalFilesProcessed > 0 ? Math.round(stats.totalProcessingTime / stats.totalFilesProcessed / 1000) : 0}s
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average Processing Time per File
              </div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {stats.totalConversions > 0 ? Math.round((stats.totalFilesProcessed / stats.totalConversions) * 100) : 0}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Success Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

