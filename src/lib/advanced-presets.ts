import { ConversionSettings, ImageFormat } from '@/types';

export interface AdvancedPreset {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'print' | 'social' | 'gaming' | 'photography' | 'custom';
  settings: ConversionSettings;
  tags: string[];
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: number;
}

export interface PresetCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  presets: AdvancedPreset[];
}

export interface SmartOptimization {
  enabled: boolean;
  targetSize?: number; // Target file size in bytes
  targetQuality?: number; // Target quality percentage
  adaptiveQuality: boolean;
  formatOptimization: boolean;
  dimensionOptimization: boolean;
}

export interface BatchOptimization {
  enabled: boolean;
  parallelProcessing: boolean;
  memoryOptimization: boolean;
  priorityOrder: 'size' | 'quality' | 'format' | 'name';
  smartBatching: boolean;
}

/**
 * Advanced Presets Manager
 */
export class AdvancedPresetsManager {
  private presets: Map<string, AdvancedPreset> = new Map();
  private categories: Map<string, PresetCategory> = new Map();
  private customPresets: AdvancedPreset[] = [];

  constructor() {
    this.initializeDefaultPresets();
    this.loadCustomPresets();
  }

  /**
   * Get all preset categories
   */
  getCategories(): PresetCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Get presets by category
   */
  getPresetsByCategory(categoryId: string): AdvancedPreset[] {
    const category = this.categories.get(categoryId);
    return category ? category.presets : [];
  }

  /**
   * Get all presets
   */
  getAllPresets(): AdvancedPreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get preset by ID
   */
  getPreset(id: string): AdvancedPreset | undefined {
    return this.presets.get(id);
  }

  /**
   * Create custom preset
   */
  createCustomPreset(
    name: string,
    description: string,
    settings: ConversionSettings,
    category: string = 'custom',
    tags: string[] = []
  ): AdvancedPreset {
    const preset: AdvancedPreset = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category: category as any,
      settings,
      tags,
      isCustom: true,
      createdBy: 'user',
      createdAt: Date.now(),
    };

    this.presets.set(preset.id, preset);
    this.customPresets.push(preset);
    this.saveCustomPresets();

    return preset;
  }

  /**
   * Update custom preset
   */
  updateCustomPreset(id: string, updates: Partial<AdvancedPreset>): boolean {
    const preset = this.presets.get(id);
    if (!preset || !preset.isCustom) return false;

    const updatedPreset = { ...preset, ...updates };
    this.presets.set(id, updatedPreset);
    
    const index = this.customPresets.findIndex(p => p.id === id);
    if (index !== -1) {
      this.customPresets[index] = updatedPreset;
    }
    
    this.saveCustomPresets();
    return true;
  }

  /**
   * Delete custom preset
   */
  deleteCustomPreset(id: string): boolean {
    const preset = this.presets.get(id);
    if (!preset || !preset.isCustom) return false;

    this.presets.delete(id);
    this.customPresets = this.customPresets.filter(p => p.id !== id);
    this.saveCustomPresets();
    return true;
  }

  /**
   * Search presets
   */
  searchPresets(query: string): AdvancedPreset[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.presets.values()).filter(preset =>
      preset.name.toLowerCase().includes(lowercaseQuery) ||
      preset.description.toLowerCase().includes(lowercaseQuery) ||
      preset.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get recommended presets based on file properties
   */
  getRecommendedPresets(
    fileSize: number,
    fileFormat: ImageFormat,
    dimensions?: { width: number; height: number }
  ): AdvancedPreset[] {
    const recommendations: AdvancedPreset[] = [];

    // Size-based recommendations
    if (fileSize > 10 * 1024 * 1024) { // > 10MB
      recommendations.push(
        this.presets.get('high-compression')!,
        this.presets.get('web-optimized')!
      );
    } else if (fileSize < 1024 * 1024) { // < 1MB
      recommendations.push(
        this.presets.get('high-quality')!,
        this.presets.get('print-ready')!
      );
    }

    // Format-based recommendations
    if (fileFormat === 'png') {
      recommendations.push(
        this.presets.get('png-to-webp')!,
        this.presets.get('png-to-avif')!
      );
    } else if (fileFormat === 'jpg' || fileFormat === 'jpeg') {
      recommendations.push(
        this.presets.get('jpg-to-webp')!,
        this.presets.get('jpg-to-avif')!
      );
    }

    // Dimension-based recommendations
    if (dimensions) {
      const { width, height } = dimensions;
      const megapixels = (width * height) / 1000000;
      
      if (megapixels > 20) {
        recommendations.push(this.presets.get('high-resolution')!);
      } else if (megapixels < 2) {
        recommendations.push(this.presets.get('thumbnail')!);
      }
    }

    return Array.from(new Set(recommendations)); // Remove duplicates
  }

  /**
   * Generate smart optimization settings
   */
  generateSmartOptimization(
    files: File[],
    targetSize?: number,
    targetQuality?: number
  ): SmartOptimization {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const avgSize = totalSize / files.length;
    
    return {
      enabled: true,
      targetSize: targetSize || Math.round(avgSize * 0.3), // 30% of original size
      targetQuality: targetQuality || 85,
      adaptiveQuality: true,
      formatOptimization: true,
      dimensionOptimization: avgSize > 5 * 1024 * 1024, // > 5MB
    };
  }

  /**
   * Generate batch optimization settings
   */
  generateBatchOptimization(files: File[]): BatchOptimization {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileCount = files.length;
    
    return {
      enabled: true,
      parallelProcessing: fileCount > 5,
      memoryOptimization: totalSize > 100 * 1024 * 1024, // > 100MB
      priorityOrder: totalSize > 50 * 1024 * 1024 ? 'size' : 'quality',
      smartBatching: fileCount > 10,
    };
  }

  /**
   * Initialize default presets
   */
  private initializeDefaultPresets(): void {
    // Web Optimization Presets
    const webPresets: AdvancedPreset[] = [
      {
        id: 'web-optimized',
        name: 'Web Optimized',
        description: 'Perfect balance of quality and file size for web use',
        category: 'web',
        settings: {
          format: 'webp',
          quality: 85,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['web', 'fast', 'optimized'],
      },
      {
        id: 'high-compression',
        name: 'High Compression',
        description: 'Maximum compression for minimal file size',
        category: 'web',
        settings: {
          format: 'webp',
          quality: 60,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['web', 'compression', 'small'],
      },
      {
        id: 'next-gen-webp',
        name: 'Next-Gen WebP',
        description: 'Modern WebP with advanced compression',
        category: 'web',
        settings: {
          format: 'webp',
          quality: 90,
          preserveExif: false,
          preserveColorProfile: true,
        },
        tags: ['web', 'modern', 'webp'],
      },
    ];

    // Print Presets
    const printPresets: AdvancedPreset[] = [
      {
        id: 'print-ready',
        name: 'Print Ready',
        description: 'High quality for professional printing',
        category: 'print',
        settings: {
          format: 'png',
          quality: 100,
          preserveExif: true,
          preserveColorProfile: true,
        },
        tags: ['print', 'quality', 'professional'],
      },
      {
        id: 'high-quality',
        name: 'High Quality',
        description: 'Maximum quality with minimal compression',
        category: 'print',
        settings: {
          format: 'png',
          quality: 95,
          preserveExif: true,
          preserveColorProfile: true,
        },
        tags: ['print', 'quality', 'lossless'],
      },
    ];

    // Social Media Presets
    const socialPresets: AdvancedPreset[] = [
      {
        id: 'instagram-square',
        name: 'Instagram Square',
        description: 'Optimized for Instagram square posts (1080x1080)',
        category: 'social',
        settings: {
          format: 'jpg',
          quality: 90,
          width: 1080,
          height: 1080,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['social', 'instagram', 'square'],
      },
      {
        id: 'facebook-cover',
        name: 'Facebook Cover',
        description: 'Optimized for Facebook cover photos (1200x630)',
        category: 'social',
        settings: {
          format: 'jpg',
          quality: 85,
          width: 1200,
          height: 630,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['social', 'facebook', 'cover'],
      },
      {
        id: 'twitter-header',
        name: 'Twitter Header',
        description: 'Optimized for Twitter headers (1500x500)',
        category: 'social',
        settings: {
          format: 'jpg',
          quality: 85,
          width: 1500,
          height: 500,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['social', 'twitter', 'header'],
      },
    ];

    // Gaming Presets
    const gamingPresets: AdvancedPreset[] = [
      {
        id: 'game-texture',
        name: 'Game Texture',
        description: 'Optimized for game textures and assets',
        category: 'gaming',
        settings: {
          format: 'png',
          quality: 90,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['gaming', 'texture', 'assets'],
      },
      {
        id: 'ui-elements',
        name: 'UI Elements',
        description: 'Perfect for game UI elements and icons',
        category: 'gaming',
        settings: {
          format: 'png',
          quality: 100,
          preserveExif: false,
          preserveColorProfile: true,
        },
        tags: ['gaming', 'ui', 'icons'],
      },
    ];

    // Photography Presets
    const photographyPresets: AdvancedPreset[] = [
      {
        id: 'photography-raw',
        name: 'Photography RAW',
        description: 'High quality for photography with metadata preservation',
        category: 'photography',
        settings: {
          format: 'png',
          quality: 100,
          preserveExif: true,
          preserveColorProfile: true,
        },
        tags: ['photography', 'raw', 'metadata'],
      },
      {
        id: 'high-resolution',
        name: 'High Resolution',
        description: 'For high-resolution displays and large prints',
        category: 'photography',
        settings: {
          format: 'png',
          quality: 95,
          preserveExif: true,
          preserveColorProfile: true,
        },
        tags: ['photography', 'high-res', 'large'],
      },
    ];

    // Format Conversion Presets
    const formatPresets: AdvancedPreset[] = [
      {
        id: 'png-to-webp',
        name: 'PNG to WebP',
        description: 'Convert PNG to WebP with transparency support',
        category: 'web',
        settings: {
          format: 'webp',
          quality: 90,
          preserveExif: false,
          preserveColorProfile: true,
        },
        tags: ['conversion', 'png', 'webp', 'transparency'],
      },
      {
        id: 'jpg-to-webp',
        name: 'JPG to WebP',
        description: 'Convert JPG to WebP for better compression',
        category: 'web',
        settings: {
          format: 'webp',
          quality: 85,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['conversion', 'jpg', 'webp', 'compression'],
      },
      {
        id: 'png-to-avif',
        name: 'PNG to AVIF',
        description: 'Convert PNG to AVIF for next-gen compression',
        category: 'web',
        settings: {
          format: 'avif',
          quality: 80,
          preserveExif: false,
          preserveColorProfile: true,
        },
        tags: ['conversion', 'png', 'avif', 'next-gen'],
      },
      {
        id: 'jpg-to-avif',
        name: 'JPG to AVIF',
        description: 'Convert JPG to AVIF for superior compression',
        category: 'web',
        settings: {
          format: 'avif',
          quality: 75,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['conversion', 'jpg', 'avif', 'compression'],
      },
    ];

    // Special Purpose Presets
    const specialPresets: AdvancedPreset[] = [
      {
        id: 'thumbnail',
        name: 'Thumbnail',
        description: 'Small thumbnails for previews and galleries',
        category: 'web',
        settings: {
          format: 'jpg',
          quality: 80,
          width: 300,
          height: 300,
          preserveExif: false,
          preserveColorProfile: false,
        },
        tags: ['thumbnail', 'preview', 'gallery'],
      },
      {
        id: 'avatar',
        name: 'Avatar',
        description: 'Perfect for profile pictures and avatars',
        category: 'social',
        settings: {
          format: 'png',
          quality: 90,
          width: 256,
          height: 256,
          preserveExif: false,
          preserveColorProfile: true,
        },
        tags: ['avatar', 'profile', 'social'],
      },
    ];

    // Add all presets to the map
    const allPresets = [
      ...webPresets,
      ...printPresets,
      ...socialPresets,
      ...gamingPresets,
      ...photographyPresets,
      ...formatPresets,
      ...specialPresets,
    ];

    allPresets.forEach(preset => {
      this.presets.set(preset.id, preset);
    });

    // Create categories
    this.categories.set('web', {
      id: 'web',
      name: 'Web Optimization',
      description: 'Presets optimized for web use',
      icon: '🌐',
      presets: [...webPresets, ...formatPresets, ...specialPresets.filter(p => p.category === 'web')],
    });

    this.categories.set('print', {
      id: 'print',
      name: 'Print & Professional',
      description: 'High-quality presets for printing',
      icon: '🖨️',
      presets: printPresets,
    });

    this.categories.set('social', {
      id: 'social',
      name: 'Social Media',
      description: 'Presets for social media platforms',
      icon: '📱',
      presets: [...socialPresets, ...specialPresets.filter(p => p.category === 'social')],
    });

    this.categories.set('gaming', {
      id: 'gaming',
      name: 'Gaming & UI',
      description: 'Presets for games and user interfaces',
      icon: '🎮',
      presets: gamingPresets,
    });

    this.categories.set('photography', {
      id: 'photography',
      name: 'Photography',
      description: 'High-quality presets for photography',
      icon: '📸',
      presets: photographyPresets,
    });

    this.categories.set('custom', {
      id: 'custom',
      name: 'Custom Presets',
      description: 'Your custom presets',
      icon: '⚙️',
      presets: this.customPresets,
    });
  }

  /**
   * Load custom presets from localStorage
   */
  private loadCustomPresets(): void {
    try {
      const stored = localStorage.getItem('snapconvert_custom_presets');
      if (stored) {
        const customPresets = JSON.parse(stored);
        customPresets.forEach((preset: AdvancedPreset) => {
          this.presets.set(preset.id, preset);
          this.customPresets.push(preset);
        });
      }
    } catch (error) {
      console.error('Failed to load custom presets:', error);
    }
  }

  /**
   * Save custom presets to localStorage
   */
  private saveCustomPresets(): void {
    try {
      localStorage.setItem('snapconvert_custom_presets', JSON.stringify(this.customPresets));
    } catch (error) {
      console.error('Failed to save custom presets:', error);
    }
  }
}

// Singleton instance
export const advancedPresetsManager = new AdvancedPresetsManager();
