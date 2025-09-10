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
      adSlot="1234567890" // Replace with your actual ad slot ID
      adFormat="horizontal"
      className="w-full max-w-728x90 mx-auto mb-4"
      adStyle={{ display: 'block', width: '728px', height: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSense
      adSlot="0987654321" // Replace with your actual ad slot ID
      adFormat="vertical"
      className="w-full max-w-300x250 mx-auto"
      adStyle={{ display: 'block', width: '300px', height: '250px' }}
    />
  );
}

export function InContentAd() {
  return (
    <AdSense
      adSlot="1122334455" // Replace with your actual ad slot ID
      adFormat="rectangle"
      className="w-full max-w-336x280 mx-auto my-8"
      adStyle={{ display: 'block', width: '336px', height: '280px' }}
    />
  );
}

export function FooterAd() {
  return (
    <AdSense
      adSlot="5566778899" // Replace with your actual ad slot ID
      adFormat="horizontal"
      className="w-full max-w-728x90 mx-auto mt-8"
      adStyle={{ display: 'block', width: '728px', height: '90px' }}
    />
  );
}
