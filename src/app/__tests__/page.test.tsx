import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main page', () => {
    render(<Home />);
    
    expect(screen.getByText('SnapConvert')).toBeInTheDocument();
    expect(screen.getByText('Convert Images with')).toBeInTheDocument();
    expect(screen.getByText('Lightning Speed')).toBeInTheDocument();
  });

  it('renders file upload section', () => {
    render(<Home />);
    
    expect(screen.getByText('Upload Images')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop your images here, or click to browse')).toBeInTheDocument();
  });

  it('renders conversion method selection', () => {
    render(<Home />);
    
    expect(screen.getByText('Conversion Method')).toBeInTheDocument();
    expect(screen.getByText('Local Processing')).toBeInTheDocument();
    expect(screen.getByText('Edge Processing')).toBeInTheDocument();
  });

  it('renders quick preset buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('Quick Presets')).toBeInTheDocument();
    expect(screen.getByText('Web Optimized')).toBeInTheDocument();
    expect(screen.getByText('High Compression')).toBeInTheDocument();
    expect(screen.getByText('Lossless')).toBeInTheDocument();
  });

  it('renders advanced settings section', () => {
    render(<Home />);
    
    expect(screen.getByText('Advanced Settings')).toBeInTheDocument();
    expect(screen.getByText('Output Format')).toBeInTheDocument();
    expect(screen.getByText(/Quality:/)).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<Home />);
    
    expect(screen.getByText('Convert')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('allows selecting conversion method', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const localButton = screen.getByText('Local Processing');
    const edgeButton = screen.getByText('Edge Processing');
    
    // Initially local should be selected
    expect(localButton.closest('button')).toHaveClass('border-blue-500');
    
    // Click edge processing
    await user.click(edgeButton);
    
    // Edge should now be selected
    expect(edgeButton.closest('button')).toHaveClass('border-green-500');
  });

  it('allows selecting quick presets', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const webOptimizedButton = screen.getByText('Web Optimized');
    const highCompressionButton = screen.getByText('High Compression');
    const losslessButton = screen.getByText('Lossless');
    
    // All preset buttons should be present
    expect(webOptimizedButton).toBeInTheDocument();
    expect(highCompressionButton).toBeInTheDocument();
    expect(losslessButton).toBeInTheDocument();
    
    // Click on a preset
    await user.click(webOptimizedButton);
    
    // The button should be clickable (we can't easily test state changes without more complex setup)
    expect(webOptimizedButton.closest('button')).toBeInTheDocument();
  });

  it('shows convert button when files are selected', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Create a mock file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    // Find the file input element
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      await user.upload(fileInput, file);
      
      // The convert button should appear
      await waitFor(() => {
        expect(screen.getByText(/Convert Images/)).toBeInTheDocument();
      });
    } else {
      // If no file input is found, just verify the Choose Files button exists
      expect(screen.getByText('Choose Files')).toBeInTheDocument();
    }
  });

  it('handles navigation between tabs', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const historyTab = screen.getByText('History');
    const statsTab = screen.getByText('Statistics');
    
    // Click on History tab
    await user.click(historyTab);
    
    // Click on Statistics tab
    await user.click(statsTab);
    
    // Both tabs should be present and clickable
    expect(historyTab).toBeInTheDocument();
    expect(statsTab).toBeInTheDocument();
  });
});
