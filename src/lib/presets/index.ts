import { PresetDefinition, ConversionSettings } from '@/types';

// Predefined conversion presets as specified in the design document
export const PRESETS: Record<string, PresetDefinition> = {
  'web-optimized': {
    id: 'web-optimized',
    name: 'Web Optimized',
    description: 'Best balance of quality and file size for web use',
    settings: {
      format: 'webp',
      quality: 85,
      preserveExif: false,
      preserveColorProfile: false,
    },
    targetFormats: ['webp', 'avif', 'jpg'],
  },
  'visually-lossless': {
    id: 'visually-lossless',
    name: 'Visually Lossless',
    description: 'High quality with minimal compression artifacts',
    settings: {
      format: 'png',
      preserveExif: true,
      preserveColorProfile: true,
      lossless: true,
    },
    targetFormats: ['png', 'webp'],
  },
  'smallest-size': {
    id: 'smallest-size',
    name: 'Smallest Size',
    description: 'Maximum compression for smallest file size',
    settings: {
      format: 'avif',
      quality: 60,
      preserveExif: false,
      preserveColorProfile: false,
    },
    targetFormats: ['avif', 'webp', 'jpg'],
  },
  'print': {
    id: 'print',
    name: 'Print Quality',
    description: 'High resolution suitable for printing',
    settings: {
      format: 'tiff',
      preserveExif: true,
      preserveColorProfile: true,
      lossless: true,
    },
    targetFormats: ['tiff', 'png'],
  },
};

// Smart format suggestions based on source format
export function getSuggestedFormat(sourceFormat: string): string {
  const suggestions: Record<string, string> = {
    'heic': 'jpg', // Better compatibility
    'heif': 'jpg', // Better compatibility
    'png': 'webp', // Better web performance
    'jpg': 'avif', // Better compression
    'jpeg': 'avif', // Better compression
    'bmp': 'png', // Lossless conversion
    'tiff': 'png', // Lossless conversion
    'gif': 'webp', // Better compression with animation support
  };
  
  return suggestions[sourceFormat.toLowerCase()] || 'webp';
}

// Get optimal settings for a format conversion
export function getOptimalSettings(
  sourceFormat: string, 
  targetFormat: string
): Partial<ConversionSettings> {
  const baseSettings: Record<string, Partial<ConversionSettings>> = {
    'webp': { quality: 85, preserveExif: false },
    'avif': { quality: 80, preserveExif: false },
    'jpg': { quality: 90, progressive: true, preserveExif: false },
    'png': { lossless: true, preserveExif: true },
    'tiff': { lossless: true, preserveExif: true },
  };
  
  return baseSettings[targetFormat] || {};
}

// Validate conversion settings
export function validateSettings(settings: ConversionSettings): string[] {
  const errors: string[] = [];
  
  if (settings.quality !== undefined) {
    if (settings.quality < 0 || settings.quality > 100) {
      errors.push('Quality must be between 0 and 100');
    }
  }
  
  if (settings.width !== undefined && settings.width <= 0) {
    errors.push('Width must be greater than 0');
  }
  
  if (settings.height !== undefined && settings.height <= 0) {
    errors.push('Height must be greater than 0');
  }
  
  // Lossless formats shouldn't have quality settings
  if (settings.lossless && settings.quality !== undefined) {
    errors.push('Quality setting not applicable for lossless formats');
  }
  
  return errors;
}
