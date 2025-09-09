// Web Worker for image processing
// This file will be loaded as a Web Worker

import { ConversionSettings, ImageFormat, ConversionResult, ImageMetadata } from '@/types';

// Worker message types
interface WorkerMessage {
  type: 'convert' | 'ping';
  id: string;
  data?: any;
}

interface ConvertMessage extends WorkerMessage {
  type: 'convert';
  data: {
    file: ArrayBuffer;
    fileName: string;
    settings: ConversionSettings;
  };
}

interface WorkerResponse {
  type: 'result' | 'error' | 'progress' | 'pong';
  id: string;
  data?: any;
  error?: string;
  progress?: number;
}

// Image processing functions
class ImageProcessor {
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;

  constructor() {
    this.canvas = new OffscreenCanvas(1, 1);
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Convert image using Canvas API
   */
  async convertImage(
    fileBuffer: ArrayBuffer,
    fileName: string,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    const startTime = performance.now();
    
    try {
      // Create blob from buffer
      const blob = new Blob([fileBuffer]);
      const imageBitmap = await createImageBitmap(blob);
      
      // Set canvas dimensions
      const { width, height } = this.calculateDimensions(
        imageBitmap.width,
        imageBitmap.height,
        settings
      );
      
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, width, height);
      
      // Draw image
      this.ctx.drawImage(imageBitmap, 0, 0, width, height);
      
      // Convert to target format
      const mimeType = this.getMimeType(settings.format);
      const quality = settings.quality ? settings.quality / 100 : 0.9;
      
      const convertedBlob = await this.canvas.convertToBlob({
        type: mimeType,
        quality: settings.quality ? quality : undefined,
      });
      
      const processingTime = performance.now() - startTime;
      
      // Extract metadata
      const metadata: ImageMetadata = {
        width,
        height,
        format: settings.format,
        size: convertedBlob.size,
        hasAlpha: this.hasAlphaChannel(settings.format),
        hasExif: false, // Canvas API doesn't preserve EXIF
        colorSpace: 'sRGB',
      };
      
      return {
        blob: convertedBlob,
        metadata,
        originalSize: fileBuffer.byteLength,
        compressedSize: convertedBlob.size,
        compressionRatio: this.calculateCompressionRatio(
          fileBuffer.byteLength,
          convertedBlob.size
        ),
        processingTime,
      };
    } catch (error) {
      throw new Error(`Image conversion failed: ${error}`);
    }
  }

  /**
   * Calculate output dimensions based on settings
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    settings: ConversionSettings
  ): { width: number; height: number } {
    let { width, height } = settings;
    
    if (!width && !height) {
      return { width: originalWidth, height: originalHeight };
    }
    
    if (width && height) {
      return { width, height };
    }
    
    // Calculate aspect ratio
    const aspectRatio = originalWidth / originalHeight;
    
    if (width) {
      height = Math.round(width / aspectRatio);
    } else if (height) {
      width = Math.round(height * aspectRatio);
    }
    
    return { width: width!, height: height! };
  }

  /**
   * Get MIME type for format
   */
  private getMimeType(format: ImageFormat): string {
    const mimeTypes: Record<ImageFormat, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'avif': 'image/avif',
      'heic': 'image/heic',
      'heif': 'image/heif',
      'tiff': 'image/tiff',
      'bmp': 'image/bmp',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
    };
    
    return mimeTypes[format] || 'image/jpeg';
  }

  /**
   * Check if format supports alpha channel
   */
  private hasAlphaChannel(format: ImageFormat): boolean {
    return ['png', 'webp', 'gif', 'svg'].includes(format);
  }

  /**
   * Calculate compression ratio
   */
  private calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 0;
    return ((originalSize - compressedSize) / originalSize) * 100;
  }
}

// Worker instance
const processor = new ImageProcessor();

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, data } = event.data;
  
  try {
    switch (type) {
      case 'ping':
        self.postMessage({
          type: 'pong',
          id,
        } as WorkerResponse);
        break;
        
      case 'convert':
        const convertData = (data as ConvertMessage['data']);
        
        // Send progress update
        self.postMessage({
          type: 'progress',
          id,
          progress: 0,
        } as WorkerResponse);
        
        const result = await processor.convertImage(
          convertData.file,
          convertData.fileName,
          convertData.settings
        );
        
        // Send final result
        self.postMessage({
          type: 'result',
          id,
          data: result,
        } as WorkerResponse);
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse);
  }
};

// Export for TypeScript
export {};

