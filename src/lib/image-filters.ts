import { ConversionSettings } from '@/types';

export interface ImageFilter {
  id: string;
  name: string;
  description: string;
  category: 'enhancement' | 'artistic' | 'color' | 'blur' | 'sharpening' | 'noise';
  parameters: FilterParameter[];
  apply: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, parameters: Record<string, any>) => void;
}

export interface FilterParameter {
  id: string;
  name: string;
  type: 'range' | 'boolean' | 'select' | 'color';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  options?: { value: any; label: string }[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Array<{
    filterId: string;
    parameters: Record<string, any>;
    enabled: boolean;
  }>;
}

export interface AdvancedConversionSettings extends ConversionSettings {
  filters?: Array<{
    filterId: string;
    parameters: Record<string, any>;
    enabled: boolean;
  }>;
  filterPreset?: string;
}

/**
 * Advanced Image Filters Manager
 */
export class ImageFiltersManager {
  private filters: Map<string, ImageFilter> = new Map();
  private presets: Map<string, FilterPreset> = new Map();

  constructor() {
    this.initializeFilters();
    this.initializePresets();
  }

  /**
   * Get all available filters
   */
  getAllFilters(): ImageFilter[] {
    return Array.from(this.filters.values());
  }

  /**
   * Get filters by category
   */
  getFiltersByCategory(category: string): ImageFilter[] {
    return Array.from(this.filters.values()).filter(filter => filter.category === category);
  }

  /**
   * Get filter by ID
   */
  getFilter(id: string): ImageFilter | undefined {
    return this.filters.get(id);
  }

  /**
   * Get all filter presets
   */
  getAllPresets(): FilterPreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get preset by ID
   */
  getPreset(id: string): FilterPreset | undefined {
    return this.presets.get(id);
  }

  /**
   * Apply filters to canvas
   */
  applyFilters(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    filters: Array<{
      filterId: string;
      parameters: Record<string, any>;
      enabled: boolean;
    }>
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    filters.forEach(({ filterId, parameters, enabled }) => {
      if (!enabled) return;
      
      const filter = this.filters.get(filterId);
      if (filter) {
        filter.apply(canvas, ctx, parameters);
      }
    });
  }

  /**
   * Initialize all available filters
   */
  private initializeFilters(): void {
    // Enhancement Filters
    this.addFilter({
      id: 'brightness',
      name: 'Brightness',
      description: 'Adjust image brightness',
      category: 'enhancement',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: -100,
          max: 100,
          step: 1,
          defaultValue: 0,
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amount = params.amount;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, data[i] + amount));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + amount));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + amount));
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    this.addFilter({
      id: 'contrast',
      name: 'Contrast',
      description: 'Adjust image contrast',
      category: 'enhancement',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: -100,
          max: 100,
          step: 1,
          defaultValue: 0,
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const factor = (259 * (params.amount + 255)) / (255 * (259 - params.amount));
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    this.addFilter({
      id: 'saturation',
      name: 'Saturation',
      description: 'Adjust color saturation',
      category: 'enhancement',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: -100,
          max: 100,
          step: 1,
          defaultValue: 0,
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amount = params.amount / 100;
        
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = Math.max(0, Math.min(255, gray + amount * (data[i] - gray)));
          data[i + 1] = Math.max(0, Math.min(255, gray + amount * (data[i + 1] - gray)));
          data[i + 2] = Math.max(0, Math.min(255, gray + amount * (data[i + 2] - gray)));
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    // Color Filters
    this.addFilter({
      id: 'sepia',
      name: 'Sepia',
      description: 'Apply sepia tone effect',
      category: 'color',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 100,
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amount = params.amount / 100;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          
          // Blend with original
          data[i] = data[i] * amount + r * (1 - amount);
          data[i + 1] = data[i + 1] * amount + g * (1 - amount);
          data[i + 2] = data[i + 2] * amount + b * (1 - amount);
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    this.addFilter({
      id: 'grayscale',
      name: 'Grayscale',
      description: 'Convert to grayscale',
      category: 'color',
      parameters: [
        {
          id: 'method',
          name: 'Method',
          type: 'select',
          defaultValue: 'luminance',
          options: [
            { value: 'luminance', label: 'Luminance' },
            { value: 'average', label: 'Average' },
            { value: 'desaturation', label: 'Desaturation' },
          ],
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          let gray;
          switch (params.method) {
            case 'luminance':
              gray = 0.299 * r + 0.587 * g + 0.114 * b;
              break;
            case 'average':
              gray = (r + g + b) / 3;
              break;
            case 'desaturation':
              gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
              break;
            default:
              gray = 0.299 * r + 0.587 * g + 0.114 * b;
          }
          
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    // Blur Filters
    this.addFilter({
      id: 'gaussian-blur',
      name: 'Gaussian Blur',
      description: 'Apply Gaussian blur effect',
      category: 'blur',
      parameters: [
        {
          id: 'radius',
          name: 'Radius',
          type: 'range',
          min: 0,
          max: 10,
          step: 0.1,
          defaultValue: 2,
        },
      ],
      apply: (canvas, ctx, params) => {
        const radius = params.radius;
        if (radius <= 0) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Simple box blur approximation
        const kernelSize = Math.ceil(radius * 2) + 1;
        const halfKernel = Math.floor(kernelSize / 2);
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;
            
            for (let ky = -halfKernel; ky <= halfKernel; ky++) {
              for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                const px = Math.max(0, Math.min(width - 1, x + kx));
                const py = Math.max(0, Math.min(height - 1, y + ky));
                const idx = (py * width + px) * 4;
                
                r += data[idx];
                g += data[idx + 1];
                b += data[idx + 2];
                a += data[idx + 3];
                count++;
              }
            }
            
            const idx = (y * width + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
            data[idx + 3] = a / count;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    // Sharpening Filters
    this.addFilter({
      id: 'unsharp-mask',
      name: 'Unsharp Mask',
      description: 'Apply unsharp mask sharpening',
      category: 'sharpening',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: 0,
          max: 200,
          step: 1,
          defaultValue: 100,
        },
        {
          id: 'radius',
          name: 'Radius',
          type: 'range',
          min: 0.1,
          max: 5,
          step: 0.1,
          defaultValue: 1,
        },
        {
          id: 'threshold',
          name: 'Threshold',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          defaultValue: 0,
        },
      ],
      apply: (canvas, ctx, params) => {
        // This is a simplified implementation
        // A full unsharp mask would require more complex convolution
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amount = params.amount / 100;
        
        // Simple sharpening kernel
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const idx = (y * canvas.width + x) * 4;
            
            // Get surrounding pixels
            const top = ((y - 1) * canvas.width + x) * 4;
            const bottom = ((y + 1) * canvas.width + x) * 4;
            const left = (y * canvas.width + (x - 1)) * 4;
            const right = (y * canvas.width + (x + 1)) * 4;
            
            // Apply sharpening
            data[idx] = Math.max(0, Math.min(255, data[idx] + amount * (4 * data[idx] - data[top] - data[bottom] - data[left] - data[right])));
            data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + amount * (4 * data[idx + 1] - data[top + 1] - data[bottom + 1] - data[left + 1] - data[right + 1])));
            data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + amount * (4 * data[idx + 2] - data[top + 2] - data[bottom + 2] - data[left + 2] - data[right + 2])));
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });

    // Artistic Filters
    this.addFilter({
      id: 'vintage',
      name: 'Vintage',
      description: 'Apply vintage photo effect',
      category: 'artistic',
      parameters: [
        {
          id: 'amount',
          name: 'Amount',
          type: 'range',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 50,
        },
      ],
      apply: (canvas, ctx, params) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amount = params.amount / 100;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Vintage effect: reduce blue, increase red/yellow
          const newR = Math.min(255, r * 1.1);
          const newG = Math.min(255, g * 1.05);
          const newB = Math.max(0, b * 0.9);
          
          data[i] = r + (newR - r) * amount;
          data[i + 1] = g + (newG - g) * amount;
          data[i + 2] = b + (newB - b) * amount;
        }
        
        ctx.putImageData(imageData, 0, 0);
      },
    });
  }

  /**
   * Initialize filter presets
   */
  private initializePresets(): void {
    this.addPreset({
      id: 'enhance-all',
      name: 'Enhance All',
      description: 'Basic enhancement for all images',
      filters: [
        { filterId: 'brightness', parameters: { amount: 10 }, enabled: true },
        { filterId: 'contrast', parameters: { amount: 15 }, enabled: true },
        { filterId: 'saturation', parameters: { amount: 10 }, enabled: true },
      ],
    });

    this.addPreset({
      id: 'vintage-look',
      name: 'Vintage Look',
      description: 'Classic vintage photo effect',
      filters: [
        { filterId: 'sepia', parameters: { amount: 60 }, enabled: true },
        { filterId: 'vintage', parameters: { amount: 40 }, enabled: true },
        { filterId: 'brightness', parameters: { amount: -5 }, enabled: true },
      ],
    });

    this.addPreset({
      id: 'sharp-and-clear',
      name: 'Sharp & Clear',
      description: 'Enhance sharpness and clarity',
      filters: [
        { filterId: 'unsharp-mask', parameters: { amount: 120, radius: 1, threshold: 0 }, enabled: true },
        { filterId: 'contrast', parameters: { amount: 10 }, enabled: true },
      ],
    });

    this.addPreset({
      id: 'soft-portrait',
      name: 'Soft Portrait',
      description: 'Soft, flattering effect for portraits',
      filters: [
        { filterId: 'gaussian-blur', parameters: { radius: 0.5 }, enabled: true },
        { filterId: 'brightness', parameters: { amount: 5 }, enabled: true },
        { filterId: 'saturation', parameters: { amount: -10 }, enabled: true },
      ],
    });
  }

  /**
   * Add a filter
   */
  private addFilter(filter: ImageFilter): void {
    this.filters.set(filter.id, filter);
  }

  /**
   * Add a preset
   */
  private addPreset(preset: FilterPreset): void {
    this.presets.set(preset.id, preset);
  }
}

// Singleton instance
export const imageFiltersManager = new ImageFiltersManager();

