'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { PRESETS, getSuggestedFormat, getOptimalSettings, validateSettings } from '@/lib/presets';
import { ConversionSettings, ImageFormat, PresetDefinition } from '@/types';

interface ConversionSettingsProps {
  sourceFormat: ImageFormat;
  onSettingsChange: (settings: ConversionSettings) => void;
  className?: string;
}

const FORMAT_OPTIONS: { value: ImageFormat; label: string; description: string }[] = [
  { value: 'webp', label: 'WebP', description: 'Modern web format with excellent compression' },
  { value: 'avif', label: 'AVIF', description: 'Next-gen format with superior compression' },
  { value: 'jpg', label: 'JPEG', description: 'Universal compatibility, good compression' },
  { value: 'png', label: 'PNG', description: 'Lossless with transparency support' },
  { value: 'tiff', label: 'TIFF', description: 'High quality for professional use' },
];

export function ConversionSettings({
  sourceFormat,
  onSettingsChange,
  className = ''
}: ConversionSettingsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('web-optimized');
  const [customSettings, setCustomSettings] = useState<ConversionSettings>(() => {
    // Initialize with the default preset settings
    const preset = PRESETS['web-optimized'];
    return preset ? { ...preset.settings } : {
      format: getSuggestedFormat(sourceFormat),
      quality: 85,
      preserveExif: false,
      preserveColorProfile: false,
    };
  });
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Component is now completely useEffect-free to prevent infinite re-renders
  // Chrome-specific fix: Force component to re-render cleanly

  // Notify parent of settings changes
  const notifySettingsChange = (settings: any) => {
    onSettingsChange(settings);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setIsCustomMode(false);
    // Update local settings and notify parent
    const preset = PRESETS[presetId];
    if (preset) {
      const newSettings = { ...preset.settings };
      setCustomSettings(newSettings);
      // Validate and update errors
      const errors = validateSettings(newSettings);
      setValidationErrors(errors);
      notifySettingsChange(newSettings);
    }
  };

  const handleCustomModeToggle = () => {
    const newIsCustomMode = !isCustomMode;
    setIsCustomMode(newIsCustomMode);
    if (!isCustomMode) {
      // Switch to custom mode - keep current settings
      setCustomSettings(prev => ({ ...prev }));
      // Validate and update errors
      const errors = validateSettings(customSettings);
      setValidationErrors(errors);
      // Notify parent of current custom settings
      notifySettingsChange(customSettings);
    } else {
      // Switch back to preset mode
      const preset = PRESETS[selectedPreset];
      if (preset) {
        const newSettings = { ...preset.settings };
        setCustomSettings(newSettings);
        // Validate and update errors
        const errors = validateSettings(newSettings);
        setValidationErrors(errors);
        notifySettingsChange(newSettings);
      }
    }
  };

  const handleFormatChange = (format: ImageFormat) => {
    const optimalSettings = getOptimalSettings(sourceFormat, format);
    const newSettings = {
      ...customSettings,
      format,
      ...optimalSettings,
    };
    setCustomSettings(newSettings);
    // Validate and update errors
    const errors = validateSettings(newSettings);
    setValidationErrors(errors);
    notifySettingsChange(newSettings);
  };

  const handleQualityChange = (value: number[]) => {
    const newSettings = {
      ...customSettings,
      quality: value[0],
    };
    setCustomSettings(newSettings);
    // Validate and update errors
    const errors = validateSettings(newSettings);
    setValidationErrors(errors);
    notifySettingsChange(newSettings);
  };

  const handleDimensionChange = (field: 'width' | 'height', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    const newSettings = {
      ...customSettings,
      [field]: numValue,
    };
    setCustomSettings(newSettings);
    // Validate and update errors
    const errors = validateSettings(newSettings);
    setValidationErrors(errors);
    notifySettingsChange(newSettings);
  };

  const handleBooleanChange = (field: keyof ConversionSettings, value: boolean) => {
    const newSettings = {
      ...customSettings,
      [field]: value,
    };
    setCustomSettings(newSettings);
    // Validate and update errors
    const errors = validateSettings(newSettings);
    setValidationErrors(errors);
    notifySettingsChange(newSettings);
  };

  const getFormatDescription = (format: ImageFormat): string => {
    const option = FORMAT_OPTIONS.find(opt => opt.value === format);
    return option?.description || '';
  };

  const isLosslessFormat = (format: ImageFormat): boolean => {
    return ['png', 'tiff'].includes(format);
  };

  const supportsQuality = (format: ImageFormat): boolean => {
    return !isLosslessFormat(format);
  };

  const supportsProgressive = (format: ImageFormat): boolean => {
    return format === 'jpg' || format === 'jpeg';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Preset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Conversion Presets
            <Button
              variant={isCustomMode ? "default" : "outline"}
              size="sm"
              onClick={handleCustomModeToggle}
            >
              {isCustomMode ? 'Use Preset' : 'Custom Settings'}
            </Button>
          </CardTitle>
          <CardDescription>
            Choose a preset or customize your conversion settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCustomMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(PRESETS).map((preset) => (
                <div
                  key={preset.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPreset === preset.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{preset.name}</h3>
                    <Badge variant="secondary">
                      {preset.settings.format.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {preset.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {preset.targetFormats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select
                  value={customSettings.format}
                  onValueChange={handleFormatChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {getFormatDescription(customSettings.format)}
                </p>
              </div>

              {/* Quality Slider */}
              {supportsQuality(customSettings.format) && (
                <div className="space-y-2">
                  <Label htmlFor="quality">
                    Quality: {customSettings.quality}%
                  </Label>
                  <Slider
                    value={[customSettings.quality || 85]}
                    onValueChange={handleQualityChange}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Smallest file</span>
                    <span>Best quality</span>
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={customSettings.width || ''}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customSettings.height || ''}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preserve-exif">Preserve EXIF Data</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Keep camera metadata and orientation
                    </p>
                  </div>
                  <Switch
                    id="preserve-exif"
                    checked={customSettings.preserveExif || false}
                    onCheckedChange={(value) => handleBooleanChange('preserveExif', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preserve-color-profile">Preserve Color Profile</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Keep embedded color space information
                    </p>
                  </div>
                  <Switch
                    id="preserve-color-profile"
                    checked={customSettings.preserveColorProfile || false}
                    onCheckedChange={(value) => handleBooleanChange('preserveColorProfile', value)}
                  />
                </div>

                {supportsProgressive(customSettings.format) && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progressive">Progressive JPEG</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Better loading experience for large images
                      </p>
                    </div>
                    <Switch
                      id="progressive"
                      checked={customSettings.progressive || false}
                      onCheckedChange={(value) => handleBooleanChange('progressive', value)}
                    />
                  </div>
                )}

                {isLosslessFormat(customSettings.format) && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lossless">Lossless Compression</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No quality loss during compression
                      </p>
                    </div>
                    <Switch
                      id="lossless"
                      checked={customSettings.lossless || false}
                      onCheckedChange={(value) => handleBooleanChange('lossless', value)}
                    />
                  </div>
                )}
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Settings Validation Errors:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
