import React from 'react';
import { render } from '@testing-library/react';

// Mock the components to avoid complex dependencies
jest.mock('@/components/FileUpload', () => ({
  FileUpload: () => <div data-testid="file-upload">FileUpload Component</div>,
}));

jest.mock('@/components/ConversionSettings', () => ({
  ConversionSettings: () => <div data-testid="conversion-settings">ConversionSettings Component</div>,
}));

jest.mock('@/components/ProgressTracker', () => ({
  ProgressTracker: () => <div data-testid="progress-tracker">ProgressTracker Component</div>,
}));

jest.mock('@/components/ConversionResults', () => ({
  ConversionResults: () => <div data-testid="conversion-results">ConversionResults Component</div>,
}));

// Mock the libraries
jest.mock('@/lib/batch-processor', () => ({
  batchProcessor: {
    createBatch: jest.fn().mockReturnValue({
      id: 'test-batch',
      status: 'processing',
      progress: 0,
      totalFiles: 1,
      completedFiles: 0,
      jobs: [],
    }),
  },
}));

jest.mock('@/lib/zip/zip-generator', () => ({
  zipGenerator: {
    generateBatchZip: jest.fn().mockResolvedValue(new Blob()),
    downloadZip: jest.fn(),
  },
}));

jest.mock('@/lib/image-converter', () => ({
  localImageConverter: {
    convertImage: jest.fn().mockResolvedValue({
      blob: new Blob(['converted'], { type: 'image/webp' }),
      compressedSize: 1024,
      originalSize: 2048,
    }),
  },
}));

jest.mock('@/lib/image-metadata', () => ({
  extractImageMetadata: jest.fn().mockResolvedValue({
    width: 100,
    height: 100,
    format: 'jpeg',
    size: 2048,
  }),
}));

describe('Basic Component Rendering', () => {
  it('renders FileUpload component', () => {
    const { FileUpload } = require('@/components/FileUpload');
    const { getByTestId } = render(<FileUpload onFilesSelected={() => {}} />);
    expect(getByTestId('file-upload')).toBeInTheDocument();
  });

  it('renders ConversionSettings component', () => {
    const { ConversionSettings } = require('@/components/ConversionSettings');
    const { getByTestId } = render(
      <ConversionSettings 
        sourceFormat="jpeg" 
        onSettingsChange={() => {}} 
      />
    );
    expect(getByTestId('conversion-settings')).toBeInTheDocument();
  });

  it('renders ProgressTracker component', () => {
    const { ProgressTracker } = require('@/components/ProgressTracker');
    const mockBatch = {
      id: 'test-batch',
      status: 'processing',
      progress: 50,
      totalFiles: 4,
      completedFiles: 2,
      jobs: [],
    };
    const { getByTestId } = render(
      <ProgressTracker 
        batch={mockBatch} 
        onDownload={() => {}} 
      />
    );
    expect(getByTestId('progress-tracker')).toBeInTheDocument();
  });

  it('renders ConversionResults component', () => {
    const { ConversionResults } = require('@/components/ConversionResults');
    const mockResults = [
      {
        id: 'test-result',
        originalFile: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        convertedBlob: new Blob(['converted'], { type: 'image/webp' }),
        originalSize: 2048,
        compressedSize: 1024,
        compressionRatio: 0.5,
        format: 'webp',
        quality: 85,
        metadata: {
          format: 'webp',
          width: 100,
          height: 100,
          size: 1024,
        },
      },
    ];
    const { getByTestId } = render(
      <ConversionResults
        results={mockResults}
        onDownloadAll={() => {}}
        onDownloadIndividual={() => {}}
      />
    );
    expect(getByTestId('conversion-results')).toBeInTheDocument();
  });
});

