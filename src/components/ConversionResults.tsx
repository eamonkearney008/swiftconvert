'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Eye, 
  EyeOff, 
  FileImage, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Zap,
  HardDrive
} from 'lucide-react';
import { ConversionResult, ImageMetadata } from '@/types';
import { formatFileSize, calculateCompressionRatio } from '@/lib/image-metadata';

interface ConversionResultsProps {
  results: ConversionResult[];
  onDownloadAll?: () => void;
  onDownloadIndividual?: (result: ConversionResult, index: number) => void;
  className?: string;
}

export function ConversionResults({
  results,
  onDownloadAll,
  onDownloadIndividual,
  className = ''
}: ConversionResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());
  const [showBeforeAfter, setShowBeforeAfter] = useState(true);

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
  const totalCompressedSize = results.reduce((sum, result) => sum + result.compressedSize, 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;
  
  // Calculate average compression with validation and bounds checking
  let averageCompression = 0;
  if (totalOriginalSize > 0 && totalCompressedSize >= 0) {
    const ratio = totalSavings / totalOriginalSize;
    // Ensure the ratio is between 0 and 1 (0% to 100% compression)
    averageCompression = Math.max(0, Math.min(1, ratio)) * 100;
  }
  
  const totalProcessingTime = results.reduce((sum, result) => sum + result.processingTime, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Conversion Complete
          </CardTitle>
          <CardDescription>
            {results.length} file{results.length !== 1 ? 's' : ''} processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.length}
              </div>
              <div className="text-sm text-slate-500">Files Converted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatFileSize(totalSavings)}
              </div>
              <div className="text-sm text-slate-500">Space Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {averageCompression.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-500">Avg Compression</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {(totalProcessingTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-slate-500">Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {onDownloadAll && (
              <Button onClick={onDownloadAll} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download All as ZIP
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            >
              {showBeforeAfter ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showBeforeAfter ? 'Hide' : 'Show'} Before/After
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileImage className="w-5 h-5 text-slate-400" />
                  <div>
                    <CardTitle className="text-lg">
                      Result {index + 1}
                    </CardTitle>
                    <CardDescription>
                      {result.metadata.format.toUpperCase()} • {result.metadata.width}×{result.metadata.height}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {result.metadata.format.toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(index)}
                  >
                    {expandedResults.has(index) ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Compression Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Original Size</div>
                  <div className="font-medium">{formatFileSize(result.originalSize)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Compressed Size</div>
                  <div className="font-medium">{formatFileSize(result.compressedSize)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Space Saved</div>
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {formatFileSize(result.originalSize - result.compressedSize)}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-slate-500">Compression</div>
                  <div className="font-medium text-green-600 dark:text-green-400 truncate max-w-[80px]">
                    {Math.min(Math.max(result.compressionRatio, 0), 99.9).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Compression Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compression Ratio</span>
                  <span className="text-green-600 dark:text-green-400 truncate max-w-[60px]">
                    {Math.min(Math.max(result.compressionRatio, 0), 99.9).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(Math.max(result.compressionRatio, 0), 100)} 
                  className="h-2"
                />
              </div>

              {/* Before/After Comparison */}
              {showBeforeAfter && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">Before</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                        {formatFileSize(result.originalSize)}
                      </div>
                      <div className="text-sm text-slate-500">Original file size</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">After</span>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatFileSize(result.compressedSize)}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 truncate max-w-[120px]">
                        {Math.min(Math.max(result.compressionRatio, 0), 99.9).toFixed(1)}% smaller
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {expandedResults.has(index) && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Detailed Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500">Processing Time</div>
                      <div className="font-medium">{(result.processingTime / 1000).toFixed(2)}s</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Color Space</div>
                      <div className="font-medium">{result.metadata.colorSpace || 'sRGB'}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Alpha Channel</div>
                      <div className="font-medium">
                        {result.metadata.hasAlpha ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">EXIF Data</div>
                      <div className="font-medium">
                        {result.metadata.hasExif ? 'Preserved' : 'Removed'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              {onDownloadIndividual && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => onDownloadIndividual(result, index)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

