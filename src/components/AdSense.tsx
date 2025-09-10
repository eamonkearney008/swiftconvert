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
      // Initialize AdSense after component mounts
      if (typeof window !== 'undefined') {
        console.log('AdSense: Initializing ad slot', adSlot);
        
        // Wait for AdSense script to load
        const initAdSense = () => {
          if ((window as any).adsbygoogle && Array.isArray((window as any).adsbygoogle)) {
            console.log('AdSense: Script loaded, pushing ad for slot', adSlot);
            try {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              console.log('AdSense: Ad pushed successfully for slot', adSlot);
            } catch (pushError) {
              console.error('AdSense: Error pushing ad:', pushError);
            }
          } else {
            console.log('AdSense: Script not loaded yet, retrying in 1000ms...');
            // Retry after a longer delay if AdSense script isn't loaded yet
            setTimeout(initAdSense, 1000);
          }
        };
        
        // Start initialization after a short delay to ensure script is loaded
        setTimeout(initAdSense, 2000);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adSlot]);

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
