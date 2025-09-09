'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

// Lazy load heavy components
export const LazyImagePreview = dynamic(() => import('./ImagePreview'), {
  loading: () => <Skeleton className="w-full h-64" />,
  ssr: false
});

export const LazyConversionResults = dynamic(() => import('./ConversionResults'), {
  loading: () => <Skeleton className="w-full h-32" />,
  ssr: false
});

export const LazyProgressTracker = dynamic(() => import('./ProgressTracker'), {
  loading: () => <Skeleton className="w-full h-8" />,
  ssr: false
});

export const LazyConversionSettings = dynamic(() => import('./ConversionSettings'), {
  loading: () => <Skeleton className="w-full h-64" />,
  ssr: false
});

export const LazyFileUpload = dynamic(() => import('./FileUpload'), {
  loading: () => <Skeleton className="w-full h-32" />,
  ssr: false
});

// Lazy load blog components
export const LazyBlogHeader = dynamic(() => import('./BlogHeader'), {
  loading: () => <Skeleton className="w-full h-16" />,
  ssr: false
});

// Lazy load utility components
export const LazyTooltip = dynamic(() => import('./ui/tooltip').then(mod => ({ default: mod.Tooltip })), {
  loading: () => null,
  ssr: false
});
