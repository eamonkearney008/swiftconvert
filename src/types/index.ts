// Core types for SnapConvert image converter

export type ImageFormat = 
  | 'jpg' 
  | 'jpeg' 
  | 'png' 
  | 'webp' 
  | 'avif' 
  | 'heic' 
  | 'heif' 
  | 'tiff' 
  | 'bmp' 
  | 'gif' 
  | 'ico'
  | 'svg';

export type ConversionPreset = 
  | 'web-optimized' 
  | 'visually-lossless' 
  | 'smallest-size' 
  | 'print';

export interface ConversionSettings {
  format: ImageFormat;
  quality?: number; // 0-100 for lossy formats
  width?: number;
  height?: number;
  preserveExif?: boolean;
  preserveColorProfile?: boolean;
  progressive?: boolean; // for JPEG
  lossless?: boolean; // for PNG/WebP
}

export interface ConversionJob {
  id: string;
  file: File;
  settings: ConversionSettings;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  result?: Blob;
  error?: string;
  estimatedSize?: number;
  actualSize?: number;
}

export interface BatchConversion {
  id: string;
  jobs: ConversionJob[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  totalFiles: number;
  completedFiles: number;
  zipResult?: Blob;
}

export interface CodecCapabilities {
  canDecode: ImageFormat[];
  canEncode: ImageFormat[];
  supportsSIMD: boolean;
  supportsThreads: boolean;
  maxFileSize: number; // bytes
}

export interface ProcessingMode {
  type: 'local' | 'edge';
  reason?: string; // why edge was chosen
}

export interface PresetDefinition {
  id: ConversionPreset;
  name: string;
  description: string;
  settings: ConversionSettings;
  targetFormats: ImageFormat[];
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: ImageFormat;
  size: number;
  hasAlpha: boolean;
  colorSpace?: string;
  hasExif: boolean;
  orientation?: number;
}

export interface ConversionResult {
  blob: Blob;
  metadata: ImageMetadata;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
}
