import { ConversionJob, BatchConversion, ConversionSettings, ConversionResult } from '@/types';

/**
 * Batch Processor for handling multiple image conversions
 */
export class BatchProcessor {
  private activeBatches: Map<string, BatchConversion> = new Map();
  private processingQueue: ConversionJob[] = [];
  private isProcessing = false;
  private maxConcurrentJobs = 3;

  /**
   * Create a new batch conversion
   */
  createBatch(files: File[], settings: ConversionSettings): BatchConversion {
    const batchId = this.generateBatchId();
    const jobs: ConversionJob[] = files.map((file, index) => ({
      id: `${batchId}_${index}`,
      file,
      settings,
      status: 'pending',
      progress: 0,
    }));

    const batch: BatchConversion = {
      id: batchId,
      jobs,
      status: 'pending',
      progress: 0,
      totalFiles: files.length,
      completedFiles: 0,
    };

    this.activeBatches.set(batchId, batch);
    this.addJobsToQueue(jobs);

    return batch;
  }

  /**
   * Get batch by ID
   */
  getBatch(batchId: string): BatchConversion | undefined {
    return this.activeBatches.get(batchId);
  }

  /**
   * Get all active batches
   */
  getAllBatches(): BatchConversion[] {
    return Array.from(this.activeBatches.values());
  }

  /**
   * Cancel a batch conversion
   */
  cancelBatch(batchId: string): boolean {
    const batch = this.activeBatches.get(batchId);
    if (!batch) return false;

    // Cancel all pending jobs in the batch
    batch.jobs.forEach(job => {
      if (job.status === 'pending' || job.status === 'processing') {
        job.status = 'error';
        job.error = 'Cancelled by user';
      }
    });

    batch.status = 'error';
    return true;
  }

  /**
   * Remove a completed batch
   */
  removeBatch(batchId: string): boolean {
    const batch = this.activeBatches.get(batchId);
    if (!batch) return false;

    if (batch.status === 'completed' || batch.status === 'error') {
      this.activeBatches.delete(batchId);
      return true;
    }

    return false;
  }

  /**
   * Add jobs to the processing queue
   */
  private addJobsToQueue(jobs: ConversionJob[]) {
    this.processingQueue.push(...jobs);
    this.processQueue();
  }

  /**
   * Process the conversion queue
   */
  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const activeJobs = this.processingQueue.splice(0, this.maxConcurrentJobs);
      const jobPromises = activeJobs.map(job => this.processJob(job));
      
      await Promise.allSettled(jobPromises);
    }

    this.isProcessing = false;
  }

  /**
   * Process a single conversion job
   */
  private async processJob(job: ConversionJob): Promise<void> {
    const batch = this.activeBatches.get(this.getBatchIdFromJobId(job.id));
    if (!batch) return;

    try {
      job.status = 'processing';
      job.progress = 0;

      // Update batch status
      if (batch.status === 'pending') {
        batch.status = 'processing';
      }

      // Process the image
      const { localImageConverter } = await import('./image-converter');
      const result = await localImageConverter.convertImage(job.file, job.settings);
      
      job.status = 'completed';
      job.progress = 100;
      job.result = result.blob;
      job.estimatedSize = result.compressedSize;
      job.actualSize = result.compressedSize;

      // Update batch progress
      batch.completedFiles++;
      batch.progress = (batch.completedFiles / batch.totalFiles) * 100;

      // Check if batch is complete
      if (batch.completedFiles === batch.totalFiles) {
        batch.status = 'completed';
        await this.generateBatchZip(batch);
      }

    } catch (error) {
      job.status = 'error';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      
      // Update batch status to error
      batch.status = 'error';
    }
  }

  /**
   * Generate ZIP file for completed batch
   */
  private async generateBatchZip(batch: BatchConversion): Promise<void> {
    try {
      // This would integrate with the ZIP generation system
      // For now, we'll just mark it as ready
      console.log(`Batch ${batch.id} completed with ${batch.completedFiles} files`);
    } catch (error) {
      console.error(`Failed to generate ZIP for batch ${batch.id}:`, error);
    }
  }

  /**
   * Get batch ID from job ID
   */
  private getBatchIdFromJobId(jobId: string): string {
    return jobId.split('_')[0];
  }

  /**
   * Generate unique batch ID
   */
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get processing statistics
   */
  getStatistics(): {
    totalBatches: number;
    activeBatches: number;
    completedBatches: number;
    errorBatches: number;
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    errorJobs: number;
  } {
    const batches = Array.from(this.activeBatches.values());
    const allJobs = batches.flatMap(batch => batch.jobs);

    return {
      totalBatches: batches.length,
      activeBatches: batches.filter(b => b.status === 'processing').length,
      completedBatches: batches.filter(b => b.status === 'completed').length,
      errorBatches: batches.filter(b => b.status === 'error').length,
      totalJobs: allJobs.length,
      pendingJobs: allJobs.filter(j => j.status === 'pending').length,
      processingJobs: allJobs.filter(j => j.status === 'processing').length,
      completedJobs: allJobs.filter(j => j.status === 'completed').length,
      errorJobs: allJobs.filter(j => j.status === 'error').length,
    };
  }

  /**
   * Clear completed batches
   */
  clearCompletedBatches(): number {
    let clearedCount = 0;
    
    for (const [batchId, batch] of this.activeBatches) {
      if (batch.status === 'completed' || batch.status === 'error') {
        this.activeBatches.delete(batchId);
        clearedCount++;
      }
    }
    
    return clearedCount;
  }

  /**
   * Set maximum concurrent jobs
   */
  setMaxConcurrentJobs(maxJobs: number): void {
    this.maxConcurrentJobs = Math.max(1, Math.min(maxJobs, 10));
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): {
    isProcessing: boolean;
    queueLength: number;
    maxConcurrentJobs: number;
  } {
    return {
      isProcessing: this.isProcessing,
      queueLength: this.processingQueue.length,
      maxConcurrentJobs: this.maxConcurrentJobs,
    };
  }

  /**
   * Pause processing
   */
  pauseProcessing(): void {
    this.isProcessing = false;
  }

  /**
   * Resume processing
   */
  resumeProcessing(): void {
    if (!this.isProcessing && this.processingQueue.length > 0) {
      this.processQueue();
    }
  }

  /**
   * Clear all batches and reset processor
   */
  reset(): void {
    this.activeBatches.clear();
    this.processingQueue = [];
    this.isProcessing = false;
  }
}

// Singleton instance
export const batchProcessor = new BatchProcessor();
