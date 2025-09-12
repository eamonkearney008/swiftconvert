'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Calendar,
  FileImage,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { FileHistoryEntry, BatchHistoryEntry, fileManager } from '@/lib/file-manager';
import { formatFileSize } from '@/lib/image-metadata';

interface FileHistoryProps {
  className?: string;
}

export function FileHistory({ className = '' }: FileHistoryProps) {
  const [fileHistory, setFileHistory] = useState<FileHistoryEntry[]>([]);
  const [batchHistory, setBatchHistory] = useState<BatchHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'files' | 'batches'>('files');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const files = fileManager.getFileHistory(50); // Load last 50 entries
      const batches = fileManager.getBatchHistory(20); // Load last 20 batches
      setFileHistory(files);
      setBatchHistory(batches);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFileHistory = fileHistory.filter(entry => {
    // Search filter
    if (searchQuery && !entry.originalFile.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && entry.status !== statusFilter) {
      return false;
    }

    // Format filter
    if (formatFilter !== 'all' && entry.conversionSettings.format !== formatFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = Date.now();
      const entryDate = entry.timestamp;
      
      switch (dateFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (entryDate < today.getTime()) return false;
          break;
        case 'week':
          const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
          if (entryDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
          if (entryDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });

  const filteredBatchHistory = batchHistory.filter(entry => {
    // Search filter (search in batch ID)
    if (searchQuery && !entry.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && entry.status !== statusFilter) {
      return false;
    }

    // Format filter
    if (formatFilter !== 'all' && entry.settings.format !== formatFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = Date.now();
      const entryDate = entry.timestamp;
      
      switch (dateFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (entryDate < today.getTime()) return false;
          break;
        case 'week':
          const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
          if (entryDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
          if (entryDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });

  const handleDownloadResult = (entry: FileHistoryEntry) => {
    if (entry.status === 'completed' && entry.result.blob) {
      const url = URL.createObjectURL(entry.result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${entry.originalFile.name.split('.')[0]}.${entry.conversionSettings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleRemoveEntry = (id: string) => {
    if (activeTab === 'files') {
      fileManager.removeFileHistoryEntry(id);
      setFileHistory(prev => prev.filter(entry => entry.id !== id));
    } else {
      fileManager.removeBatchHistoryEntry(id);
      setBatchHistory(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleClearHistory = () => {
    if (activeTab === 'files') {
      fileManager.clearFileHistory();
      setFileHistory([]);
    } else {
      fileManager.clearBatchHistory();
      setBatchHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Conversion History
            </CardTitle>
            <CardDescription>
              View and manage your file conversion history
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={activeTab === 'files' ? fileHistory.length === 0 : batchHistory.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <Button
            variant={activeTab === 'files' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('files')}
            className="flex-1"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Files ({fileHistory.length})
          </Button>
          <Button
            variant={activeTab === 'batches' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('batches')}
            className="flex-1"
          >
            <HardDrive className="w-4 h-4 mr-2" />
            Batches ({batchHistory.length})
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activeTab === 'files' ? (
            filteredFileHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No file conversions found</p>
                <p className="text-sm">Start converting images to see your history</p>
              </div>
            ) : (
              filteredFileHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(entry.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.originalFile.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{formatDate(entry.timestamp)}</span>
                        <span>•</span>
                        <span>{formatFileSize(entry.originalFile.size)}</span>
                        <span>→</span>
                        <span>{formatFileSize(entry.result.compressedSize)}</span>
                        <span>•</span>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {entry.conversionSettings.format.toUpperCase()}
                      </Badge>
                      {entry.method && (
                        <>
                          <Badge variant="secondary" className="text-xs whitespace-nowrap">
                            {entry.method}
                          </Badge>
                          <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
                            {Math.min(Math.max(entry.result.compressionRatio, 0), 99.9).toFixed(1)}%
                          </span>
                        </>
                      )}
                      {entry.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadResult(entry)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {entry.status === 'completed' && (
                      <div className="text-right max-w-[100px] overflow-hidden flex-shrink-0 ml-2">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400 truncate">
                          {formatFileSize(entry.originalFile.size - entry.result.compressedSize)} saved
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 truncate">
                          {Math.min(entry.result.compressionRatio, 99.9).toFixed(1)}% reduction
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            filteredBatchHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No batch conversions found</p>
                <p className="text-sm">Start batch converting images to see your history</p>
              </div>
            ) : (
              filteredBatchHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(entry.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Batch {entry.id.slice(-8)}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
                        <span className="truncate">{formatDate(entry.timestamp)}</span>
                        <span>•</span>
                        <span className="truncate">{entry.completedFiles}/{entry.totalFiles} files</span>
                        <span>•</span>
                        <span className="truncate max-w-[50px]">{Math.round(entry.averageCompressionRatio)}% comp.</span>
                        <span>•</span>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.settings.format.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {entry.status === 'completed' && (
                      <div className="text-right max-w-[100px] overflow-hidden">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400 truncate">
                          {formatFileSize(entry.totalOriginalSize - entry.totalCompressedSize)} saved
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 truncate">
                          {Math.min(entry.averageCompressionRatio, 99.9).toFixed(1)}% reduction
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

