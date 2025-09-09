import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders the file upload area', () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    expect(screen.getByText(/drop your images here/i)).toBeInTheDocument();
    expect(screen.getByText(/supports.*jpg.*png.*webp/i)).toBeInTheDocument();
  });

  it('handles file input change', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simulate file input change
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      await user.upload(input, file);
      expect(mockOnFilesSelected).toHaveBeenCalledWith([file]);
    }
  });

  it('handles drag and drop', async () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    // The drop zone is the Card component, not a button
    const dropZone = screen.getByText(/drop your images here/i).closest('[data-slot="card"]');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    if (dropZone) {
      fireEvent.dragEnter(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(dropZone).toHaveClass('border-blue-400', 'bg-blue-50');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(mockOnFilesSelected).toHaveBeenCalledWith([file]);
    }
  });

  it('shows drag active state', () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    const dropZone = screen.getByText(/drop your images here/i).closest('[data-slot="card"]');
    
    if (dropZone) {
      fireEvent.dragEnter(dropZone);
      expect(dropZone).toHaveClass('border-blue-400', 'bg-blue-50');
      
      fireEvent.dragLeave(dropZone);
      expect(dropZone).not.toHaveClass('border-blue-400', 'bg-blue-50');
    }
  });

  it('validates file types', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    // Use the hidden file input directly
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      await user.upload(input, invalidFile);
      expect(mockOnFilesSelected).not.toHaveBeenCalled();
    }
  });

  it('handles multiple files', async () => {
    const user = userEvent.setup();
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    
    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['test2'], 'test2.png', { type: 'image/png' });
    
    // Use the hidden file input directly
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      await user.upload(input, [file1, file2]);
      expect(mockOnFilesSelected).toHaveBeenCalledWith([file1, file2]);
    }
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(<FileUpload onFilesSelected={mockOnFilesSelected} className={customClass} />);
    
    // Check if the custom class is applied to the root div
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass('space-y-4', customClass);
  });
});
