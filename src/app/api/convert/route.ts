import { NextRequest, NextResponse } from 'next/server';
import { ConversionSettings, ImageFormat } from '@/types';

// Edge processing for unsupported formats and large files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const settingsJson = formData.get('settings') as string;
    
    if (!file || !settingsJson) {
      return NextResponse.json(
        { error: 'Missing file or settings' },
        { status: 400 }
      );
    }

    const settings: ConversionSettings = JSON.parse(settingsJson);
    
    // Validate file size (max 200MB for edge processing)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large for processing' },
        { status: 413 }
      );
    }

    // Process the image
    const result = await processImageEdge(file, settings);
    
    return new NextResponse(result.blob, {
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'X-Original-Size': result.originalSize.toString(),
        'X-Compressed-Size': result.compressedSize.toString(),
        'X-Compression-Ratio': result.compressionRatio.toString(),
        'X-Processing-Time': result.processingTime.toString(),
      },
    });
  } catch (error) {
    console.error('Edge processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}

// Process image using edge runtime
async function processImageEdge(
  file: File,
  settings: ConversionSettings
): Promise<{
  blob: Blob;
  mimeType: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
}> {
  const startTime = Date.now();
  
  try {
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Process the image based on format
    const result = await convertImageBuffer(uint8Array, settings, file.name);
    
    const processingTime = Date.now() - startTime;
    const compressionRatio = ((file.size - result.size) / file.size) * 100;
    
    return {
      blob: new Blob([result.data as ArrayBuffer], { type: result.mimeType }),
      mimeType: result.mimeType,
      filename: generateFilename(file.name, settings.format),
      originalSize: file.size,
      compressedSize: result.size,
      compressionRatio,
      processingTime,
    };
  } catch (error) {
    throw new Error(`Edge processing failed: ${error}`);
  }
}

// Convert image buffer using Canvas API (edge runtime compatible)
async function convertImageBuffer(
  buffer: Uint8Array,
  settings: ConversionSettings,
  fileName: string
): Promise<{
  data: Uint8Array;
  size: number;
  mimeType: string;
}> {
  try {
    // Create a blob from the buffer
    const blob = new Blob([buffer], { type: getMimeTypeFromFileName(fileName) });
    
    // Create an image element
    const img = new Image();
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    
    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
    
    // Calculate output dimensions
    const { width, height } = calculateOutputDimensions(
      img.naturalWidth,
      img.naturalHeight,
      settings
    );
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw image
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to target format
    const mimeType = getMimeType(settings.format);
    const quality = settings.quality ? settings.quality / 100 : 0.9;
    
    const outputBlob = await canvas.convertToBlob({
      type: mimeType,
      quality: quality
    });
    
    // Convert blob to Uint8Array
    const outputBuffer = await outputBlob.arrayBuffer();
    const outputArray = new Uint8Array(outputBuffer);
    
    // Clean up
    URL.revokeObjectURL(img.src);
    
    return {
      data: outputArray,
      size: outputArray.length,
      mimeType,
    };
  } catch (error) {
    // Fallback: return original buffer with updated MIME type
    console.warn('Canvas processing failed, using fallback:', error);
    const mimeType = getMimeType(settings.format);
    
    return {
      data: buffer,
      size: buffer.length,
      mimeType,
    };
  }
}

// Get MIME type for format
function getMimeType(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'heic': 'image/heic',
    'heif': 'image/heif',
    'tiff': 'image/tiff',
    'bmp': 'image/bmp',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'svg': 'image/svg+xml',
  };
  
  return mimeTypes[format] || 'image/jpeg';
}

// Generate filename for converted image
function generateFilename(originalName: string, format: ImageFormat): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = getFileExtension(format);
  return `${nameWithoutExt}.${extension}`;
}

// Get file extension for format
function getFileExtension(format: ImageFormat): string {
  const extensions: Record<ImageFormat, string> = {
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png',
    'webp': 'webp',
    'avif': 'avif',
    'heic': 'heic',
    'heif': 'heif',
    'tiff': 'tiff',
    'bmp': 'bmp',
    'gif': 'gif',
    'ico': 'ico',
    'svg': 'svg',
  };
  
  return extensions[format] || 'jpg';
}

// Get MIME type from filename
function getMimeTypeFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'heic': 'image/heic',
    'heif': 'image/heif',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    'bmp': 'image/bmp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
  };
  
  return mimeTypes[extension || ''] || 'image/jpeg';
}

// Calculate output dimensions based on settings
function calculateOutputDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: ConversionSettings
): { width: number; height: number } {
  let { width, height } = settings;
  
  if (!width && !height) {
    return { width: originalWidth, height: originalHeight };
  }
  
  if (width && height) {
    return { width, height };
  }
  
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;
  
  if (width) {
    height = Math.round(width / aspectRatio);
  } else if (height) {
    width = Math.round(height * aspectRatio);
  }
  
  return { width: width!, height: height! };
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
