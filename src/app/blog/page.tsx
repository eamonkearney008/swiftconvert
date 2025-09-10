import Link from 'next/link';
import { Metadata } from 'next';
import { BlogHeader } from '../../components/BlogHeader';
import { BlogPageClient } from './BlogPageClient';
import { InContentAd } from '../../components/AdSense';
import './blog.css';

export const metadata: Metadata = {
  title: 'Image Conversion Guides - SnapConvert',
  description: 'Learn about image formats, optimization techniques, and best practices for image conversion.',
  keywords: ['image guides', 'image formats', 'optimization', 'HEIC', 'WebP', 'AVIF', 'tutorials'],
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="flex justify-center my-8">
        <InContentAd />
      </div>
      <BlogPageClient />
    </div>
  );
}