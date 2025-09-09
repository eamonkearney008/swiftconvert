import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders the conversion settings form', () => {
    render(<ConversionSettings {...defaultProps} />);
    
    expect(screen.getByText('Conversion Presets')).toBeInTheDocument();
    expect(screen.getByText('Web Optimized')).toBeInTheDocument();
    expect(screen.getByText('Visually Lossless')).toBeInTheDocument();
  });

  it('shows current settings', () => {
    render(<ConversionSettings {...defaultProps} />);
    
    // Check for preset selection
    expect(screen.getByText('Web Optimized')).toBeInTheDocument();
  });

  it('calls onSettingsChange when preset is selected', async () => {
    const user = userEvent.setup();
    render(<ConversionSettings {...defaultProps} />);
    
    // Click on a different preset
    const visuallyLosslessPreset = screen.getByText('Visually Lossless');
    await user.click(visuallyLosslessPreset);
    
    expect(mockOnSettingsChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<ConversionSettings {...defaultProps} className={customClass} />);
    
    // The className is applied to the root div, not the title
    const container = screen.getByText('Conversion Presets').closest('[data-slot="card"]')?.parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('shows preset options', () => {
    render(<ConversionSettings {...defaultProps} />);
    
    expect(screen.getByText('Web Optimized')).toBeInTheDocument();
    expect(screen.getByText('Visually Lossless')).toBeInTheDocument();
    expect(screen.getByText('Smallest Size')).toBeInTheDocument();
    expect(screen.getByText('Print Quality')).toBeInTheDocument();
  });

  it('applies preset when clicked', async () => {
    const user = userEvent.setup();
    render(<ConversionSettings {...defaultProps} />);
    
    const smallestSizePreset = screen.getByText('Smallest Size');
    await user.click(smallestSizePreset);
    
    expect(mockOnSettingsChange).toHaveBeenCalled();
  });
});
