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
   * Convert image to any supported format
   */
  static async convertToFormat(file: File, format: string, quality: number = 85): Promise<ConversionResult> {
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
        // For native formats (webp, avif, png, jpg), use standard canvas conversion
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        return new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            const mimeType = `image/${format}`;
            const qualityValue = format === 'png' ? undefined : quality / 100;
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve({
                  blob,
                  actualFormat: format
                });
              } else {
                reject(new Error(`Failed to convert to ${format}`));
              }
            }, mimeType, qualityValue);
          };
          
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(file);
        });
    }
  }
}

