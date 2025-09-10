'use client';

import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  responsive = true,
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Initialize AdSense
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-1867152521862157"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Pre-configured ad components for common placements
export function HeaderAd() {
  return (
    <AdSense
      adSlot="8814889787" // Using main page ad slot for now
      adFormat="auto"
      className="w-full max-w-728x90 mx-auto mb-4"
      adStyle={{ display: 'block' }}
      responsive={true}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSense
      adSlot="8814889787" // Using main page ad slot for now
      adFormat="auto"
      className="w-full max-w-300x250 mx-auto"
      adStyle={{ display: 'block' }}
      responsive={true}
    />
  );
}

export function InContentAd() {
  return (
    <AdSense
      adSlot="8814889787" // Real ad slot ID from AdSense dashboard
      adFormat="auto"
      className="w-full max-w-336x280 mx-auto my-8"
      adStyle={{ display: 'block' }}
      responsive={true}
    />
  );
}

export function FooterAd() {
  return (
    <AdSense
      adSlot="8814889787" // Using main page ad slot for now
      adFormat="auto"
      className="w-full max-w-728x90 mx-auto mt-8"
      adStyle={{ display: 'block' }}
      responsive={true}
    />
  );
}
