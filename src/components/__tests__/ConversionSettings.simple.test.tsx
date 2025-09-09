import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConversionSettings } from '../ConversionSettings';

describe('ConversionSettings', () => {
  const mockOnSettingsChange = jest.fn();
  const defaultProps = {
    sourceFormat: 'jpeg' as const,
    onSettingsChange: mockOnSettingsChange,
  };

  beforeEach(() => {
    mockOnSettingsChange.mockClear();
  });

  it('renders the conversion settings component', () => {
    render(<ConversionSettings {...defaultProps} />);
    
    // Check that the component renders without crashing
    expect(screen.getByText('Conversion Presets')).toBeInTheDocument();
  });

  it('shows preset options', () => {
    render(<ConversionSettings {...defaultProps} />);
    
    expect(screen.getByText('Web Optimized')).toBeInTheDocument();
    expect(screen.getByText('Visually Lossless')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<ConversionSettings {...defaultProps} className={customClass} />);
    
    // Check that the component renders with the custom class
    const container = screen.getByText('Conversion Presets').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(container).toHaveClass(customClass);
  });
});
