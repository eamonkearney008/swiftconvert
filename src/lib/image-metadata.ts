import { ImageMetadata, ImageFormat } from '@/types';

// EXIF data structure for basic metadata extraction
interface ExifData {
  orientation?: number;
  colorSpace?: string;
  hasColorProfile?: boolean;
  [key: string]: any;
}

/**
 * Extract image metadata from a File object
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      try {
        const format = getImageFormat(file.name, file.type);
        const metadata: ImageMetadata = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          format,
          size: file.size,
          hasAlpha: hasAlphaChannel(format, img),
          hasExif: false, // Will be updated if EXIF data is found
        };

        // Clean up object URL
        URL.revokeObjectURL(url);
        
        // Try to extract EXIF data
        extractExifData(file).then(exifData => {
          if (exifData) {
            metadata.orientation = exifData.orientation;
            metadata.colorSpace = exifData.colorSpace;
            metadata.hasExif = true;
          }
          resolve(metadata);
        }).catch(() => {
          // If EXIF extraction fails, continue with basic metadata
          resolve(metadata);
        });
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to extract metadata: ${error}`));
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
 * Get image format from filename and MIME type
 */
function getImageFormat(filename: string, mimeType: string): ImageFormat {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  // Map extensions to formats
  const extensionMap: Record<string, ImageFormat> = {
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

  // Map MIME types to formats
  const mimeMap: Record<string, ImageFormat> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/tiff': 'tiff',
    'image/bmp': 'bmp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };

  // Try extension first, then MIME type
  if (extension && extensionMap[extension]) {
    return extensionMap[extension];
  }
  
  if (mimeMap[mimeType]) {
    return mimeMap[mimeType];
  }

  // Default to jpg if unknown
  return 'jpg';
}

/**
 * Check if image format supports alpha channel
 */
function hasAlphaChannel(format: ImageFormat, img: HTMLImageElement): boolean {
  const alphaFormats: ImageFormat[] = ['png', 'webp', 'gif', 'svg'];
  
  if (alphaFormats.includes(format)) {
    return true;
  }

  // For other formats, we could check the canvas for transparency
  // but this is a simplified implementation
  return false;
}

/**
 * Extract EXIF data from image file
 */
async function extractExifData(file: File): Promise<ExifData | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    
    // Check for JPEG EXIF marker
    if (file.type === 'image/jpeg' || file.name.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      return extractJpegExif(dataView);
    }
    
    // Check for PNG metadata
    if (file.type === 'image/png' || file.name.toLowerCase().match(/\.png$/)) {
      return extractPngMetadata(dataView);
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to extract EXIF data:', error);
    return null;
  }
}

/**
 * Extract EXIF data from JPEG files
 */
function extractJpegExif(dataView: DataView): ExifData | null {
  try {
    // Look for EXIF marker (0xFFE1)
    for (let i = 0; i < dataView.byteLength - 1; i++) {
      if (dataView.getUint16(i) === 0xFFE1) {
        const exifData = parseExifSegment(dataView, i + 2);
        if (exifData) {
          return exifData;
        }
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to parse JPEG EXIF:', error);
    return null;
  }
}

/**
 * Parse EXIF segment data
 */
function parseExifSegment(dataView: DataView, offset: number): ExifData | null {
  try {
    // Skip APP1 marker and length
    const segmentLength = dataView.getUint16(offset);
    offset += 2;
    
    // Check for EXIF header
    const exifHeader = String.fromCharCode(
      dataView.getUint8(offset),
      dataView.getUint8(offset + 1),
      dataView.getUint8(offset + 2),
      dataView.getUint8(offset + 3)
    );
    
    if (exifHeader !== 'Exif') {
      return null;
    }
    
    offset += 6; // Skip EXIF header and padding
    
    // Parse TIFF header
    const tiffHeader = dataView.getUint16(offset);
    const isLittleEndian = tiffHeader === 0x4949; // II for little endian
    offset += 2;
    
    // Get IFD offset
    const ifdOffset = isLittleEndian 
      ? dataView.getUint32(offset, true)
      : dataView.getUint32(offset, false);
    
    // Parse IFD for orientation
    const orientation = parseOrientation(dataView, offset + ifdOffset, isLittleEndian);
    
    return {
      orientation: orientation || 1,
      colorSpace: 'sRGB', // Default assumption
      hasColorProfile: false,
    };
  } catch (error) {
    console.warn('Failed to parse EXIF segment:', error);
    return null;
  }
}

/**
 * Parse orientation from IFD
 */
function parseOrientation(dataView: DataView, ifdOffset: number, isLittleEndian: boolean): number | null {
  try {
    const entryCount = isLittleEndian
      ? dataView.getUint16(ifdOffset, true)
      : dataView.getUint16(ifdOffset, false);
    
    for (let i = 0; i < entryCount; i++) {
      const entryOffset = ifdOffset + 2 + (i * 12);
      const tag = isLittleEndian
        ? dataView.getUint16(entryOffset, true)
        : dataView.getUint16(entryOffset, false);
      
      // Orientation tag is 0x0112
      if (tag === 0x0112) {
        const value = isLittleEndian
          ? dataView.getUint16(entryOffset + 8, true)
          : dataView.getUint16(entryOffset + 8, false);
        return value;
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to parse orientation:', error);
    return null;
  }
}

/**
 * Extract metadata from PNG files
 */
function extractPngMetadata(dataView: DataView): ExifData | null {
  try {
    // Check PNG signature
    if (dataView.getUint32(0) !== 0x89504E47) {
      return null;
    }
    
    // Look for color space information in chunks
    let offset = 8; // Skip PNG signature
    
    while (offset < dataView.byteLength - 8) {
      const chunkLength = dataView.getUint32(offset);
      const chunkType = String.fromCharCode(
        dataView.getUint8(offset + 4),
        dataView.getUint8(offset + 5),
        dataView.getUint8(offset + 6),
        dataView.getUint8(offset + 7)
      );
      
      // Check for sRGB chunk
      if (chunkType === 'sRGB') {
        return {
          colorSpace: 'sRGB',
          hasColorProfile: true,
        };
      }
      
      // Check for iCCP chunk (ICC profile)
      if (chunkType === 'iCCP') {
        return {
          colorSpace: 'ICC',
          hasColorProfile: true,
        };
      }
      
      offset += 12 + chunkLength; // Move to next chunk
    }
    
    return {
      colorSpace: 'sRGB', // Default for PNG
      hasColorProfile: false,
    };
  } catch (error) {
    console.warn('Failed to parse PNG metadata:', error);
    return null;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 200 * 1024 * 1024; // 200MB
  const supportedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/avif',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/bmp',
    'image/gif',
    'image/svg+xml'
  ];
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(1)}MB)`
    };
  }
  
  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}`
    };
  }
  
  return { valid: true };
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize) * 100;
}

