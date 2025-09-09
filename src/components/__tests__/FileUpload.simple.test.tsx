import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileUpload } from '../FileUpload';

// Mock the file validation
jest.mock('@/lib/image-metadata', () => ({
  extractImageMetadata: jest.fn().mockResolvedValue({
    width: 100,
    height: 100,
    format: 'jpeg',
    size: 1024,
  }),
}));

describe('FileUpload', () => {
  const mockOnFilesSelected = jest.fn();

  beforeEach(() => {
    mockOnFilesSelected.mockClear();
  });

  it('renders the file upload component', () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    // Check that the component renders without crashing
    expect(screen.getByText(/drop your images here/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<FileUpload onFilesSelected={mockOnFilesSelected} className={customClass} />);
    
    // Find the root container with the custom class
    const container = document.querySelector(`.${customClass}`);
    expect(container).toBeInTheDocument();
  });
});
