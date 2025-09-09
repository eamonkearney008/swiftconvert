import { CodecCapabilities, ImageFormat } from '@/types';

// WASM module interface
interface WasmModule {
  memory: WebAssembly.Memory;
  exports: {
    [key: string]: any;
  };
}

// Codec instance interface
interface CodecInstance {
  name: string;
  module: WasmModule;
  capabilities: CodecCapabilities;
  isLoaded: boolean;
}

/**
 * WASM Codec Loader for managing and loading WASM-based image codecs
 */
export class WasmCodecLoader {
  private codecs: Map<string, CodecInstance> = new Map();
  private loadingPromises: Map<string, Promise<boolean>> = new Map();

  constructor() {
    this.initializeCodecRegistry();
  }

  /**
   * Initialize the codec registry with available WASM codecs
   */
  private initializeCodecRegistry() {
    // MozJPEG codec for JPEG encoding/decoding
    this.registerCodec('mozjpeg', {
      canDecode: ['jpg', 'jpeg'],
      canEncode: ['jpg', 'jpeg'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    // libwebp codec for WebP encoding/decoding
    this.registerCodec('libwebp', {
      canDecode: ['webp'],
      canEncode: ['webp'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024,
    });

    // libaom-av1 codec for AVIF encoding/decoding
    this.registerCodec('libaom-av1', {
      canDecode: ['avif'],
      canEncode: ['avif'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 200 * 1024 * 1024, // 200MB
    });

    // oxipng codec for PNG optimization
    this.registerCodec('oxipng', {
      canDecode: ['png'],
      canEncode: ['png'],
      supportsSIMD: true,
      supportsThreads: true,
      maxFileSize: 100 * 1024 * 1024,
    });
  }

  /**
   * Register a codec with its capabilities
   */
  registerCodec(name: string, capabilities: CodecCapabilities) {
    this.codecs.set(name, {
      name,
      module: null as any,
      capabilities,
      isLoaded: false,
    });
  }

  /**
   * Load a WASM codec module
   */
  async loadCodec(name: string): Promise<boolean> {
    const codec = this.codecs.get(name);
    if (!codec) {
      console.error(`Codec ${name} not found in registry`);
      return false;
    }

    if (codec.isLoaded) {
      return true;
    }

    // Check if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    const loadPromise = this.loadWasmModule(name);
    this.loadingPromises.set(name, loadPromise);

    try {
      const success = await loadPromise;
      if (success) {
        codec.isLoaded = true;
      }
      return success;
    } finally {
      this.loadingPromises.delete(name);
    }
  }

  /**
   * Load WASM module from file
   */
  private async loadWasmModule(name: string): Promise<boolean> {
    try {
      const wasmPath = `/wasm/${name}.wasm`;
      console.log(`Loading WASM codec: ${wasmPath}`);

      // Check if WASM file exists
      const response = await fetch(wasmPath, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`WASM file not found: ${wasmPath}`);
        return false;
      }

      // Load WASM module
      const wasmBytes = await fetch(wasmPath).then(res => res.arrayBuffer());
      
      // Check for SharedArrayBuffer support for threading
      const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
      const hasWebAssemblyThreads = typeof WebAssembly.instantiateStreaming !== 'undefined';

      let wasmModule: WebAssembly.Module;
      let wasmInstance: WebAssembly.Instance;

      if (hasSharedArrayBuffer && hasWebAssemblyThreads) {
        // Use streaming instantiation with threading support
        const result = await WebAssembly.instantiateStreaming(
          fetch(wasmPath),
          this.createWasmImports(name)
        );
        wasmModule = result.module;
        wasmInstance = result.instance;
      } else {
        // Fallback to regular instantiation
        wasmModule = await WebAssembly.compile(wasmBytes);
        wasmInstance = await WebAssembly.instantiate(
          wasmModule,
          this.createWasmImports(name)
        );
      }

      // Store the module in the codec registry
      const codec = this.codecs.get(name);
      if (codec) {
        codec.module = {
          memory: wasmInstance.exports.memory as WebAssembly.Memory,
          exports: wasmInstance.exports,
        };
      }

      console.log(`Successfully loaded WASM codec: ${name}`);
      return true;
    } catch (error) {
      console.error(`Failed to load WASM codec ${name}:`, error);
      return false;
    }
  }

  /**
   * Create WASM imports for the codec
   */
  private createWasmImports(name: string): WebAssembly.Imports {
    const imports: WebAssembly.Imports = {
      env: {
        // Memory management
        memory: new WebAssembly.Memory({ initial: 16, maximum: 256 }),
        
        // Console logging
        console_log: (ptr: number, len: number) => {
          const memory = new Uint8Array(this.getMemory().buffer, ptr, len);
          const message = new TextDecoder().decode(memory);
          console.log(`[${name}] ${message}`);
        },
        
        // Math functions
        Math_abs: Math.abs,
        Math_floor: Math.floor,
        Math_ceil: Math.ceil,
        Math_round: Math.round,
        Math_sqrt: Math.sqrt,
        Math_pow: Math.pow,
        Math_sin: Math.sin,
        Math_cos: Math.cos,
        Math_tan: Math.tan,
        Math_atan2: Math.atan2,
        Math_log: Math.log,
        Math_exp: Math.exp,
        Math_max: Math.max,
        Math_min: Math.min,
      },
    };

    // Add threading support if available
    if (typeof SharedArrayBuffer !== 'undefined') {
      imports.env = {
        ...imports.env,
        // Threading primitives
        atomic_wait: (ptr: number, expected: number, timeout: number) => {
          return Atomics.wait(new Int32Array(this.getMemory().buffer, ptr), 0, expected, timeout);
        },
        atomic_notify: (ptr: number, count: number) => {
          return Atomics.notify(new Int32Array(this.getMemory().buffer, ptr), 0, count);
        },
      };
    }

    return imports;
  }

  /**
   * Get the shared memory instance
   */
  private getMemory(): WebAssembly.Memory {
    // Return the first available memory instance
    for (const codec of this.codecs.values()) {
      if (codec.module?.memory) {
        return codec.module.memory;
      }
    }
    
    // Fallback to a default memory instance
    return new WebAssembly.Memory({ initial: 16, maximum: 256 });
  }

  /**
   * Get a loaded codec instance
   */
  getCodec(name: string): CodecInstance | null {
    const codec = this.codecs.get(name);
    return codec?.isLoaded ? codec : null;
  }

  /**
   * Check if a codec is loaded
   */
  isCodecLoaded(name: string): boolean {
    const codec = this.codecs.get(name);
    return codec?.isLoaded || false;
  }

  /**
   * Get all available codecs
   */
  getAvailableCodecs(): string[] {
    return Array.from(this.codecs.keys());
  }

  /**
   * Get codec capabilities
   */
  getCodecCapabilities(name: string): CodecCapabilities | null {
    const codec = this.codecs.get(name);
    return codec?.capabilities || null;
  }

  /**
   * Find the best codec for a conversion task
   */
  findBestCodec(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): string | null {
    const candidates: Array<{ name: string; score: number }> = [];

    for (const [name, codec] of this.codecs) {
      if (
        codec.capabilities.canDecode.includes(sourceFormat) &&
        codec.capabilities.canEncode.includes(targetFormat) &&
        codec.capabilities.maxFileSize >= fileSize
      ) {
        let score = 0;
        
        // Prefer loaded codecs
        if (codec.isLoaded) score += 100;
        
        // Prefer codecs with SIMD support
        if (codec.capabilities.supportsSIMD) score += 50;
        
        // Prefer codecs with thread support
        if (codec.capabilities.supportsThreads) score += 25;
        
        // Prefer codecs with higher file size limits
        score += Math.min(codec.capabilities.maxFileSize / (1024 * 1024), 10);
        
        candidates.push({ name, score });
      }
    }

    if (candidates.length === 0) return null;

    // Return the codec with the highest score
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].name;
  }

  /**
   * Ensure a codec is loaded for a specific conversion
   */
  async ensureCodecLoaded(
    sourceFormat: ImageFormat,
    targetFormat: ImageFormat,
    fileSize: number
  ): Promise<string | null> {
    const codecName = this.findBestCodec(sourceFormat, targetFormat, fileSize);
    
    if (!codecName) return null;
    
    if (!this.isCodecLoaded(codecName)) {
      const loaded = await this.loadCodec(codecName);
      if (!loaded) return null;
    }
    
    return codecName;
  }

  /**
   * Preload commonly used codecs
   */
  async preloadCommonCodecs(): Promise<void> {
    const commonCodecs = ['mozjpeg', 'libwebp'];
    const loadPromises = commonCodecs.map(name => this.loadCodec(name));
    
    try {
      await Promise.allSettled(loadPromises);
      console.log('Common codecs preloaded');
    } catch (error) {
      console.warn('Some codecs failed to preload:', error);
    }
  }

  /**
   * Check browser support for WASM features
   */
  checkBrowserSupport(): {
    hasWebAssembly: boolean;
    hasSharedArrayBuffer: boolean;
    hasWebAssemblyThreads: boolean;
    hasSimd: boolean;
  } {
    return {
      hasWebAssembly: typeof WebAssembly !== 'undefined',
      hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      hasWebAssemblyThreads: typeof WebAssembly.instantiateStreaming !== 'undefined',
      hasSimd: this.checkSimdSupport(),
    };
  }

  /**
   * Check SIMD support
   */
  private checkSimdSupport(): boolean {
    try {
      // Try to create a simple WASM module with SIMD instructions
      const simdTest = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // WASM magic number
        0x01, 0x00, 0x00, 0x00, // Version
        0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7f, // Function type
        0x03, 0x02, 0x01, 0x00, // Function section
        0x0a, 0x09, 0x01, 0x07, 0x00, 0xfd, 0x0c, 0x00, 0x00, 0x0b, // Code section with SIMD
      ]);
      
      WebAssembly.validate(simdTest);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const wasmCodecLoader = new WasmCodecLoader();

