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
    
    // For HEIC/HEIF files, we would use a specialized library
    // For now, we'll implement basic format conversion using Canvas API
    const result = await convertImageBuffer(uint8Array, settings);
    
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

// Convert image buffer (simplified implementation)
async function convertImageBuffer(
  buffer: Uint8Array,
  settings: ConversionSettings
): Promise<{
  data: Uint8Array;
  size: number;
  mimeType: string;
}> {
  // This is a simplified implementation
  // In a real application, you would use specialized libraries like:
  // - sharp (Node.js)
  // - libheif (for HEIC/HEIF)
  // - ImageMagick
  // - Or other image processing libraries
  
  // For now, we'll return the original buffer with updated MIME type
  const mimeType = getMimeType(settings.format);
  
  return {
    data: buffer,
    size: buffer.length,
    mimeType,
  };
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

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
