import { ConversionResult, ConversionSettings } from '@/types';

export interface FileHistoryEntry {
  id: string;
  timestamp: number;
  originalFile: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  conversionSettings: ConversionSettings;
  result: ConversionResult;
  batchId?: string;
  status: 'completed' | 'failed' | 'cancelled';
  error?: string;
}

export interface BatchHistoryEntry {
  id: string;
  timestamp: number;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageCompressionRatio: number;
  settings: ConversionSettings;
  duration: number; // in milliseconds
  status: 'completed' | 'failed' | 'cancelled';
}

export interface FileManagerStats {
  totalConversions: number;
  totalFilesProcessed: number;
  totalSpaceSaved: number;
  averageCompressionRatio: number;
  mostUsedFormat: string;
  mostUsedPreset: string;
  totalProcessingTime: number;
}

/**
 * File Manager for handling file history, sessions, and statistics
 */
export class FileManager {
  private static readonly STORAGE_KEY = 'snapconvert_file_history';
  private static readonly BATCH_STORAGE_KEY = 'snapconvert_batch_history';
  private static readonly STATS_STORAGE_KEY = 'snapconvert_stats';
  private static readonly MAX_HISTORY_ENTRIES = 1000;
  private static readonly MAX_BATCH_HISTORY_ENTRIES = 100;

  private fileHistory: FileHistoryEntry[] = [];
  private batchHistory: BatchHistoryEntry[] = [];
  private stats: FileManagerStats;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a file conversion to history
   */
  addFileConversion(
    originalFile: File,
    settings: ConversionSettings,
    result: ConversionResult,
    batchId?: string,
    status: 'completed' | 'failed' | 'cancelled' = 'completed',
    error?: string
  ): string {
    const entry: FileHistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      originalFile: {
        name: originalFile.name,
        size: originalFile.size,
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      },
      conversionSettings: settings,
      result,
      batchId,
      status,
      error,
    };

    this.fileHistory.unshift(entry);
    this.trimHistory();
    this.updateStats();
    this.saveToStorage();

    return entry.id;
  }

  /**
   * Add a batch conversion to history
   */
  addBatchConversion(
    batchId: string,
    totalFiles: number,
    completedFiles: number,
    failedFiles: number,
    totalOriginalSize: number,
    totalCompressedSize: number,
    settings: ConversionSettings,
    duration: number,
    status: 'completed' | 'failed' | 'cancelled' = 'completed'
  ): string {
    const averageCompressionRatio = totalOriginalSize > 0 
      ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 
      : 0;

    const entry: BatchHistoryEntry = {
      id: batchId,
      timestamp: Date.now(),
      totalFiles,
      completedFiles,
      failedFiles,
      totalOriginalSize,
      totalCompressedSize,
      averageCompressionRatio,
      settings,
      duration,
      status,
    };

    this.batchHistory.unshift(entry);
    this.trimBatchHistory();
    this.updateStats();
    this.saveToStorage();

    return entry.id;
  }

  /**
   * Get file conversion history
   */
  getFileHistory(limit?: number): FileHistoryEntry[] {
    return limit ? this.fileHistory.slice(0, limit) : this.fileHistory;
  }

  /**
   * Get batch conversion history
   */
  getBatchHistory(limit?: number): BatchHistoryEntry[] {
    return limit ? this.batchHistory.slice(0, limit) : this.batchHistory;
  }

  /**
   * Get file history by batch ID
   */
  getFileHistoryByBatch(batchId: string): FileHistoryEntry[] {
    return this.fileHistory.filter(entry => entry.batchId === batchId);
  }

  /**
   * Get file history by date range
   */
  getFileHistoryByDateRange(startDate: number, endDate: number): FileHistoryEntry[] {
    return this.fileHistory.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  }

  /**
   * Get file history by format
   */
  getFileHistoryByFormat(format: string): FileHistoryEntry[] {
    return this.fileHistory.filter(entry => 
      entry.conversionSettings.format === format
    );
  }

  /**
   * Get file history by status
   */
  getFileHistoryByStatus(status: 'completed' | 'failed' | 'cancelled'): FileHistoryEntry[] {
    return this.fileHistory.filter(entry => entry.status === status);
  }

  /**
   * Search file history
   */
  searchFileHistory(query: string): FileHistoryEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return this.fileHistory.filter(entry =>
      entry.originalFile.name.toLowerCase().includes(lowercaseQuery) ||
      entry.conversionSettings.format.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get statistics
   */
  getStats(): FileManagerStats {
    return { ...this.stats };
  }

  /**
   * Get recent activity (last 24 hours)
   */
  getRecentActivity(): {
    files: FileHistoryEntry[];
    batches: BatchHistoryEntry[];
    totalFiles: number;
    totalSpaceSaved: number;
  } {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentFiles = this.fileHistory.filter(entry => entry.timestamp >= last24Hours);
    const recentBatches = this.batchHistory.filter(entry => entry.timestamp >= last24Hours);
    
    const totalFiles = recentFiles.length;
    const totalSpaceSaved = recentFiles.reduce((sum, entry) => {
      if (entry.status === 'completed') {
        return sum + (entry.originalFile.size - entry.result.compressedSize);
      }
      return sum;
    }, 0);

    return {
      files: recentFiles,
      batches: recentBatches,
      totalFiles,
      totalSpaceSaved,
    };
  }

  /**
   * Clear file history
   */
  clearFileHistory(): void {
    this.fileHistory = [];
    this.updateStats();
    this.saveToStorage();
  }

  /**
   * Clear batch history
   */
  clearBatchHistory(): void {
    this.batchHistory = [];
    this.updateStats();
    this.saveToStorage();
  }

  /**
   * Clear all history
   */
  clearAllHistory(): void {
    this.fileHistory = [];
    this.batchHistory = [];
    this.updateStats();
    this.saveToStorage();
  }

  /**
   * Remove specific file history entry
   */
  removeFileHistoryEntry(id: string): boolean {
    const index = this.fileHistory.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.fileHistory.splice(index, 1);
      this.updateStats();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Remove specific batch history entry
   */
  removeBatchHistoryEntry(id: string): boolean {
    const index = this.batchHistory.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.batchHistory.splice(index, 1);
      this.updateStats();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Export history to JSON
   */
  exportHistory(): string {
    return JSON.stringify({
      fileHistory: this.fileHistory,
      batchHistory: this.batchHistory,
      stats: this.stats,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.fileHistory && Array.isArray(data.fileHistory)) {
        this.fileHistory = data.fileHistory;
      }
      
      if (data.batchHistory && Array.isArray(data.batchHistory)) {
        this.batchHistory = data.batchHistory;
      }
      
      if (data.stats) {
        this.stats = data.stats;
      }
      
      this.trimHistory();
      this.trimBatchHistory();
      this.saveToStorage();
      
      return true;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }

  /**
   * Get storage usage
   */
  getStorageUsage(): {
    fileHistorySize: number;
    batchHistorySize: number;
    totalSize: number;
    fileHistoryCount: number;
    batchHistoryCount: number;
  } {
    const fileHistoryJson = JSON.stringify(this.fileHistory);
    const batchHistoryJson = JSON.stringify(this.batchHistory);
    
    return {
      fileHistorySize: new Blob([fileHistoryJson]).size,
      batchHistorySize: new Blob([batchHistoryJson]).size,
      totalSize: new Blob([fileHistoryJson + batchHistoryJson]).size,
      fileHistoryCount: this.fileHistory.length,
      batchHistoryCount: this.batchHistory.length,
    };
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      // Load file history
      const fileHistoryData = localStorage.getItem(FileManager.STORAGE_KEY);
      if (fileHistoryData) {
        this.fileHistory = JSON.parse(fileHistoryData);
      }

      // Load batch history
      const batchHistoryData = localStorage.getItem(FileManager.BATCH_STORAGE_KEY);
      if (batchHistoryData) {
        this.batchHistory = JSON.parse(batchHistoryData);
      }

      // Load stats
      const statsData = localStorage.getItem(FileManager.STATS_STORAGE_KEY);
      if (statsData) {
        this.stats = JSON.parse(statsData);
      } else {
        this.stats = this.getDefaultStats();
      }
    } catch (error) {
      console.error('Failed to load file manager data:', error);
      this.fileHistory = [];
      this.batchHistory = [];
      this.stats = this.getDefaultStats();
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(FileManager.STORAGE_KEY, JSON.stringify(this.fileHistory));
      localStorage.setItem(FileManager.BATCH_STORAGE_KEY, JSON.stringify(this.batchHistory));
      localStorage.setItem(FileManager.STATS_STORAGE_KEY, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save file manager data:', error);
    }
  }

  /**
   * Trim file history to max entries
   */
  private trimHistory(): void {
    if (this.fileHistory.length > FileManager.MAX_HISTORY_ENTRIES) {
      this.fileHistory = this.fileHistory.slice(0, FileManager.MAX_HISTORY_ENTRIES);
    }
  }

  /**
   * Trim batch history to max entries
   */
  private trimBatchHistory(): void {
    if (this.batchHistory.length > FileManager.MAX_BATCH_HISTORY_ENTRIES) {
      this.batchHistory = this.batchHistory.slice(0, FileManager.MAX_BATCH_HISTORY_ENTRIES);
    }
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    const completedFiles = this.fileHistory.filter(entry => entry.status === 'completed');
    
    this.stats = {
      totalConversions: this.fileHistory.length,
      totalFilesProcessed: completedFiles.length,
      totalSpaceSaved: completedFiles.reduce((sum, entry) => 
        sum + (entry.originalFile.size - entry.result.compressedSize), 0),
      averageCompressionRatio: completedFiles.length > 0 
        ? (() => {
            const totalOriginal = completedFiles.reduce((sum, entry) => sum + entry.originalFile.size, 0);
            const totalCompressed = completedFiles.reduce((sum, entry) => sum + entry.result.compressedSize, 0);
            return totalOriginal > 0 ? ((totalOriginal - totalCompressed) / totalOriginal) * 100 : 0;
          })()
        : 0,
      mostUsedFormat: this.getMostUsedFormat(),
      mostUsedPreset: this.getMostUsedPreset(),
      totalProcessingTime: completedFiles.reduce((sum, entry) => 
        sum + (entry.result.processingTime || 0), 0),
    };
  }

  /**
   * Get most used format
   */
  private getMostUsedFormat(): string {
    const formatCounts: Record<string, number> = {};
    this.fileHistory.forEach(entry => {
      const format = entry.conversionSettings.format;
      formatCounts[format] = (formatCounts[format] || 0) + 1;
    });
    
    return Object.entries(formatCounts).reduce((a, b) => 
      formatCounts[a[0]] > formatCounts[b[0]] ? a : b, ['webp', 0])[0];
  }

  /**
   * Get most used preset
   */
  private getMostUsedPreset(): string {
    // This would need to be tracked in the conversion settings
    // For now, return a default
    return 'web-optimized';
  }

  /**
   * Get default stats
   */
  private getDefaultStats(): FileManagerStats {
    return {
      totalConversions: 0,
      totalFilesProcessed: 0,
      totalSpaceSaved: 0,
      averageCompressionRatio: 0,
      mostUsedFormat: 'webp',
      mostUsedPreset: 'web-optimized',
      totalProcessingTime: 0,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const fileManager = new FileManager();
