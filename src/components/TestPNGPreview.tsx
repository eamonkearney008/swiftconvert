'use client';

import { useState } from 'react';

export default function TestPNGPreview() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPNGPreview = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    addLog('Starting PNG preview test...');
    
    try {
      // Create a test PNG file
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        addLog('ERROR: Could not get canvas context');
        setIsTesting(false);
        return;
      }
      
      // Draw a simple test image
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 50, 50);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(50, 0, 50, 50);
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(0, 50, 50, 50);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(50, 50, 50, 50);
      
      addLog('Canvas created and drawn');
      
      // Convert to PNG blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      });
      
      addLog(`PNG blob created: ${blob.size} bytes, type: ${blob.type}`);
      
      // Create File object
      const file = new File([blob], 'test.png', { type: 'image/png' });
      addLog(`File object created: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      // Test URL.createObjectURL
      try {
        const url = URL.createObjectURL(file);
        addLog(`URL.createObjectURL success: ${url}`);
        
        // Test if URL works with Image
        const img = new Image();
        img.onload = () => {
          addLog('Image loaded successfully from URL');
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
          addLog('ERROR: Image failed to load from URL');
          URL.revokeObjectURL(url);
        };
        img.src = url;
        
      } catch (urlError) {
        addLog(`ERROR: URL.createObjectURL failed: ${urlError}`);
      }
      
      // Test FileReader
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result && typeof result === 'string' && result.startsWith('data:')) {
            addLog('FileReader success: data URL created');
            
            // Test if data URL works with Image
            const img2 = new Image();
            img2.onload = () => {
              addLog('Image loaded successfully from data URL');
            };
            img2.onerror = () => {
              addLog('ERROR: Image failed to load from data URL');
            };
            img2.src = result;
          } else {
            addLog('ERROR: FileReader returned invalid result');
          }
        };
        reader.onerror = () => {
          addLog('ERROR: FileReader failed');
        };
        reader.readAsDataURL(file);
        
      } catch (readerError) {
        addLog(`ERROR: FileReader failed: ${readerError}`);
      }
      
    } catch (error) {
      addLog(`ERROR: Test failed: ${error}`);
    }
    
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4">PNG Preview Test</h3>
      
      <button
        onClick={testPNGPreview}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? 'Testing...' : 'Test PNG Preview'}
      </button>
      
      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-sm font-mono max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
