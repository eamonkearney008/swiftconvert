'use client';

import Script from 'next/script';

export default function AdSenseScript() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1867152521862157"
      crossOrigin="anonymous"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('AdSense script loaded successfully');
        // Initialize adsbygoogle array if it doesn't exist
        if (typeof window !== 'undefined') {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        }
      }}
      onError={(e) => {
        console.error('AdSense script failed to load:', e);
      }}
    />
  );
}
