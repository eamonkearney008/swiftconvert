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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Filter, 
  Image as ImageIcon,
  Zap,
  Download,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  Loader2
} from 'lucide-react';
// Dynamic imports to avoid SSR issues
import { ConversionSettings, ImageFormat } from '@/types';

interface AdvancedConversionSettingsProps {
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
    priorityOrder: 'size' | 'quality' | 'format' | 'name';
    smartBatching: boolean;
  };
  onBatchOptimizationChange: (optimization: {
    enabled: boolean;
    parallelProcessing: boolean;
    memoryOptimization: boolean;
    priorityOrder: 'size' | 'quality' | 'format' | 'name';
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

export function AdvancedConversionSettings({
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
}: AdvancedConversionSettingsProps) {
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>('web-optimized');
  const [customSettings, setCustomSettings] = useState<ConversionSettings>({
    format: 'webp',
    quality: 85,
    preserveExif: false,
    preserveColorProfile: false,
  });
  const [selectedFilterPreset, setSelectedFilterPreset] = useState<string>('');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [presets, setPresets] = useState<any[]>([]);
  const [filterPresets, setFilterPresets] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  // Load advanced features dynamically
  useEffect(() => {
    const loadAdvancedFeatures = async () => {
      try {
        const [
          { advancedPresetsManager },
          { imageFiltersManager }
        ] = await Promise.all([
          import('@/lib/advanced-presets'),
          import('@/lib/image-filters')
        ]);
        
        setPresets(advancedPresetsManager.getAllPresets());
        setFilterPresets(imageFiltersManager.getAllPresets());
        setFilters(imageFiltersManager.getAllFilters());
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load advanced features:', error);
      }
    };

    loadAdvancedFeatures();
  }, []);

  useEffect(() => {
    // Initialize with default preset when loaded
    if (isLoaded && presets.length > 0) {
      const defaultPreset = presets.find(p => p.id === 'web-optimized');
      if (defaultPreset) {
        setCustomSettings(defaultPreset.settings);
        onSettingsChange(defaultPreset.settings);
      }
    }
  }, [isLoaded, presets, onSettingsChange]);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setCustomSettings(preset.settings);
      onSettingsChange(preset.settings);
    }
  };

  const handleCustomSettingsChange = (newSettings: ConversionSettings) => {
    setCustomSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleFilterToggle = (filterId: string) => {
    const existingFilter = selectedFilters.find(f => f.filterId === filterId);
    if (existingFilter) {
      onFiltersChange(selectedFilters.filter(f => f.filterId !== filterId));
    } else {
      const filter = filters.find(f => f.id === filterId);
      if (filter) {
        const defaultParams: Record<string, any> = {};
        filter.parameters.forEach((param: any) => {
          defaultParams[param.id] = param.defaultValue;
        });
        
        onFiltersChange([...selectedFilters, {
          filterId,
          parameters: defaultParams,
          enabled: true,
        }]);
      }
    }
  };

  const handleFilterParameterChange = (filterId: string, parameterId: string, value: any) => {
    onFiltersChange(selectedFilters.map(filter => 
      filter.filterId === filterId 
        ? { ...filter, parameters: { ...filter.parameters, [parameterId]: value } }
        : filter
    ));
  };

  const handleFilterPresetSelect = (presetId: string) => {
    setSelectedFilterPreset(presetId);
    const preset = filterPresets.find(p => p.id === presetId);
    if (preset) {
      onFiltersChange(preset.filters);
    }
  };

  const handleCreateCustomPreset = async () => {
    if (!newPresetName.trim()) return;
    
    setIsCreatingPreset(true);
    try {
      const { advancedPresetsManager } = await import('@/lib/advanced-presets');
      const preset = advancedPresetsManager.createCustomPreset(
        newPresetName,
        newPresetDescription,
        customSettings,
        'custom',
        ['custom', 'user-created']
      );
      
      setNewPresetName('');
      setNewPresetDescription('');
      setSelectedPreset(preset.id);
      
      // Refresh presets list
      setPresets(advancedPresetsManager.getAllPresets());
    } catch (error) {
      console.error('Failed to create preset:', error);
    } finally {
      setIsCreatingPreset(false);
    }
  };

  const handleSmartOptimizationToggle = (enabled: boolean) => {
    onSmartOptimizationChange({ ...smartOptimization, enabled });
  };

  const handleBatchOptimizationToggle = (enabled: boolean) => {
    onBatchOptimizationChange({ ...batchOptimization, enabled });
  };

  const renderPresetCard = (preset: AdvancedPreset) => (
    <Card 
      key={preset.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedPreset === preset.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => handlePresetSelect(preset.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{preset.name}</h4>
          <Badge variant="outline">{preset.category}</Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {preset.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{preset.settings.format.toUpperCase()}</span>
          <span>•</span>
          <span>{preset.settings.quality}% quality</span>
          {preset.settings.preserveExif && <span>• EXIF</span>}
        </div>
      </CardContent>
    </Card>
  );

  const renderFilterCard = (filter: ImageFilter) => {
    const isSelected = selectedFilters.some(f => f.filterId === filter.id);
    const selectedFilter = selectedFilters.find(f => f.filterId === filter.id);
    
    return (
      <Card 
        key={filter.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => handleFilterToggle(filter.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{filter.name}</h4>
            <Badge variant="outline">{filter.category}</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            {filter.description}
          </p>
          
          {isSelected && selectedFilter && (
            <div className="space-y-2">
              {filter.parameters.map(param => (
                <div key={param.id}>
                  <Label className="text-xs">{param.name}</Label>
                  {param.type === 'range' && (
                    <Slider
                      value={[selectedFilter.parameters[param.id] || param.defaultValue]}
                      onValueChange={([value]) => handleFilterParameterChange(filter.id, param.id, value)}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      className="mt-1"
                    />
                  )}
                  {param.type === 'select' && (
                    <Select
                      value={selectedFilter.parameters[param.id] || param.defaultValue}
                      onValueChange={(value) => handleFilterParameterChange(filter.id, param.id, value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className={`${className} relative z-10`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Advanced Conversion Settings
        </CardTitle>
        <CardDescription>
          Fine-tune your image conversion with advanced presets, filters, and optimization options
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading advanced features...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map(renderPresetCard)}
            </div>
            
            {/* Create Custom Preset */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Custom Preset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preset-name">Preset Name</Label>
                    <Input
                      id="preset-name"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="My Custom Preset"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description</Label>
                    <Input
                      id="preset-description"
                      value={newPresetDescription}
                      onChange={(e) => setNewPresetDescription(e.target.value)}
                      placeholder="Description of this preset"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCreateCustomPreset}
                  disabled={!newPresetName.trim() || isCreatingPreset}
                  className="w-full"
                >
                  {isCreatingPreset ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Preset
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            {/* Filter Presets */}
            <div>
              <Label>Filter Presets</Label>
              <Select value={selectedFilterPreset} onValueChange={handleFilterPresetSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter preset" />
                </SelectTrigger>
                <SelectContent>
                  {filterPresets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Individual Filters */}
            <div>
              <Label>Individual Filters</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filters.map(renderFilterCard)}
              </div>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-4">
            {/* Smart Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Smart Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Smart Optimization</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatically optimize settings based on image properties
                    </p>
                  </div>
                  <Switch
                    checked={smartOptimization.enabled}
                    onCheckedChange={handleSmartOptimizationToggle}
                  />
                </div>
                
                {smartOptimization.enabled && (
                  <div className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label>Dimension Optimization</Label>
                      <Switch
                        checked={smartOptimization.dimensionOptimization}
                        onCheckedChange={(checked) => 
                          onSmartOptimizationChange({ ...smartOptimization, dimensionOptimization: checked })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Batch Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Batch Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Batch Optimization</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Optimize processing for multiple files
                    </p>
                  </div>
                  <Switch
                    checked={batchOptimization.enabled}
                    onCheckedChange={handleBatchOptimizationToggle}
                  />
                </div>
                
                {batchOptimization.enabled && (
                  <div className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label>Smart Batching</Label>
                      <Switch
                        checked={batchOptimization.smartBatching}
                        onCheckedChange={(checked) => 
                          onBatchOptimizationChange({ ...batchOptimization, smartBatching: checked })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Extract EXIF Data</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Extract camera and photo metadata
                  </p>
                </div>
                <Switch
                  checked={metadataOptions.extractEXIF}
                  onCheckedChange={(checked) => 
                    onMetadataOptionsChange({ ...metadataOptions, extractEXIF: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Extract Color Profile</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Extract embedded color profile information
                  </p>
                </div>
                <Switch
                  checked={metadataOptions.extractColorProfile}
                  onCheckedChange={(checked) => 
                    onMetadataOptionsChange({ ...metadataOptions, extractColorProfile: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preserve EXIF Data</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Keep EXIF data in converted images
                  </p>
                </div>
                <Switch
                  checked={metadataOptions.preserveEXIF}
                  onCheckedChange={(checked) => 
                    onMetadataOptionsChange({ ...metadataOptions, preserveEXIF: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preserve Color Profile</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Keep color profile in converted images
                  </p>
                </div>
                <Switch
                  checked={metadataOptions.preserveColorProfile}
                  onCheckedChange={(checked) => 
                    onMetadataOptionsChange({ ...metadataOptions, preserveColorProfile: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Strip All Metadata</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Remove all metadata from converted images
                  </p>
                </div>
                <Switch
                  checked={metadataOptions.stripMetadata}
                  onCheckedChange={(checked) => 
                    onMetadataOptionsChange({ ...metadataOptions, stripMetadata: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
