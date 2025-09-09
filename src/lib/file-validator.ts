import { ImageFormat } from '@/types';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo: {
    name: string;
    size: number;
    type: string;
    format: ImageFormat | null;
    dimensions?: { width: number; height: number };
    hasAlpha?: boolean;
    colorSpace?: string;
  };
}

export interface ValidationRule {
  name: string;
  validate: (file: File) => Promise<{ isValid: boolean; message?: string }>;
  severity: 'error' | 'warning';
}

export interface FileValidationConfig {
  maxFileSize: number; // in bytes
  maxFiles: number;
  allowedFormats: ImageFormat[];
  minDimensions?: { width: number; height: number };
  maxDimensions?: { width: number; height: number };
  allowAnimated: boolean;
  allowTransparency: boolean;
}

/**
 * File Validator for comprehensive file validation
 */
export class FileValidator {
  private config: FileValidationConfig;
  private rules: ValidationRule[] = [];

  constructor(config?: Partial<FileValidationConfig>) {
    this.config = {
      maxFileSize: 200 * 1024 * 1024, // 200MB
      maxFiles: 100,
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif', 'tiff', 'bmp', 'gif', 'svg'],
      allowAnimated: true,
      allowTransparency: true,
      ...config,
    };

    this.initializeRules();
  }

  /**
   * Validate a single file
   */
  async validateFile(file: File): Promise<FileValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let fileInfo: FileValidationResult['fileInfo'] = {
      name: file.name,
      size: file.size,
      type: file.type,
      format: this.getImageFormat(file.name),
    };

    // Run all validation rules
    for (const rule of this.rules) {
      try {
        const result = await rule.validate(file);
        if (!result.isValid && result.message) {
          if (rule.severity === 'error') {
            errors.push(result.message);
          } else {
            warnings.push(result.message);
          }
        }
      } catch (error) {
        console.warn(`Validation rule ${rule.name} failed:`, error);
      }
    }

    // Extract additional file info if possible
    if (file.type.startsWith('image/')) {
      try {
        const imageInfo = await this.extractImageInfo(file);
        fileInfo = { ...fileInfo, ...imageInfo };
      } catch (error) {
        warnings.push('Could not extract image metadata');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo,
    };
  }

  /**
   * Validate multiple files
   */
  async validateFiles(files: File[]): Promise<{
    validFiles: File[];
    invalidFiles: { file: File; result: FileValidationResult }[];
    totalErrors: number;
    totalWarnings: number;
  }> {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; result: FileValidationResult }[] = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    // Check total file count
    if (files.length > this.config.maxFiles) {
      const error = `Too many files selected. Maximum allowed: ${this.config.maxFiles}`;
      files.forEach(file => {
        invalidFiles.push({
          file,
          result: {
            isValid: false,
            errors: [error],
            warnings: [],
            fileInfo: {
              name: file.name,
              size: file.size,
              type: file.type,
              format: this.getImageFormat(file.name),
            },
          },
        });
      });
      return { validFiles, invalidFiles, totalErrors: files.length, totalWarnings: 0 };
    }

    // Validate each file
    for (const file of files) {
      const result = await this.validateFile(file);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      if (result.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, result });
      }
    }

    return { validFiles, invalidFiles, totalErrors, totalWarnings };
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): ImageFormat[] {
    return [...this.config.allowedFormats];
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: ImageFormat): boolean {
    return this.config.allowedFormats.includes(format);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FileValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeRules();
  }

  /**
   * Get current configuration
   */
  getConfig(): FileValidationConfig {
    return { ...this.config };
  }

  /**
   * Initialize validation rules
   */
  private initializeRules(): void {
    this.rules = [
      {
        name: 'fileSize',
        validate: async (file: File) => {
          const isValid = file.size <= this.config.maxFileSize;
          return {
            isValid,
            message: isValid ? undefined : `File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (${this.formatFileSize(this.config.maxFileSize)})`,
          };
        },
        severity: 'error',
      },
      {
        name: 'fileType',
        validate: async (file: File) => {
          const isValid = file.type.startsWith('image/');
          return {
            isValid,
            message: isValid ? undefined : 'File is not an image',
          };
        },
        severity: 'error',
      },
      {
        name: 'fileFormat',
        validate: async (file: File) => {
          const format = this.getImageFormat(file.name);
          const isValid = format && this.config.allowedFormats.includes(format);
          return {
            isValid,
            message: isValid ? undefined : `File format '${format || 'unknown'}' is not supported`,
          };
        },
        severity: 'error',
      },
      {
        name: 'fileName',
        validate: async (file: File) => {
          const isValid = file.name.length > 0 && !file.name.includes('..');
          return {
            isValid,
            message: isValid ? undefined : 'Invalid file name',
          };
        },
        severity: 'error',
      },
      {
        name: 'fileExtension',
        validate: async (file: File) => {
          const hasExtension = file.name.includes('.') && file.name.split('.').length > 1;
          return {
            isValid: hasExtension,
            message: hasExtension ? undefined : 'File should have an extension',
          };
        },
        severity: 'warning',
      },
      {
        name: 'imageDimensions',
        validate: async (file: File) => {
          if (!file.type.startsWith('image/')) {
            return { isValid: true };
          }

          try {
            const dimensions = await this.getImageDimensions(file);
            if (!dimensions) {
              return { isValid: true }; // Skip if we can't get dimensions
            }

            const { width, height } = dimensions;
            const minDims = this.config.minDimensions;
            const maxDims = this.config.maxDimensions;

            if (minDims && (width < minDims.width || height < minDims.height)) {
              return {
                isValid: false,
                message: `Image dimensions (${width}x${height}) are below minimum (${minDims.width}x${minDims.height})`,
              };
            }

            if (maxDims && (width > maxDims.width || height > maxDims.height)) {
              return {
                isValid: false,
                message: `Image dimensions (${width}x${height}) exceed maximum (${maxDims.width}x${maxDims.height})`,
              };
            }

            return { isValid: true };
          } catch (error) {
            return { isValid: true }; // Skip if we can't validate dimensions
          }
        },
        severity: 'warning',
      },
      {
        name: 'animatedImages',
        validate: async (file: File) => {
          if (!this.config.allowAnimated && this.isAnimatedFormat(file.name)) {
            return {
              isValid: false,
              message: 'Animated images are not allowed',
            };
          }
          return { isValid: true };
        },
        severity: 'error',
      },
    ];
  }

  /**
   * Get image format from filename
   */
  private getImageFormat(filename: string): ImageFormat | null {
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
    
    return formatMap[extension || ''] || null;
  }

  /**
   * Check if format is animated
   */
  private isAnimatedFormat(filename: string): boolean {
    const animatedFormats = ['gif', 'webp', 'avif'];
    const format = this.getImageFormat(filename);
    return format ? animatedFormats.includes(format) : false;
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      
      img.src = url;
    });
  }

  /**
   * Extract image information
   */
  private async extractImageInfo(file: File): Promise<Partial<FileValidationResult['fileInfo']>> {
    const dimensions = await this.getImageDimensions(file);
    const format = this.getImageFormat(file.name);
    
    return {
      format,
      dimensions,
      hasAlpha: format ? ['png', 'webp', 'gif', 'svg'].includes(format) : undefined,
      colorSpace: 'sRGB', // Default, could be extracted from EXIF
    };
  }

  /**
   * Format file size
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Default validator instance
export const fileValidator = new FileValidator();

