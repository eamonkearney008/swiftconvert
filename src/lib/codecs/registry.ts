import { CodecCapabilities, ImageFormat } from '@/types';

// Codec registry for managing WASM codecs and their capabilities
export class CodecRegistry {
  private codecs: Map<string, CodecCapabilities> = new Map();
  private loadedCodecs: Set<string> = new Set();

  constructor() {
    this.initializeDefaultCodecs();
  }

  private initializeDefaultCodecs() {
    // Browser-native codecs (always available)
    this.registerCodec('canvas', {
      canDecode: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
      canEncode: ['jpg', 'jpeg', 'png', 'webp'],
      supportsSIMD: false,
      supportsThreads: false,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    // WASM codecs (loaded on demand)
    this.registerCodec('mozjpeg', {
      canDecode: ['jpg', 'jpeg'],
      canEncode: ['jpg', 'jpeg'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    this.registerCodec('libwebp', {
      canDecode: ['webp'],
      canEncode: ['webp'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024,
    });

    this.registerCodec('libaom-av1', {
      canDecode: ['avif'],
      canEncode: ['avif'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 200 * 1024 * 1024, // 200MB
    });

    this.registerCodec('oxipng', {
      canDecode: ['png'],
      canEncode: ['png'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024,
    });
  }

  registerCodec(name: string, capabilities: CodecCapabilities) {
    this.codecs.set(name, capabilities);
  }

  async loadCodec(name: string): Promise<boolean> {
    if (this.loadedCodecs.has(name)) {
      return true;
    }

    try {
      // Load WASM module
      const wasmPath = `/wasm/${name}.wasm`;
      const wasmModule = await WebAssembly.instantiateStreaming(
        fetch(wasmPath)
      );
      
      // Initialize codec
      // This would be implemented based on the specific WASM module
      this.loadedCodecs.add(name);
      return true;
    } catch (error) {
      console.error(`Failed to load codec ${name}:`, error);
      return false;
    }
  }

  getCodecCapabilities(name: string): CodecCapabilities | undefined {
    return this.codecs.get(name);
  }

  findBestCodec(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): string | null {
    const candidates: Array<{ name: string; score: number }> = [];

    for (const [name, capabilities] of this.codecs) {
      if (
        capabilities.canDecode.includes(sourceFormat) &&
        capabilities.canEncode.includes(targetFormat) &&
        capabilities.maxFileSize >= fileSize
      ) {
        let score = 0;
        
        // Prefer loaded codecs
        if (this.loadedCodecs.has(name)) score += 100;
        
        // Prefer codecs with SIMD support
        if (capabilities.supportsSIMD) score += 50;
        
        // Prefer codecs with thread support
        if (capabilities.supportsThreads) score += 25;
        
        // Prefer codecs with higher file size limits
        score += Math.min(capabilities.maxFileSize / (1024 * 1024), 10);
        
        candidates.push({ name, score });
      }
    }

    if (candidates.length === 0) return null;

    // Return the codec with the highest score
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].name;
  }

  async ensureCodecLoaded(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): Promise<string | null> {
    const codecName = this.findBestCodec(sourceFormat, targetFormat, fileSize);
    
    if (!codecName) return null;
    
    if (!this.loadedCodecs.has(codecName)) {
      const loaded = await this.loadCodec(codecName);
      if (!loaded) return null;
    }
    
    return codecName;
  }

  // Check if browser supports required features
  checkBrowserSupport(): {
    hasSharedArrayBuffer: boolean;
    hasWebCodecs: boolean;
    hasOffscreenCanvas: boolean;
    hasWebWorkers: boolean;
  } {
    return {
      hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      hasWebCodecs: 'VideoDecoder' in window,
      hasOffscreenCanvas: typeof OffscreenCanvas !== 'undefined',
      hasWebWorkers: typeof Worker !== 'undefined',
    };
  }

  // Get processing mode recommendation
  getProcessingMode(
    fileSize: number,
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    deviceMemory?: number
  ): 'local' | 'edge' {
    // Always use edge for unsupported formats
    if (sourceFormat === 'heic' || sourceFormat === 'heif') {
      return 'edge';
    }

    // Use edge for very large files
    if (fileSize > 80 * 1024 * 1024) { // 80MB
      return 'edge';
    }

    // Use edge if device has limited memory
    if (deviceMemory && deviceMemory < 4) {
      return 'edge';
    }

    // Check if we have a suitable local codec
    const codec = this.findBestCodec(sourceFormat, targetFormat, fileSize);
    if (!codec) {
      return 'edge';
    }

    return 'local';
  }
}

// Singleton instance
export const codecRegistry = new CodecRegistry();
