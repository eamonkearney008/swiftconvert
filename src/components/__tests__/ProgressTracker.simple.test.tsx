import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressTracker } from '../ProgressTracker';

describe('ProgressTracker', () => {
  const mockOnDownload = jest.fn();

  const createMockBatch = (overrides = {}) => ({
    id: 'test-batch',
    status: 'processing' as const,
    progress: 50,
    totalFiles: 4,
    completedFiles: 2,
    jobs: [
      {
        id: 'job-1',
        file: new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        status: 'completed' as const,
        progress: 100,
        result: { blob: new Blob(), compressedSize: 1024 },
        actualSize: 1024,
      },
      {
        id: 'job-2',
        file: new File(['test2'], 'test2.png', { type: 'image/png' }),
        status: 'completed' as const,
        progress: 100,
        result: { blob: new Blob(), compressedSize: 2048 },
        actualSize: 2048,
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    mockOnDownload.mockClear();
  });

  it('renders progress tracker for processing batch', () => {
    const batch = createMockBatch();
    render(<ProgressTracker batch={batch} onDownload={mockOnDownload} />);
    
    // Check that the component renders without crashing
    expect(screen.getByText('Batch Conversion')).toBeInTheDocument();
  });

  it('renders progress tracker for completed batch', () => {
    const batch = createMockBatch({
      status: 'completed',
      progress: 100,
      completedFiles: 4,
    });
    render(<ProgressTracker batch={batch} onDownload={mockOnDownload} />);
    
    expect(screen.getByText('Batch Conversion')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    const batch = createMockBatch();
    render(<ProgressTracker batch={batch} onDownload={mockOnDownload} className={customClass} />);
    
    // Find the root container with the custom class
    const container = document.querySelector(`.${customClass}`);
    expect(container).toBeInTheDocument();
  });
});
