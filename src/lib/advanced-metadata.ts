import { ImageMetadata } from '@/types';

export interface EXIFData {
  orientation?: number;
  camera?: {
    make?: string;
    model?: string;
    lens?: string;
  };
  settings?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
    flash?: boolean;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  timestamp?: Date;
  software?: string;
  copyright?: string;
  description?: string;
  keywords?: string[];
}

export interface ColorProfile {
  type: 'sRGB' | 'Adobe RGB' | 'ProPhoto RGB' | 'Display P3' | 'Rec. 2020' | 'Unknown';
  embedded: boolean;
  gamma?: number;
  whitePoint?: [number, number];
  primaries?: {
    red: [number, number];
    green: [number, number];
    blue: [number, number];
  };
}

export interface AdvancedImageMetadata extends ImageMetadata {
  exif?: EXIFData;
  colorProfile?: ColorProfile;
  hasTransparency: boolean;
  bitDepth: number;
  compression?: string;
  progressive?: boolean;
  interlaced?: boolean;
  animation?: {
    frames: number;
    duration: number;
    loop: boolean;
  };
  dpi?: {
    x: number;
    y: number;
  };
  aspectRatio: number;
  dominantColors?: string[];
  histogram?: {
    red: number[];
    green: number[];
    blue: number[];
    luminance: number[];
  };
}

export interface MetadataOptions {
  extractEXIF: boolean;
  extractColorProfile: boolean;
  extractDominantColors: boolean;
  extractHistogram: boolean;
  preserveEXIF: boolean;
  preserveColorProfile: boolean;
  stripMetadata: boolean;
}

/**
 * Advanced Metadata Handler
 */
export class AdvancedMetadataHandler {
  private options: MetadataOptions;

  constructor(options: Partial<MetadataOptions> = {}) {
    this.options = {
      extractEXIF: true,
      extractColorProfile: true,
      extractDominantColors: false,
      extractHistogram: false,
      preserveEXIF: true,
      preserveColorProfile: true,
      stripMetadata: false,
      ...options,
    };
  }

  /**
   * Extract comprehensive metadata from image
   */
  async extractAdvancedMetadata(file: File): Promise<AdvancedImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const basicMetadata = await this.extractBasicMetadata(file, img);
          const advancedMetadata: AdvancedImageMetadata = {
            ...basicMetadata,
            hasTransparency: this.detectTransparency(img),
            bitDepth: this.detectBitDepth(file),
            aspectRatio: img.naturalWidth / img.naturalHeight,
          };

          // Extract EXIF data if enabled
          if (this.options.extractEXIF) {
            advancedMetadata.exif = await this.extractEXIFData(file);
          }

          // Extract color profile if enabled
          if (this.options.extractColorProfile) {
            advancedMetadata.colorProfile = await this.extractColorProfile(file);
          }

          // Extract dominant colors if enabled
          if (this.options.extractDominantColors) {
            advancedMetadata.dominantColors = await this.extractDominantColors(img);
          }

          // Extract histogram if enabled
          if (this.options.extractHistogram) {
            advancedMetadata.histogram = await this.extractHistogram(img);
          }

          URL.revokeObjectURL(url);
          resolve(advancedMetadata);
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
   * Extract basic metadata
   */
  private async extractBasicMetadata(file: File, img: HTMLImageElement): Promise<ImageMetadata> {
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      format: this.getImageFormat(file.name),
      size: file.size,
      hasAlpha: this.detectTransparency(img),
      hasExif: await this.hasEXIFData(file),
      colorSpace: 'sRGB', // Default, will be updated if color profile is extracted
    };
  }

  /**
   * Extract EXIF data from image
   */
  private async extractEXIFData(file: File): Promise<EXIFData> {
    try {
      // This is a simplified implementation
      // In a real application, you would use a library like exif-js or piexifjs
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);
      
      // Check for EXIF marker (0xFFE1)
      let offset = 0;
      while (offset < dataView.byteLength - 1) {
        if (dataView.getUint16(offset) === 0xFFE1) {
          // Found EXIF data
          return this.parseEXIFData(dataView, offset);
        }
        offset++;
      }
      
      return {};
    } catch (error) {
      console.warn('Failed to extract EXIF data:', error);
      return {};
    }
  }

  /**
   * Parse EXIF data from DataView
   */
  private parseEXIFData(dataView: DataView, offset: number): EXIFData {
    // This is a very simplified EXIF parser
    // A full implementation would be much more complex
    const exifData: EXIFData = {};
    
    try {
      // Skip EXIF header and get to TIFF header
      const tiffOffset = offset + 4;
      
      // Check byte order
      const byteOrder = dataView.getUint16(tiffOffset);
      const isLittleEndian = byteOrder === 0x4949;
      
      // Get number of IFD entries
      const numEntries = dataView.getUint16(tiffOffset + 2, isLittleEndian);
      
      // Parse orientation (tag 0x0112)
      for (let i = 0; i < numEntries; i++) {
        const entryOffset = tiffOffset + 2 + (i * 12);
        const tag = dataView.getUint16(entryOffset, isLittleEndian);
        
        if (tag === 0x0112) { // Orientation
          exifData.orientation = dataView.getUint16(entryOffset + 8, isLittleEndian);
        }
      }
    } catch (error) {
      console.warn('Failed to parse EXIF data:', error);
    }
    
    return exifData;
  }

  /**
   * Extract color profile information
   */
  private async extractColorProfile(file: File): Promise<ColorProfile> {
    try {
      // This is a simplified implementation
      // In a real application, you would use a library like icc-profile-parser
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);
      
      // Look for ICC profile markers
      if (this.hasICCProfile(dataView)) {
        return {
          type: 'sRGB', // Default assumption
          embedded: true,
        };
      }
      
      return {
        type: 'sRGB',
        embedded: false,
      };
    } catch (error) {
      console.warn('Failed to extract color profile:', error);
      return {
        type: 'Unknown',
        embedded: false,
      };
    }
  }

  /**
   * Check if image has ICC profile
   */
  private hasICCProfile(dataView: DataView): boolean {
    // Look for ICC profile markers in different formats
    const markers = [
      [0xFF, 0xE2], // ICC profile in JPEG
      [0x89, 0x50, 0x4E, 0x47], // PNG signature
    ];
    
    for (const marker of markers) {
      let found = true;
      for (let i = 0; i < marker.length; i++) {
        if (dataView.getUint8(i) !== marker[i]) {
          found = false;
          break;
        }
      }
      if (found) return true;
    }
    
    return false;
  }

  /**
   * Extract dominant colors from image
   */
  private async extractDominantColors(img: HTMLImageElement): Promise<string[]> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Resize image for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight);
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple color quantization
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const color = `rgb(${r},${g},${b})`;
        
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }
      
      // Get top 5 most frequent colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color);
      
      resolve(sortedColors);
    });
  }

  /**
   * Extract histogram from image
   */
  private async extractHistogram(img: HTMLImageElement): Promise<{
    red: number[];
    green: number[];
    blue: number[];
    luminance: number[];
  }> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const red = new Array(256).fill(0);
      const green = new Array(256).fill(0);
      const blue = new Array(256).fill(0);
      const luminance = new Array(256).fill(0);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        red[r]++;
        green[g]++;
        blue[b]++;
        luminance[lum]++;
      }
      
      resolve({ red, green, blue, luminance });
    });
  }

  /**
   * Detect if image has transparency
   */
  private detectTransparency(img: HTMLImageElement): boolean {
    // This is a simplified check
    // In practice, you'd need to check the actual image data
    const format = this.getImageFormatFromSrc(img.src);
    return ['png', 'gif', 'webp'].includes(format);
  }

  /**
   * Detect bit depth
   */
  private detectBitDepth(file: File): number {
    // This is a simplified implementation
    // In practice, you'd need to parse the image format
    const format = this.getImageFormat(file.name);
    switch (format) {
      case 'png':
        return 8; // Most PNGs are 8-bit
      case 'jpg':
      case 'jpeg':
        return 8;
      case 'webp':
        return 8;
      case 'avif':
        return 10; // AVIF supports 10-bit
      default:
        return 8;
    }
  }

  /**
   * Check if image has EXIF data
   */
  private async hasEXIFData(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);
      
      // Look for EXIF marker
      for (let i = 0; i < dataView.byteLength - 1; i++) {
        if (dataView.getUint16(i) === 0xFFE1) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get image format from filename
   */
  private getImageFormat(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  /**
   * Get image format from src
   */
  private getImageFormatFromSrc(src: string): string {
    // Extract format from data URL or file extension
    if (src.startsWith('data:')) {
      const match = src.match(/data:image\/([^;]+)/);
      return match ? match[1] : 'unknown';
    }
    
    const match = src.match(/\.([^.]+)$/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Update metadata options
   */
  updateOptions(newOptions: Partial<MetadataOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current options
   */
  getOptions(): MetadataOptions {
    return { ...this.options };
  }

  /**
   * Strip metadata from image
   */
  async stripMetadata(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          // Draw image without metadata
          ctx.drawImage(img, 0, 0);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, file.type);
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
}

// Singleton instance
export const advancedMetadataHandler = new AdvancedMetadataHandler();

