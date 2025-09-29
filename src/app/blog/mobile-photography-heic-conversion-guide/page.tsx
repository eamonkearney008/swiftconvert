import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import { InContentAd } from '../../../components/AdSense';
import '../blog.css';

export const metadata: Metadata = {
  title: 'Mobile Photography: Converting HEIC to Universal Formats - SnapConvert',
  description: 'Learn how to convert iPhone HEIC photos to widely compatible formats while preserving quality for sharing and storage.',
  keywords: ['HEIC', 'iPhone', 'mobile photography', 'image conversion', 'compatibility', 'sharing'],
  authors: [{ name: 'SnapConvert Team' }],
  creator: 'SnapConvert',
  publisher: 'SnapConvert',
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/blog/mobile-photography-heic-conversion-guide',
  },
  openGraph: {
    title: 'Mobile Photography: Converting HEIC to Universal Formats',
    description: 'Learn how to convert iPhone HEIC photos to widely compatible formats while preserving quality for sharing and storage.',
    url: 'https://snapcovert.com/blog/mobile-photography-heic-conversion-guide',
    siteName: 'SnapConvert',
    type: 'article',
    publishedTime: '2024-01-20',
    tags: ['HEIC', 'iPhone', 'Mobile', 'Sharing', 'Compatibility'],
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Mobile Photography Guide',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Photography: Converting HEIC to Universal Formats',
    description: 'Learn how to convert iPhone HEIC photos to widely compatible formats while preserving quality for sharing and storage.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MobilePhotographyGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-600 dark:text-slate-400">
            <Link href="/blog" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>Mobile Photography Guide</span>
          </nav>
          
          {/* Back to Convert Button */}
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Convert Images
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">📱</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Mobile Photography: Converting HEIC to Universal Formats
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Learn how to convert iPhone HEIC photos to widely compatible formats while preserving quality for sharing and storage.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span>2024-01-20</span>
            <span>•</span>
            <span>4 min read</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['HEIC', 'iPhone', 'Mobile', 'Sharing', 'Compatibility'].map((tag) => (
              <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              With the rise of iPhone photography, HEIC (High Efficiency Image Container) has become the default format for iOS devices. 
              While HEIC offers superior compression and quality, it's not universally supported across all platforms and devices. 
              This guide will help you understand when and how to convert HEIC files for maximum compatibility.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What is HEIC?</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              HEIC is Apple's modern image format that uses HEIF (High Efficiency Image File Format) for storage. 
              It offers several advantages over traditional JPEG:
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• <strong>50% smaller file sizes</strong> compared to JPEG at similar quality</li>
                <li>• <strong>Better image quality</strong> with advanced compression algorithms</li>
                <li>• <strong>Support for transparency</strong> and image sequences</li>
                <li>• <strong>Wide color gamut</strong> and HDR support</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">When to Convert HEIC Files</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Convert When:</h3>
                <ul className="space-y-2 text-green-800 dark:text-green-200">
                  <li>• <strong>Sharing with non-Apple users</strong> (Android, Windows, web browsers)</li>
                  <li>• <strong>Uploading to social media</strong> (many platforms don't support HEIC)</li>
                  <li>• <strong>Email attachments</strong> (better compatibility with email clients)</li>
                  <li>• <strong>Web publishing</strong> (limited browser support)</li>
                  <li>• <strong>Professional printing</strong> (many print services prefer JPEG/PNG)</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">Keep HEIC When:</h3>
                <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                  <li>• <strong>Storing on Apple devices</strong> (iPhone, iPad, Mac)</li>
                  <li>• <strong>Using Apple's ecosystem</strong> (Photos app, iCloud)</li>
                  <li>• <strong>Maximum quality preservation</strong> is priority</li>
                  <li>• <strong>Storage space</strong> is limited</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Best Conversion Practices</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">1. Quality Settings</h3>
                <p className="text-purple-800 dark:text-purple-200 mb-4">For HEIC to JPEG conversion:</p>
                <ul className="space-y-2 text-purple-700 dark:text-purple-300">
                  <li>• <strong>High quality (90-95%)</strong>: Professional work, printing</li>
                  <li>• <strong>Medium quality (80-85%)</strong>: Social media, general sharing</li>
                  <li>• <strong>Lower quality (70-75%)</strong>: Web use, email attachments</li>
                </ul>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">2. Format Selection</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Universal Compatibility:</h4>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-300">
                      <li>• JPEG - Universal compatibility, good for photos</li>
                      <li>• PNG - Lossless quality, good for graphics with transparency</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Modern Formats:</h4>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-300">
                      <li>• WebP - Modern web format, excellent compression</li>
                      <li>• AVIF - Next-gen format, superior compression</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Conclusion</h3>
              <p className="text-slate-700 dark:text-slate-300">
                HEIC is an excellent format for Apple users, but conversion is often necessary for universal compatibility. 
                By understanding when to convert and using the right settings, you can maintain image quality while ensuring 
                your photos work everywhere.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                SnapConvert makes this process simple with intelligent presets and batch processing capabilities, 
                helping you convert your mobile photos efficiently while preserving the quality that makes them special.
              </p>
            </div>
          </div>
        </article>

        {/* AdSense Ad */}
        <div className="flex justify-center my-8">
          <InContentAd />
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Convert Your HEIC Photos?
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Use SnapConvert's mobile-optimized interface to convert your iPhone photos with just a few taps.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg">
            Start Converting Now
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
