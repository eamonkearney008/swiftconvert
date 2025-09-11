// Format conversion utilities for advanced image formats

export interface ConversionResult {
  blob: Blob;
  actualFormat: string;
  fallbackUsed?: boolean;
}

export class FormatConverter {
  /**
   * Convert image to HEIC format
   * Note: HEIC output is not supported in browsers, so we convert to JPEG with HEIC-like quality
   */
  static async convertToHEIC(file: File, quality: number): Promise<ConversionResult> {
    // Since browsers don't support HEIC output, we'll use JPEG with high quality
    // and add a note that this is HEIC-compatible quality
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              actualFormat: 'jpeg',
              fallbackUsed: true
            });
          } else {
            reject(new Error('Failed to convert to HEIC-compatible format'));
          }
        }, 'image/jpeg', quality / 100);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to TIFF format
   * Note: TIFF output is not supported in browsers, so we convert to PNG (lossless)
   */
  static async convertToTIFF(file: File): Promise<ConversionResult> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              actualFormat: 'png',
              fallbackUsed: true
            });
          } else {
            reject(new Error('Failed to convert to TIFF-compatible format'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to GIF format
   * Note: For single images, we convert to PNG. For animations, this would need more complex logic
   */
  static async convertToGIF(file: File, quality: number): Promise<ConversionResult> {
    // For single images, we'll convert to PNG with reduced colors
    // For true GIF conversion with animation, we'd need to implement frame extraction
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Reduce colors for GIF-like appearance
        ctx?.drawImage(img, 0, 0);
        
        // Apply dithering effect to simulate GIF color reduction
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          // Simple color reduction (posterize effect)
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / 32) * 32;     // Red
            data[i + 1] = Math.round(data[i + 1] / 32) * 32; // Green
            data[i + 2] = Math.round(data[i + 2] / 32) * 32; // Blue
          }
          ctx?.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              actualFormat: 'png',
              fallbackUsed: true
            });
          } else {
            reject(new Error('Failed to convert to GIF-compatible format'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to BMP format
   * Note: BMP output is not supported in browsers, so we convert to PNG (uncompressed-like)
   */
  static async convertToBMP(file: File): Promise<ConversionResult> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              actualFormat: 'png',
              fallbackUsed: true
            });
          } else {
            reject(new Error('Failed to convert to BMP-compatible format'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to ICO format
   * Note: ICO output is not supported in browsers, so we convert to PNG with icon-like dimensions
   */
  static async convertToICO(file: File, size: number = 32): Promise<ConversionResult> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Resize to icon dimensions
        canvas.width = size;
        canvas.height = size;
        
        // Draw image scaled to icon size
        ctx?.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              actualFormat: 'png',
              fallbackUsed: true
            });
          } else {
            reject(new Error('Failed to convert to ICO-compatible format'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to any supported format with performance optimizations
   */
  static async convertToFormat(file: File, format: string, quality: number = 85): Promise<ConversionResult> {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    try {
      switch (format.toLowerCase()) {
        case 'heic':
          return this.convertToHEIC(file, quality);
        case 'tiff':
          return this.convertToTIFF(file);
        case 'gif':
          return this.convertToGIF(file, quality);
        case 'bmp':
          return this.convertToBMP(file);
        case 'ico':
          return this.convertToICO(file);
        default:
          // For native formats (webp, avif, png, jpg), use optimized canvas conversion
          return this.convertWithOptimizedCanvas(file, format, quality);
      }
    } catch (error) {
      // On mobile, if conversion fails, try a fallback approach
      if (isMobile && (format === 'webp' || format === 'avif')) {
        console.log(`Mobile conversion failed for ${format}, trying JPEG fallback...`);
        try {
          return this.convertWithOptimizedCanvas(file, 'jpg', quality);
        } catch (fallbackError) {
          console.error('Mobile fallback conversion also failed:', fallbackError);
          throw new Error(`Mobile conversion failed for ${format}. Try using JPEG format instead.`);
        }
      }
      throw error;
    }
  }

  /**
   * Optimized canvas conversion with performance improvements
   */
  private static async convertWithOptimizedCanvas(file: File, format: string, quality: number): Promise<ConversionResult> {
    // Check if we're on mobile and avoid OffscreenCanvas (can cause issues on some mobile browsers)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const useOffscreenCanvas = !isMobile && typeof OffscreenCanvas !== 'undefined';
    
    // Aggressive memory management for mobile
    if (isMobile) {
      // Clear any existing object URLs
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
    
    // Use regular canvas on mobile for better compatibility
    const canvas = useOffscreenCanvas 
      ? new OffscreenCanvas(1, 1) 
      : document.createElement('canvas');
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          console.log(`Image loaded: ${img.width}x${img.height}`);
          
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Use imageSmoothingEnabled for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);
            console.log('Image drawn to canvas');
          } else {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Handle format-specific MIME types
          let mimeType: string;
          switch (format) {
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
            case 'avif':
              mimeType = 'image/avif';
              break;
            default:
              mimeType = `image/${format}`;
          }
          
          const qualityValue = format === 'png' ? undefined : quality / 100;
          console.log(`Converting to ${mimeType} with quality ${qualityValue}`);
          
          // Use convertToBlob for OffscreenCanvas or toBlob for regular canvas
          if (canvas instanceof OffscreenCanvas) {
            canvas.convertToBlob({ type: mimeType, quality: qualityValue })
              .then(blob => {
                if (blob) {
                  console.log(`Conversion successful: ${blob.size} bytes`);
                  resolve({ blob, actualFormat: format });
                } else {
                  console.error('Canvas.convertToBlob returned null');
                  reject(new Error(`Failed to convert to ${format} - no blob returned`));
                }
              })
              .catch(error => {
                console.error('Canvas.convertToBlob error:', error);
                reject(new Error(`Conversion failed: ${error.message}`));
              });
          } else {
            // For mobile, add timeout and better error handling
            const timeout = setTimeout(() => {
              console.error('Canvas.toBlob timeout on mobile');
              reject(new Error(`Conversion timeout - mobile canvas processing took too long`));
            }, isMobile ? 30000 : 15000); // Longer timeout on mobile
            
            (canvas as HTMLCanvasElement).toBlob((blob) => {
              clearTimeout(timeout);
              if (blob) {
                console.log(`Conversion successful: ${blob.size} bytes`);
                resolve({ blob, actualFormat: format });
              } else {
                console.error('Canvas.toBlob returned null');
                reject(new Error(`Failed to convert to ${format} - no blob returned`));
              }
            }, mimeType, qualityValue);
          }
        } catch (error) {
          console.error('Canvas processing error:', error);
          reject(new Error(`Canvas processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      img.onerror = (error) => {
        console.error('Image load error:', error);
        // On mobile, try to provide more specific error information
        const errorMsg = isMobile 
          ? 'Failed to load image on mobile - may be due to memory constraints or unsupported format'
          : 'Failed to load image';
        reject(new Error(errorMsg));
      };
      
      // Load image directly
      console.log('Loading image...');
      img.src = URL.createObjectURL(file);
    });
  }
}

