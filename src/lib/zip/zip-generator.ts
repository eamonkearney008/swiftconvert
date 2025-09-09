import JSZip from 'jszip';
import { ConversionJob, BatchConversion } from '@/types';

/**
 * ZIP Generator for batch downloads
 */
export class ZipGenerator {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  /**
   * Generate ZIP file from batch conversion results
   */
  async generateBatchZip(batch: BatchConversion): Promise<Blob> {
    this.zip = new JSZip(); // Reset ZIP instance
    
    // Add completed jobs to ZIP
    const completedJobs = batch.jobs.filter(job => 
      job.status === 'completed' && job.result
    );

    for (const job of completedJobs) {
      if (job.result) {
        const fileName = this.generateFileName(job);
        this.zip.file(fileName, job.result);
      }
    }

    // Add metadata file
    this.addMetadataFile(batch);

    // Generate ZIP blob
    const zipBlob = await this.zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6, // Balanced compression
      },
    });

    return zipBlob;
  }

  /**
   * Generate ZIP file from individual conversion results
   */
  async generateIndividualZip(
    results: Array<{ file: File; result: Blob; settings: any }>
  ): Promise<Blob> {
    this.zip = new JSZip(); // Reset ZIP instance

    for (const { file, result, settings } of results) {
      const fileName = this.generateFileNameFromSettings(file.name, settings);
      this.zip.file(fileName, result);
    }

    // Generate ZIP blob
    const zipBlob = await this.zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    });

    return zipBlob;
  }

  /**
   * Generate filename for converted image
   */
  private generateFileName(job: ConversionJob): string {
    const originalName = job.file.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = this.getFileExtension(job.settings.format);
    
    return `${nameWithoutExt}.${extension}`;
  }

  /**
   * Generate filename from settings
   */
  private generateFileNameFromSettings(originalName: string, settings: any): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = this.getFileExtension(settings.format);
    
    return `${nameWithoutExt}.${extension}`;
  }

  /**
   * Get file extension for format
   */
  private getFileExtension(format: string): string {
    const extensions: Record<string, string> = {
      'jpg': 'jpg',
      'jpeg': 'jpg',
      'png': 'png',
      'webp': 'webp',
      'avif': 'avif',
      'heic': 'heic',
      'heif': 'heif',
      'tiff': 'tiff',
      'bmp': 'bmp',
      'gif': 'gif',
      'svg': 'svg',
    };
    
    return extensions[format] || 'jpg';
  }

  /**
   * Add metadata file to ZIP
   */
  private addMetadataFile(batch: BatchConversion): void {
    const metadata = {
      batchId: batch.id,
      totalFiles: batch.totalFiles,
      completedFiles: batch.completedFiles,
      createdAt: new Date().toISOString(),
      settings: batch.jobs[0]?.settings, // Assuming all jobs have same settings
      results: batch.jobs.map(job => ({
        originalName: job.file.name,
        convertedName: this.generateFileName(job),
        status: job.status,
        originalSize: job.file.size,
        convertedSize: job.actualSize,
        compressionRatio: job.actualSize ? 
          ((job.file.size - job.actualSize) / job.file.size) * 100 : 0,
        error: job.error,
      })),
    };

    this.zip.file('conversion-metadata.json', JSON.stringify(metadata, null, 2));
  }

  /**
   * Download ZIP file
   */
  downloadZip(zipBlob: Blob, filename: string = 'converted-images.zip'): void {
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Get ZIP file size estimate
   */
  async getZipSizeEstimate(batch: BatchConversion): Promise<number> {
    let totalSize = 0;
    
    const completedJobs = batch.jobs.filter(job => 
      job.status === 'completed' && job.result
    );

    for (const job of completedJobs) {
      if (job.result) {
        totalSize += job.result.size;
      }
    }

    // Add metadata file size estimate
    totalSize += 1024; // ~1KB for metadata

    // ZIP compression ratio is typically 60-80% of original size
    return Math.round(totalSize * 0.7);
  }

  /**
   * Create ZIP with progress callback
   */
  async generateZipWithProgress(
    batch: BatchConversion,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    this.zip = new JSZip();
    
    const completedJobs = batch.jobs.filter(job => 
      job.status === 'completed' && job.result
    );

    let processedFiles = 0;
    const totalFiles = completedJobs.length + 1; // +1 for metadata file

    // Add files to ZIP
    for (const job of completedJobs) {
      if (job.result) {
        const fileName = this.generateFileName(job);
        this.zip.file(fileName, job.result);
        processedFiles++;
        
        if (onProgress) {
          onProgress((processedFiles / totalFiles) * 50); // First 50% for adding files
        }
      }
    }

    // Add metadata
    this.addMetadataFile(batch);
    processedFiles++;
    
    if (onProgress) {
      onProgress(50); // 50% complete after adding all files
    }

    // Generate ZIP with progress
    const zipBlob = await this.zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    }, (metadata) => {
      if (onProgress) {
        // Second 50% for compression
        onProgress(50 + (metadata.percent / 2));
      }
    });

    return zipBlob;
  }

  /**
   * Validate ZIP contents
   */
  async validateZip(zipBlob: Blob): Promise<{
    isValid: boolean;
    fileCount: number;
    totalSize: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let fileCount = 0;
    let totalSize = 0;

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(zipBlob);
      
      fileCount = Object.keys(zipData.files).length;
      
      for (const [filename, file] of Object.entries(zipData.files)) {
        if (!file.dir) {
          totalSize += file._data?.uncompressedSize || 0;
        }
      }
      
      return {
        isValid: true,
        fileCount,
        totalSize,
        errors,
      };
    } catch (error) {
      errors.push(`Invalid ZIP file: ${error}`);
      return {
        isValid: false,
        fileCount: 0,
        totalSize: 0,
        errors,
      };
    }
  }
}

// Singleton instance
export const zipGenerator = new ZipGenerator();

