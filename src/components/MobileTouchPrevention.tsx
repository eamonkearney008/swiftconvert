'use client';

import { useEffect } from 'react';

export default function MobileTouchPrevention() {
  useEffect(() => {
    // Only apply on mobile devices
    if (typeof window === 'undefined' || window.innerWidth > 768) return;

    let startX = 0;
    let startY = 0;
    let isHorizontalSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isHorizontalSwipe = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      // If horizontal movement is greater than vertical, prevent it
      if (diffX > diffY && diffX > 10) {
        isHorizontalSwipe = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleTouchEnd = () => {
      startX = 0;
      startY = 0;
      isHorizontalSwipe = false;
    };

    // Add passive: false to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
}
