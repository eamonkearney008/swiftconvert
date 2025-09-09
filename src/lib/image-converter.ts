import { ConversionSettings, ConversionResult, ImageFormat, ImageMetadata } from '@/types';
import { wasmCodecLoader } from './codecs/wasm-loader';
// Dynamic import for WorkerManager to avoid SSR issues
import { extractImageMetadata } from './image-metadata';

/**
 * Local Image Converter using Canvas API and WASM codecs
 */
export class LocalImageConverter {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    // Only create canvas on the client side
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d')!;
    }
  }

  /**
   * Convert an image using the best available method
   */
  async convertImage(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      throw new Error('Image conversion is only available on the client side');
    }
    
    // Ensure canvas is available
    if (!this.canvas || !this.ctx) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d')!;
    }
    
    const startTime = performance.now();
    
    try {
      // Extract original metadata
      const originalMetadata = await extractImageMetadata(file);
      
      // Determine the best conversion method
      const method = await this.determineConversionMethod(file, settings);
      
      let result: ConversionResult;
      
      switch (method) {
        case 'wasm':
          result = await this.convertWithWasm(file, settings, originalMetadata);
          break;
        case 'worker':
          result = await this.convertWithWorker(file, settings, originalMetadata);
          break;
        case 'canvas':
        default:
          result = await this.convertWithCanvas(file, settings, originalMetadata);
          break;
      }
      
      const totalTime = performance.now() - startTime;
      result.processingTime = totalTime;
      
      return result;
    } catch (error) {
      throw new Error(`Image conversion failed: ${error}`);
    }
  }

  /**
   * Determine the best conversion method based on file and settings
   */
  private async determineConversionMethod(
    file: File,
    settings: ConversionSettings
  ): Promise<'wasm' | 'worker' | 'canvas'> {
    // Check if WASM codec is available and suitable
    const wasmCodec = await wasmCodecLoader.ensureCodecLoaded(
      this.getImageFormat(file.name),
      settings.format,
      file.size
    );
    
    if (wasmCodec) {
      return 'wasm';
    }
    
    // Check if worker is available
    const { getWorkerManager } = await import('./workers/worker-manager');
    const workerManager = getWorkerManager();
    if (workerManager.isAvailable()) {
      return 'worker';
    }
    
    // Fallback to canvas
    return 'canvas';
  }

  /**
   * Convert image using WASM codec
   */
  private async convertWithWasm(
    file: File,
    settings: ConversionSettings,
    originalMetadata: ImageMetadata
  ): Promise<ConversionResult> {
    const codecName = await wasmCodecLoader.ensureCodecLoaded(
      originalMetadata.format,
      settings.format,
      file.size
    );
    
    if (!codecName) {
      throw new Error('No suitable WASM codec available');
    }
    
    const codec = wasmCodecLoader.getCodec(codecName);
    if (!codec) {
      throw new Error(`WASM codec ${codecName} not loaded`);
    }
    
    // This would be implemented based on the specific WASM module
    // For now, fallback to canvas method
    return this.convertWithCanvas(file, settings, originalMetadata);
  }

  /**
   * Convert image using Web Worker
   */
  private async convertWithWorker(
    file: File,
    settings: ConversionSettings,
    originalMetadata: ImageMetadata
  ): Promise<ConversionResult> {
    const { getWorkerManager } = await import('./workers/worker-manager');
    const workerManager = getWorkerManager();
    return workerManager.processImage(file, settings);
  }

  /**
   * Convert image using Canvas API
   */
  private async convertWithCanvas(
    file: File,
    settings: ConversionSettings,
    originalMetadata: ImageMetadata
  ): Promise<ConversionResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          // Calculate output dimensions
          const { width, height } = this.calculateDimensions(
            img.naturalWidth,
            img.naturalHeight,
            settings
          );
          
          // Set canvas dimensions
          this.canvas.width = width;
          this.canvas.height = height;
          
          // Clear canvas
          this.ctx.clearRect(0, 0, width, height);
          
          // Apply image transformations if needed
          this.applyImageTransformations(img, originalMetadata);
          
          // Draw image
          this.ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to target format
          this.canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              
              if (!blob) {
                reject(new Error('Failed to convert image'));
                return;
              }
              
              const result: ConversionResult = {
                blob,
                metadata: {
                  width,
                  height,
                  format: settings.format,
                  size: blob.size,
                  hasAlpha: this.hasAlphaChannel(settings.format),
                  hasExif: false, // Canvas API doesn't preserve EXIF
                  colorSpace: 'sRGB',
                },
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: this.calculateCompressionRatio(file.size, blob.size),
                processingTime: 0, // Will be set by caller
              };
              
              resolve(result);
            },
            this.getMimeType(settings.format),
            settings.quality ? settings.quality / 100 : undefined
          );
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
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
   * Apply image transformations based on metadata
   */
  private applyImageTransformations(img: HTMLImageElement, metadata: ImageMetadata) {
    // Handle EXIF orientation
    if (metadata.orientation && metadata.orientation !== 1) {
      this.applyOrientation(metadata.orientation);
    }
  }

  /**
   * Apply EXIF orientation transformation
   */
  private applyOrientation(orientation: number) {
    const { width, height } = this.canvas;
    
    switch (orientation) {
      case 2:
        // Horizontal flip
        this.ctx.scale(-1, 1);
        this.ctx.translate(-width, 0);
        break;
      case 3:
        // 180° rotation
        this.ctx.translate(width, height);
        this.ctx.rotate(Math.PI);
        break;
      case 4:
        // Vertical flip
        this.ctx.scale(1, -1);
        this.ctx.translate(0, -height);
        break;
      case 5:
        // 90° counter-clockwise + horizontal flip
        this.ctx.translate(height, 0);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.scale(-1, 1);
        break;
      case 6:
        // 90° clockwise
        this.ctx.translate(height, 0);
        this.ctx.rotate(Math.PI / 2);
        break;
      case 7:
        // 90° clockwise + horizontal flip
        this.ctx.translate(0, width);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.scale(-1, 1);
        break;
      case 8:
        // 90° counter-clockwise
        this.ctx.translate(0, width);
        this.ctx.rotate(-Math.PI / 2);
        break;
    }
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

  /**
   * Get image format from filename
   */
  private getImageFormat(filename: string): ImageFormat {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const formatMap: Record<string, ImageFormat> = {
      'jpg': 'jpg',
      'jpeg': 'jpeg',
      'png': 'png',
      'webp': 'webp',
      'avif': 'avif',
      'heic': 'heic',
      'heif': 'heif',
      'tiff': 'tiff',
      'tif': 'tiff',
      'bmp': 'bmp',
      'gif': 'gif',
      'svg': 'svg',
    };
    
    return formatMap[extension || ''] || 'jpg';
  }

  /**
   * Check if conversion is supported
   */
  async isConversionSupported(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): Promise<boolean> {
    // Check WASM codec support
    const wasmCodec = await wasmCodecLoader.ensureCodecLoaded(
      sourceFormat,
      targetFormat,
      fileSize
    );
    
    if (wasmCodec) {
      return true;
    }
    
    // Check Canvas API support
    const canvasSupported = this.isCanvasFormatSupported(targetFormat);
    
    return canvasSupported;
  }

  /**
   * Check if Canvas API supports the format
   */
  private isCanvasFormatSupported(format: ImageFormat): boolean {
    const canvas = document.createElement('canvas');
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    
    return supportedFormats.includes(format);
  }

  /**
   * Get conversion capabilities
   */
  getCapabilities(): {
    supportedFormats: ImageFormat[];
    maxFileSize: number;
    hasWasmSupport: boolean;
    hasWorkerSupport: boolean;
  } {
    return {
      supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      maxFileSize: 200 * 1024 * 1024, // 200MB
      hasWasmSupport: wasmCodecLoader.checkBrowserSupport().hasWebAssembly,
      hasWorkerSupport: typeof Worker !== 'undefined',
    };
  }
}

// Singleton instance
export const localImageConverter = new LocalImageConverter();
