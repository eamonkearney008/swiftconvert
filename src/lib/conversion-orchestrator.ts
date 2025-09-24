import { ConversionSettings, ConversionResult, ImageFormat } from '@/types';
import { localImageConverter } from './image-converter';
import { edgeProcessor } from './edge-processor';
import { codecRegistry } from './codecs/registry';
import { memoryManager } from './memory-manager';

/**
 * Main conversion orchestrator that decides between local and edge processing
 */
export class ConversionOrchestrator {
  private static instance: ConversionOrchestrator;

  private constructor() {}

  static getInstance(): ConversionOrchestrator {
    if (!ConversionOrchestrator.instance) {
      ConversionOrchestrator.instance = new ConversionOrchestrator();
    }
    return ConversionOrchestrator.instance;
  }

  /**
   * Convert an image using the best available method (local or edge)
   */
  async convertImage(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    const sourceFormat = this.getImageFormat(file.name);
    const targetFormat = settings.format;
    const deviceMemory = this.getDeviceMemory();

    // Determine processing mode
    const processingMode = this.determineProcessingMode(
      file,
      sourceFormat,
      targetFormat,
      deviceMemory
    );

    console.log(`Using ${processingMode.mode} processing for ${file.name}`, processingMode.reason);

    try {
      if (processingMode.mode === 'edge') {
        return await this.convertWithEdge(file, settings);
      } else {
        return await this.convertWithLocal(file, settings);
      }
    } catch (error) {
      // If local processing fails and we haven't tried edge yet, fallback to edge
      if (processingMode.mode === 'local') {
        console.warn('Local processing failed, attempting edge processing:', error);
        try {
          return await this.convertWithEdge(file, settings);
        } catch (edgeError) {
          throw new Error(`Both local and edge processing failed. Local: ${error}. Edge: ${edgeError}`);
        }
      }
      throw error;
    }
  }

  /**
   * Determine the best processing mode
   */
  private determineProcessingMode(
    file: File,
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    deviceMemory?: number
  ): { mode: 'local' | 'edge'; reason: string } {
    // Check if edge processing is available
    const edgeAvailable = this.isEdgeProcessingAvailable();
    
    // Use edge processor logic first
    const edgeMode = edgeProcessor.getProcessingMode(
      file,
      sourceFormat,
      targetFormat,
      deviceMemory
    );

    if (edgeMode === 'edge' && edgeAvailable) {
      return {
        mode: 'edge',
        reason: this.getEdgeProcessingReason(file, sourceFormat, targetFormat, deviceMemory)
      };
    }

    // Check codec registry for local processing
    const localMode = codecRegistry.getProcessingMode(
      file.size,
      sourceFormat,
      targetFormat,
      deviceMemory
    );

    if (localMode === 'edge' && edgeAvailable) {
      return {
        mode: 'edge',
        reason: 'No suitable local codec available'
      };
    }

    return {
      mode: 'local',
      reason: 'Local processing preferred'
    };
  }

  /**
   * Get reason for edge processing
   */
  private getEdgeProcessingReason(
    file: File,
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    deviceMemory?: number
  ): string {
    if (sourceFormat === 'heic' || sourceFormat === 'heif') {
      return 'HEIC/HEIF format requires edge processing';
    }
    
    if (file.size > 80 * 1024 * 1024) {
      return 'Large file (>80MB) requires edge processing';
    }
    
    if (deviceMemory && deviceMemory < 4) {
      return 'Limited device memory requires edge processing';
    }
    
    return 'Unsupported format combination requires edge processing';
  }

  /**
   * Convert image using local processing
   */
  private async convertWithLocal(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    return localImageConverter.convertImage(file, settings);
  }

  /**
   * Convert image using edge processing
   */
  private async convertWithEdge(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    return edgeProcessor.processImage(file, settings);
  }

  /**
   * Check if edge processing is available
   */
  private async isEdgeProcessingAvailable(): Promise<boolean> {
    try {
      return await edgeProcessor.isAvailable();
    } catch {
      return false;
    }
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
   * Get device memory information
   */
  private getDeviceMemory(): number | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // @ts-ignore - deviceMemory is not in all browsers
    return navigator.deviceMemory;
  }

  /**
   * Get processing capabilities
   */
  async getCapabilities(): Promise<{
    local: {
      supportedFormats: ImageFormat[];
      maxFileSize: number;
      hasWasmSupport: boolean;
      hasWorkerSupport: boolean;
    };
    edge: {
      supportedFormats: string[];
      maxFileSize: number;
      features: string[];
      available: boolean;
    };
  }> {
    const localCapabilities = localImageConverter.getCapabilities();
    const edgeCapabilities = await edgeProcessor.getCapabilities();
    const edgeAvailable = await this.isEdgeProcessingAvailable();

    return {
      local: localCapabilities,
      edge: {
        ...edgeCapabilities,
        available: edgeAvailable
      }
    };
  }

  /**
   * Check if a conversion is supported
   */
  async isConversionSupported(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): Promise<boolean> {
    // Check local support first
    const localSupported = await localImageConverter.isConversionSupported(
      sourceFormat,
      targetFormat,
      fileSize
    );

    if (localSupported) {
      return true;
    }

    // Check edge support
    const edgeAvailable = await this.isEdgeProcessingAvailable();
    if (!edgeAvailable) {
      return false;
    }

    // Check if edge supports this combination
    const edgeCapabilities = await edgeProcessor.getCapabilities();
    return edgeCapabilities.supportedFormats.includes(targetFormat);
  }
}

// Export singleton instance
export const conversionOrchestrator = ConversionOrchestrator.getInstance();
