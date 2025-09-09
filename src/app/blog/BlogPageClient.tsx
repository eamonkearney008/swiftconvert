'use client';

import Link from 'next/link';
import { useState } from 'react';
import LazyBlogCard from '../../components/LazyBlogCard';

// Blog articles data
const articles = [
  {
    slug: 'heic-vs-jpg-which-is-best',
    title: 'HEIC vs JPG: Which is Best for Your Images?',
    excerpt: 'Compare HEIC and JPG formats to understand their strengths, weaknesses, and when to use each for optimal image quality and file size.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Format Comparison',
    tags: ['HEIC', 'JPG', 'Apple', 'Compression'],
    icon: '📊'
  },
  {
    slug: 'reduce-image-file-size-without-losing-quality',
    title: 'How to Reduce Image File Size Without Losing Quality',
    excerpt: 'Master the art of image optimization with proven techniques to compress images while maintaining visual quality for web and print.',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Optimization',
    tags: ['Compression', 'Quality', 'WebP', 'AVIF', 'PNG'],
    icon: '⚡'
  },
  {
    slug: 'advanced-image-optimization-techniques',
    title: 'Advanced Image Optimization Techniques',
    excerpt: 'Master advanced image optimization techniques including compression algorithms, format selection, and quality balancing for maximum efficiency.',
    date: '2024-01-09',
    readTime: '8 min read',
    category: 'Optimization',
    tags: ['Advanced', 'Compression', 'Algorithms', 'Quality', 'Efficiency'],
    icon: '⚙️'
  },
  {
    slug: 'avif-vs-webp-future-of-web',
    title: 'AVIF vs WebP: The Future of Web Images',
    excerpt: 'Explore the next-generation image formats that are revolutionizing web performance and discover which format will dominate the future.',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Future Tech',
    tags: ['AVIF', 'WebP', 'Performance', 'Browser Support'],
    icon: '🚀'
  },
  {
    slug: 'next-generation-image-formats',
    title: 'Next-Generation Image Formats: The Future of Digital Images',
    excerpt: 'Explore emerging image formats like AVIF, HEIF, and WebP 2.0 that are revolutionizing digital image compression and quality.',
    date: '2024-01-07',
    readTime: '9 min read',
    category: 'Future Tech',
    tags: ['AVIF', 'HEIF', 'WebP 2.0', 'Future', 'Innovation', 'Compression'],
    icon: '🚀'
  },
  {
    slug: 'mobile-photography-heic-conversion-guide',
    title: 'Mobile Photography: Converting HEIC to Universal Formats',
    excerpt: 'Learn how to convert iPhone HEIC photos to widely compatible formats while preserving quality for sharing and storage.',
    date: '2024-01-20',
    readTime: '4 min read',
    category: 'Mobile',
    tags: ['HEIC', 'iPhone', 'Mobile', 'Sharing', 'Compatibility'],
    icon: '📱'
  },
  {
    slug: 'social-media-image-optimization',
    title: 'Optimizing Images for Social Media: Instagram, Facebook, Twitter',
    excerpt: 'Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.',
    date: '2024-01-18',
    readTime: '6 min read',
    category: 'Social Media',
    tags: ['Instagram', 'Facebook', 'Twitter', 'Social Media', 'Dimensions'],
    icon: '📸'
  },
  {
    slug: 'png-vs-tiff-professional-work',
    title: 'PNG vs TIFF: Choosing the Right Format for Professional Work',
    excerpt: 'Professional photographer and designer guide to selecting between PNG and TIFF for print, digital, and archival purposes.',
    date: '2024-01-12',
    readTime: '5 min read',
    category: 'Professional',
    tags: ['PNG', 'TIFF', 'Professional', 'Print', 'Archival'],
    icon: '🎨'
  },
  {
    slug: 'web-performance-image-optimization',
    title: 'Web Performance: Image Optimization for Faster Loading',
    excerpt: 'Technical guide to improving Core Web Vitals and page speed through strategic image format selection and optimization.',
    date: '2024-01-08',
    readTime: '8 min read',
    category: 'Performance',
    tags: ['Web Performance', 'Core Web Vitals', 'Page Speed', 'SEO'],
    icon: '⚡'
  },
  {
    slug: 'batch-processing-large-photo-libraries',
    title: 'Batch Processing: Converting Large Photo Libraries Efficiently',
    excerpt: 'Best practices for processing hundreds or thousands of images efficiently while maintaining quality and managing system resources.',
    date: '2024-01-03',
    readTime: '7 min read',
    category: 'Batch Processing',
    tags: ['Batch Processing', 'Large Files', 'Efficiency', 'Memory Management'],
    icon: '📦'
  }
];

export function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))];

  // Filter articles based on selected category
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Image Conversion Guides
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Master the art of image optimization with our comprehensive guides on formats, compression, and best practices.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-slate-600 dark:text-slate-400">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'guide' : 'guides'} 
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <LazyBlogCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category}
              readTime={article.readTime}
              date={new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              slug={article.slug}
              icon={article.icon}
              className="group block bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No guides found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No guides available in the "{selectedCategory}" category yet.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Optimize Your Images?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Put your knowledge into practice with SnapConvert's powerful image conversion tools.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg"
          >
            Start Converting Now
          </Link>
        </div>
      </div>
    </div>
  );
}

