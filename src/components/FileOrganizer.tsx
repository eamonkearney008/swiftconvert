'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  SortAsc, 
  SortDesc, 
  Filter, 
  Search, 
  Grid, 
  List,
  ArrowUpDown,
  FileImage,
  HardDrive,
  Calendar,
  Type
} from 'lucide-react';
import { formatFileSize } from '@/lib/image-metadata';

export type SortField = 'name' | 'size' | 'type' | 'date';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

interface FileOrganizerProps {
  files: File[];
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function FileOrganizer({ 
  files, 
  onFilesChange, 
  className = '' 
}: FileOrganizerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get unique file types for filter
  const fileTypes = useMemo(() => {
    const types = new Set<string>();
    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) types.add(extension);
    });
    return Array.from(types).sort();
  }, [files]);

  // Filter and sort files
  const organizedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      // Search filter
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== typeFilter) return false;
      }

      // Size filter
      if (sizeFilter !== 'all') {
        const size = file.size;
        switch (sizeFilter) {
          case 'small':
            if (size >= 1024 * 1024) return false; // >= 1MB
            break;
          case 'medium':
            if (size < 1024 * 1024 || size >= 10 * 1024 * 1024) return false; // 1MB - 10MB
            break;
          case 'large':
            if (size < 10 * 1024 * 1024) return false; // >= 10MB
            break;
        }
      }

      return true;
    });

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          const aExt = a.name.split('.').pop()?.toLowerCase() || '';
          const bExt = b.name.split('.').pop()?.toLowerCase() || '';
          comparison = aExt.localeCompare(bExt);
          break;
        case 'date':
          comparison = a.lastModified - b.lastModified;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchQuery, sortField, sortOrder, typeFilter, sizeFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRemoveFile = (index: number) => {
    if (onFilesChange) {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
    }
  };

  const handleMoveFile = (fromIndex: number, toIndex: number) => {
    if (onFilesChange) {
      const newFiles = [...files];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      onFilesChange(newFiles);
    }
  };

  const getFileTypeIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'gif':
      case 'bmp':
        return <FileImage className="w-4 h-4" />;
      default:
        return <HardDrive className="w-4 h-4" />;
    }
  };

  const getFileTypeColor = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'png':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'webp':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'gif':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              File Organizer
            </CardTitle>
            <CardDescription>
              Organize and manage your selected files ({organizedFiles.length} of {files.length})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="File Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
              <SelectItem value="medium">Medium (1-10MB)</SelectItem>
              <SelectItem value="large">Large (&gt; 10MB)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('name')}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-2" />
              Name
              {sortField === 'name' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('size')}
              className="flex-1"
            >
              <HardDrive className="w-4 h-4 mr-2" />
              Size
              {sortField === 'size' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* File List */}
        {organizedFiles.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files match your filters</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-2'
          }>
            {organizedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg ${
                  viewMode === 'list' ? 'justify-between' : 'flex-col text-center'
                }`}
              >
                <div className={`flex items-center ${viewMode === 'list' ? 'gap-3 flex-1 min-w-0' : 'flex-col gap-2'}`}>
                  <div className="flex items-center gap-2">
                    {getFileTypeIcon(file)}
                    <span className={`text-sm font-medium ${viewMode === 'list' ? 'truncate' : ''}`}>
                      {file.name}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'text-xs text-slate-500' : 'text-xs text-slate-500 flex-col'}`}>
                    <Badge className={getFileTypeColor(file)}>
                      {file.name.split('.').pop()?.toUpperCase()}
                    </Badge>
                    <span>{formatFileSize(file.size)}</span>
                    {viewMode === 'list' && (
                      <>
                        <span>•</span>
                        <span>{formatDate(file.lastModified)}</span>
                      </>
                    )}
                  </div>
                </div>

                {viewMode === 'list' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {organizedFiles.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {organizedFiles.length} of {files.length} files
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total size: {formatFileSize(organizedFiles.reduce((sum, file) => sum + file.size, 0))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

