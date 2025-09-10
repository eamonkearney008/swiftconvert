'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { MobileSlider } from '@/components/ui/mobile-slider';
import { 
  Settings, 
  Zap,
  Download,
  Eye,
  Save,
  Loader2
} from 'lucide-react';
import { ConversionSettings, ImageFormat } from '@/types';

interface SimpleAdvancedSettingsProps {
  sourceFormat: ImageFormat;
  onSettingsChange: (settings: ConversionSettings) => void;
  selectedFilters: Array<{
    filterId: string;
    parameters: Record<string, any>;
    enabled: boolean;
  }>;
  onFiltersChange: (filters: Array<{
    filterId: string;
    parameters: Record<string, any>;
    enabled: boolean;
  }>) => void;
  smartOptimization: {
    enabled: boolean;
    adaptiveQuality: boolean;
    formatOptimization: boolean;
    dimensionOptimization: boolean;
  };
  onSmartOptimizationChange: (optimization: {
    enabled: boolean;
    adaptiveQuality: boolean;
    formatOptimization: boolean;
    dimensionOptimization: boolean;
  }) => void;
  batchOptimization: {
    enabled: boolean;
    parallelProcessing: boolean;
    memoryOptimization: boolean;
    priorityOrder: 'quality' | 'speed' | 'size';
    smartBatching: boolean;
  };
  onBatchOptimizationChange: (optimization: {
    enabled: boolean;
    parallelProcessing: boolean;
    memoryOptimization: boolean;
    priorityOrder: 'quality' | 'speed' | 'size';
    smartBatching: boolean;
  }) => void;
  metadataOptions: {
    extractEXIF: boolean;
    extractColorProfile: boolean;
    extractDominantColors: boolean;
    extractHistogram: boolean;
    preserveEXIF: boolean;
    preserveColorProfile: boolean;
    stripMetadata: boolean;
  };
  onMetadataOptionsChange: (options: {
    extractEXIF: boolean;
    extractColorProfile: boolean;
    extractDominantColors: boolean;
    extractHistogram: boolean;
    preserveEXIF: boolean;
    preserveColorProfile: boolean;
    stripMetadata: boolean;
  }) => void;
  className?: string;
}

export function SimpleAdvancedSettings({
  sourceFormat,
  onSettingsChange,
  selectedFilters,
  onFiltersChange,
  smartOptimization,
  onSmartOptimizationChange,
  batchOptimization,
  onBatchOptimizationChange,
  metadataOptions,
  onMetadataOptionsChange,
  className = ''
}: SimpleAdvancedSettingsProps) {
  const [customSettings, setCustomSettings] = useState<ConversionSettings>({
    format: 'webp',
    quality: 85,
    preserveExif: false,
    preserveColorProfile: false,
  });

  useEffect(() => {
    onSettingsChange(customSettings);
  }, [customSettings, onSettingsChange]);

  const handleCustomSettingsChange = (newSettings: ConversionSettings) => {
    setCustomSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Conversion Settings
          </CardTitle>
          <CardDescription>
            Configure the basic conversion parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select
                value={customSettings.format}
                onValueChange={(value) => handleCustomSettingsChange({
                  ...customSettings,
                  format: value as any
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="avif">AVIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Quality: {customSettings.quality}%</Label>
              {/* Use MobileSlider on mobile devices */}
              <div className="block md:hidden mt-2">
                <MobileSlider
                  value={[customSettings.quality]}
                  onValueChange={([value]) => handleCustomSettingsChange({
                    ...customSettings,
                    quality: value
                  })}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              {/* Use regular Slider on desktop */}
              <div className="hidden md:block mt-2">
                <Slider
                  value={[customSettings.quality]}
                  onValueChange={([value]) => handleCustomSettingsChange({
                    ...customSettings,
                    quality: value
                  })}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Preserve EXIF</Label>
              <Switch
                checked={customSettings.preserveExif}
                onCheckedChange={(checked) => handleCustomSettingsChange({
                  ...customSettings,
                  preserveExif: checked
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Preserve Color Profile</Label>
              <Switch
                checked={customSettings.preserveColorProfile}
                onCheckedChange={(checked) => handleCustomSettingsChange({
                  ...customSettings,
                  preserveColorProfile: checked
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Smart Optimization
          </CardTitle>
          <CardDescription>
            Automatically optimize settings based on image properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Smart Optimization</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automatically adjust quality and format based on image content
              </p>
            </div>
            <Switch
              checked={smartOptimization.enabled}
              onCheckedChange={(checked) => 
                onSmartOptimizationChange({ ...smartOptimization, enabled: checked })
              }
            />
          </div>
          
          {smartOptimization.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <Label>Adaptive Quality</Label>
                <Switch
                  checked={smartOptimization.adaptiveQuality}
                  onCheckedChange={(checked) => 
                    onSmartOptimizationChange({ ...smartOptimization, adaptiveQuality: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Format Optimization</Label>
                <Switch
                  checked={smartOptimization.formatOptimization}
                  onCheckedChange={(checked) => 
                    onSmartOptimizationChange({ ...smartOptimization, formatOptimization: checked })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Batch Processing
          </CardTitle>
          <CardDescription>
            Optimize processing for multiple files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Batch Optimization</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Process multiple files efficiently
              </p>
            </div>
            <Switch
              checked={batchOptimization.enabled}
              onCheckedChange={(checked) => 
                onBatchOptimizationChange({ ...batchOptimization, enabled: checked })
              }
            />
          </div>
          
          {batchOptimization.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <Label>Parallel Processing</Label>
                <Switch
                  checked={batchOptimization.parallelProcessing}
                  onCheckedChange={(checked) => 
                    onBatchOptimizationChange({ ...batchOptimization, parallelProcessing: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Memory Optimization</Label>
                <Switch
                  checked={batchOptimization.memoryOptimization}
                  onCheckedChange={(checked) => 
                    onBatchOptimizationChange({ ...batchOptimization, memoryOptimization: checked })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Metadata Options
          </CardTitle>
          <CardDescription>
            Control how image metadata is handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Preserve EXIF</Label>
              <Switch
                checked={metadataOptions.preserveEXIF}
                onCheckedChange={(checked) => 
                  onMetadataOptionsChange({ ...metadataOptions, preserveEXIF: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Preserve Color Profile</Label>
              <Switch
                checked={metadataOptions.preserveColorProfile}
                onCheckedChange={(checked) => 
                  onMetadataOptionsChange({ ...metadataOptions, preserveColorProfile: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Extract EXIF Data</Label>
              <Switch
                checked={metadataOptions.extractEXIF}
                onCheckedChange={(checked) => 
                  onMetadataOptionsChange({ ...metadataOptions, extractEXIF: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Strip All Metadata</Label>
              <Switch
                checked={metadataOptions.stripMetadata}
                onCheckedChange={(checked) => 
                  onMetadataOptionsChange({ ...metadataOptions, stripMetadata: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

