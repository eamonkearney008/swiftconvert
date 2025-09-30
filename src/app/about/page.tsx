import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../components/BlogHeader';
import { InContentAd } from '../../components/AdSense';
import '../blog/blog.css';

export const metadata: Metadata = {
  title: 'About SnapConvert - Privacy-First Image Converter',
  description: 'Learn about SnapConvert\'s mission to provide fast, secure, and privacy-first image conversion tools. Discover our technology and commitment to user privacy.',
  keywords: ['about', 'privacy', 'image converter', 'technology', 'mission', 'security'],
  authors: [{ name: 'SnapConvert Team' }],
  creator: 'SnapConvert',
  publisher: 'SnapConvert',
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About SnapConvert - Privacy-First Image Converter',
    description: 'Learn about SnapConvert\'s mission to provide fast, secure, and privacy-first image conversion tools. Discover our technology and commitment to user privacy.',
    url: 'https://snapcovert.com/about',
    siteName: 'SnapConvert',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SnapConvert About',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SnapConvert - Privacy-First Image Converter',
    description: 'Learn about SnapConvert\'s mission to provide fast, secure, and privacy-first image conversion tools. Discover our technology and commitment to user privacy.',
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav className="text-sm text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span>About</span>
            </nav>
            
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

          {/* Header */}
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🔒</span>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                About SnapConvert
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Privacy-first image conversion that puts your data security above everything else.
            </p>
          </header>

          {/* Mission Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                At SnapConvert, we believe that image conversion should be fast, secure, and completely private. 
                Our mission is to provide powerful image processing tools that never compromise your privacy or data security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Privacy First</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Your images never leave your device. All processing happens locally in your browser using advanced WASM technology.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Lightning Fast</h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    WASM-powered codecs with SIMD and multi-threading deliver maximum speed for your image conversions.
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">Universal Support</h3>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Support for all major image formats including next-generation formats like AVIF and HEIC.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Technology</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">WebAssembly (WASM) Processing</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  SnapConvert uses cutting-edge WebAssembly technology to run native image processing codecs directly in your browser. 
                  This provides desktop-level performance while maintaining complete privacy.
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
                  <li>• MozJPEG for JPEG optimization</li>
                  <li>• libaom-av1 for AVIF encoding</li>
                  <li>• libwebp for WebP conversion</li>
                  <li>• oxipng for PNG optimization</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Smart Processing Architecture</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our intelligent processing system automatically chooses between local browser processing and edge processing 
                  based on file size, format complexity, and device capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Local Processing</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Fast, private processing for most images using your device's computing power.
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Edge Processing</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Powerful server processing for large files and complex format conversions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Modern Web Standards</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Built with the latest web technologies including Next.js 15, React 19, and TypeScript for optimal performance, 
                  accessibility, and user experience across all devices.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Commitment */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Commitment</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">Zero Data Collection</h3>
                <p className="text-red-800 dark:text-red-200 mb-4">
                  We don't collect, store, or analyze your images or personal data. Your files never leave your device during local processing.
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• No file uploads to our servers (local processing)</li>
                  <li>• No user tracking or analytics</li>
                  <li>• No data retention or storage</li>
                  <li>• No third-party data sharing</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Local Processing</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Most conversions happen entirely in your browser using WebAssembly. Your images never leave your device, 
                    ensuring complete privacy and security.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Secure Edge Processing</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    When edge processing is needed, files are processed securely and immediately deleted. 
                    No permanent storage or data retention occurs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features & Benefits */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why Choose SnapConvert?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Complete Privacy</h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Your images never leave your device. No uploads, no data collection, no privacy concerns.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Lightning Fast</h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  WASM-powered processing delivers desktop-level performance directly in your browser.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">All Formats</h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  Support for 9+ input formats and 12+ output formats including next-gen formats like AVIF.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">Batch Processing</h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  Convert multiple images at once with intelligent memory management and progress tracking.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">Mobile Optimized</h3>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  Touch-friendly interface with intelligent processing for mobile devices and low-memory situations.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">♿</span>
                </div>
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Accessible</h3>
                <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                  WCAG 2.1 AA compliant with full keyboard navigation and screen reader support.
                </p>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-3xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">By the Numbers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">9+</div>
                <p className="text-blue-800 dark:text-blue-200 font-medium">Input Formats</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">JPG, PNG, WebP, AVIF, HEIC, TIFF, BMP, GIF, SVG</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">12+</div>
                <p className="text-green-800 dark:text-green-200 font-medium">Output Formats</p>
                <p className="text-sm text-green-600 dark:text-green-300">All input formats plus ICO</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                <p className="text-purple-800 dark:text-purple-200 font-medium">Privacy</p>
                <p className="text-sm text-purple-600 dark:text-purple-300">Local processing, no data collection</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">&lt;2s</div>
                <p className="text-orange-800 dark:text-orange-200 font-medium">Average Speed</p>
                <p className="text-sm text-orange-600 dark:text-orange-300">Most images convert in under 2 seconds</p>
              </div>
            </div>
          </section>

          {/* AdSense Ad */}
          <div className="flex justify-center my-8">
            <InContentAd />
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Experience Privacy-First Image Conversion
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Join thousands of users who trust SnapConvert for their image conversion needs. 
              Fast, secure, and completely private.
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
