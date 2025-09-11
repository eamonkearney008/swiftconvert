'use client';

import { useState, useEffect } from 'react';

export default function MobileDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      isMobile: window.innerWidth <= 768,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      canvasSupport: !!document.createElement('canvas').getContext,
      offscreenCanvasSupport: typeof OffscreenCanvas !== 'undefined',
      createImageBitmapSupport: typeof createImageBitmap !== 'undefined',
      fileReaderSupport: typeof FileReader !== 'undefined',
      urlCreateObjectURLSupport: typeof URL.createObjectURL !== 'undefined',
      webpSupport: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })(),
      avifSupport: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      })(),
      memoryInfo: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : 'Not available',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
    
    setDebugInfo(info);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded text-xs z-50"
      >
        Debug Mobile
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Mobile Debug Info</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className="text-gray-600 break-all">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t space-y-2">
          <button
            onClick={() => {
              const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
              const url = URL.createObjectURL(testFile);
              console.log('URL.createObjectURL test:', url);
              URL.revokeObjectURL(url);
              alert('Check console for URL.createObjectURL test result');
            }}
            className="w-full bg-blue-500 text-white py-2 rounded text-sm"
          >
            Test URL.createObjectURL
          </button>
          
          <button
            onClick={() => {
              const canvas = document.createElement('canvas');
              canvas.width = 100;
              canvas.height = 100;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = 'red';
                ctx.fillRect(0, 0, 50, 50);
                ctx.fillStyle = 'blue';
                ctx.fillRect(50, 50, 50, 50);
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    console.log('Canvas toBlob test successful:', blob.size, 'bytes');
                    alert('Canvas toBlob test successful! Check console.');
                  } else {
                    console.error('Canvas toBlob test failed');
                    alert('Canvas toBlob test failed!');
                  }
                }, 'image/png');
              } else {
                alert('Canvas context not available!');
              }
            }}
            className="w-full bg-green-500 text-white py-2 rounded text-sm"
          >
            Test Canvas toBlob
          </button>
          
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  console.log('File selected:', file.name, file.size, file.type);
                  const url = URL.createObjectURL(file);
                  const img = new Image();
                  img.onload = () => {
                    console.log('Image loaded successfully:', img.width, 'x', img.height);
                    URL.revokeObjectURL(url);
                    alert('Image loaded successfully! Check console.');
                  };
                  img.onerror = (error) => {
                    console.error('Image load failed:', error);
                    URL.revokeObjectURL(url);
                    alert('Image load failed! Check console.');
                  };
                  img.src = url;
                }
              };
              input.click();
            }}
            className="w-full bg-purple-500 text-white py-2 rounded text-sm"
          >
            Test Image Loading
          </button>
        </div>
      </div>
    </div>
  );
}
