import { ConversionSettings, ConversionResult, ImageMetadata } from '@/types';

/**
 * Edge Processor for handling unsupported formats and large files
 */
export class EdgeProcessor {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/convert') {
    this.baseUrl = baseUrl;
  }

  /**
   * Process image using edge API
   */
  async processImage(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    const startTime = performance.now();
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('settings', JSON.stringify(settings));

      // Send request to edge API
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get result blob
      const blob = await response.blob();
      
      // Extract metadata from response headers
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
      const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || '0');
      const compressionRatio = parseFloat(response.headers.get('X-Compression-Ratio') || '0');
      const processingTime = parseInt(response.headers.get('X-Processing-Time') || '0');
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = this.extractFilename(contentDisposition) || file.name;

      // Create metadata
      const metadata: ImageMetadata = {
        width: 0, // Would need to be extracted from the image
        height: 0, // Would need to be extracted from the image
        format: settings.format,
        size: compressedSize,
        hasAlpha: this.hasAlphaChannel(settings.format),
        hasExif: false, // Edge processing typically doesn't preserve EXIF
        colorSpace: 'sRGB',
      };

      const totalTime = performance.now() - startTime;

      return {
        blob,
        metadata,
        originalSize,
        compressedSize,
        compressionRatio,
        processingTime: totalTime,
      };
    } catch (error) {
      throw new Error(`Edge processing failed: ${error}`);
    }
  }

  /**
   * Check if edge processing is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get edge processing capabilities
   */
  async getCapabilities(): Promise<{
    supportedFormats: string[];
    maxFileSize: number;
    features: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/capabilities`, {
        method: 'GET',
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get edge capabilities:', error);
    }

    // Default capabilities
    return {
      supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif', 'tiff'],
      maxFileSize: 200 * 1024 * 1024, // 200MB
      features: ['heic-conversion', 'large-file-processing', 'batch-processing'],
    };
  }

  /**
   * Process multiple images in batch
   */
  async processBatch(
    files: File[],
    settings: ConversionSettings
  ): Promise<ConversionResult[]> {
    const promises = files.map(file => this.processImage(file, settings));
    return Promise.all(promises);
  }

  /**
   * Extract filename from Content-Disposition header
   */
  private extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    return filenameMatch ? filenameMatch[1] : null;
  }

  /**
   * Check if format supports alpha channel
   */
  private hasAlphaChannel(format: string): boolean {
    return ['png', 'webp', 'gif', 'svg'].includes(format);
  }

  /**
   * Determine if file should be processed on edge
   */
  shouldUseEdge(
    file: File,
    sourceFormat: string,
    targetFormat: string
  ): boolean {
    // Use edge for HEIC/HEIF files
    if (sourceFormat === 'heic' || sourceFormat === 'heif') {
      return true;
    }

    // Use edge for very large files (>80MB)
    if (file.size > 80 * 1024 * 1024) {
      return true;
    }

    // Use edge for unsupported format combinations
    const unsupportedCombinations = [
      ['heic', 'webp'],
      ['heif', 'avif'],
      ['tiff', 'webp'],
    ];

    for (const [source, target] of unsupportedCombinations) {
      if (sourceFormat === source && targetFormat === target) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get processing mode recommendation
   */
  getProcessingMode(
    file: File,
    sourceFormat: string,
    targetFormat: string,
    deviceMemory?: number
  ): 'local' | 'edge' {
    // Always use edge for HEIC/HEIF
    if (sourceFormat === 'heic' || sourceFormat === 'heif') {
      return 'edge';
    }

    // Use edge for very large files
    if (file.size > 80 * 1024 * 1024) {
      return 'edge';
    }

    // Use edge if device has limited memory
    if (deviceMemory && deviceMemory < 4) {
      return 'edge';
    }

    // Use edge for unsupported combinations
    if (this.shouldUseEdge(file, sourceFormat, targetFormat)) {
      return 'edge';
    }

    return 'local';
  }
}

// Singleton instance
export const edgeProcessor = new EdgeProcessor();

