'use client';

import { useState } from 'react';
import { FormatConverter } from '../../lib/format-converters';

export default function TestConversionPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Starting conversion tests...');
      
      // Test 1: Check if FormatConverter is available
      addResult(`FormatConverter available: ${typeof FormatConverter !== 'undefined'}`);
      
      // Test 2: Check if convertToFormat method exists
      addResult(`convertToFormat method exists: ${typeof FormatConverter.convertToFormat === 'function'}`);
      
      // Test 3: Create a simple test image
      addResult('Creating test image...');
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw a simple test pattern
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(50, 0, 50, 50);
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 50, 50, 50);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(50, 50, 50, 50);
        
        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/png');
        });
        
        addResult(`Test image created: ${blob.size} bytes`);
        
        // Test 4: Try conversion to WebP
        addResult('Testing WebP conversion...');
        try {
          const result = await FormatConverter.convertToFormat(
            new File([blob], 'test.png', { type: 'image/png' }),
            'webp',
            85
          );
          addResult(`✅ WebP conversion successful: ${result.blob.size} bytes`);
        } catch (error) {
          addResult(`❌ WebP conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Test 5: Try conversion to JPEG
        addResult('Testing JPEG conversion...');
        try {
          const result = await FormatConverter.convertToFormat(
            new File([blob], 'test.png', { type: 'image/png' }),
            'jpg',
            85
          );
          addResult(`✅ JPEG conversion successful: ${result.blob.size} bytes`);
        } catch (error) {
          addResult(`❌ JPEG conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Test 6: Check browser capabilities
        addResult('Checking browser capabilities...');
        addResult(`OffscreenCanvas supported: ${typeof OffscreenCanvas !== 'undefined'}`);
        addResult(`createImageBitmap supported: ${typeof createImageBitmap !== 'undefined'}`);
        addResult(`Canvas supported: ${typeof HTMLCanvasElement !== 'undefined'}`);
        
      } else {
        addResult('❌ Canvas context not available');
      }
      
      addResult('All tests completed!');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Conversion Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={runTests}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Running Tests...' : 'Run Conversion Tests'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click the button above to start testing.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm p-2 bg-gray-50 rounded">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
