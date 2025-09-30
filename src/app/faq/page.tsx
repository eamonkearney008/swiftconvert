import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../components/BlogHeader';
import { InContentAd } from '../../components/AdSense';
import '../blog/blog.css';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - SnapConvert',
  description: 'Get answers to common questions about image conversion, file formats, privacy, and using SnapConvert effectively.',
  keywords: ['FAQ', 'image conversion', 'file formats', 'privacy', 'help', 'support'],
  authors: [{ name: 'SnapConvert Team' }],
  creator: 'SnapConvert',
  publisher: 'SnapConvert',
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions - SnapConvert',
    description: 'Get answers to common questions about image conversion, file formats, privacy, and using SnapConvert effectively.',
    url: 'https://snapcovert.com/faq',
    siteName: 'SnapConvert',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SnapConvert FAQ',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions - SnapConvert',
    description: 'Get answers to common questions about image conversion, file formats, privacy, and using SnapConvert effectively.',
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

export default function FAQPage() {
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
              <span>FAQ</span>
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
              <span className="text-4xl mr-3">❓</span>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Get answers to common questions about image conversion, file formats, privacy, and using SnapConvert effectively.
            </p>
          </header>

          {/* FAQ Content */}
          <div className="space-y-8">
            {/* General Questions */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🔧</span>
                General Questions
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What is SnapConvert?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    SnapConvert is a privacy-first, browser-based image converter that allows you to convert between different image formats 
                    without uploading your files to any server. All processing happens locally in your browser using advanced WASM codecs.
                  </p>
                  <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
                    <li>• Convert between 9+ image formats</li>
                    <li>• Batch processing for multiple files</li>
                    <li>• Advanced compression algorithms</li>
                    <li>• Complete privacy protection</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Is SnapConvert free to use?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Yes! SnapConvert is completely free to use. There are no hidden fees, subscriptions, or premium tiers. 
                    You can convert as many images as you want without any limitations.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Do I need to create an account?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    No account required! SnapConvert works entirely in your browser without any registration. 
                    Simply visit the website and start converting your images immediately.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                Privacy & Security
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Is my data secure?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Absolutely! SnapConvert is designed with privacy as the top priority. Your images never leave your device.
                  </p>
                  <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
                    <li>• All processing happens in your browser</li>
                    <li>• No files are uploaded to our servers</li>
                    <li>• No data collection or tracking</li>
                    <li>• No cookies for personal information</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Do you store my images?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    No, we never store your images. All conversion happens locally in your browser, and once you close the page, 
                    all temporary data is automatically cleared from your device.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What about metadata?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    You have full control over metadata. You can choose to preserve or remove EXIF data, color profiles, 
                    and other metadata during conversion to protect your privacy further.
                  </p>
                </div>
              </div>
            </section>

            {/* File Formats */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">📁</span>
                File Formats & Conversion
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What file formats are supported?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    SnapConvert supports a wide range of popular image formats:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <strong className="text-blue-900 dark:text-blue-100">Input Formats:</strong>
                      <ul className="mt-2 space-y-1 text-blue-800 dark:text-blue-200">
                        <li>• JPG/JPEG</li>
                        <li>• PNG</li>
                        <li>• WebP</li>
                        <li>• AVIF</li>
                        <li>• HEIC/HEIF</li>
                        <li>• TIFF</li>
                        <li>• BMP</li>
                        <li>• GIF</li>
                        <li>• SVG</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <strong className="text-green-900 dark:text-green-100">Output Formats:</strong>
                      <ul className="mt-2 space-y-1 text-green-800 dark:text-green-200">
                        <li>• All input formats</li>
                        <li>• Plus ICO</li>
                        <li>• Optimized compression</li>
                        <li>• Quality control</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What's the best format for web use?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    For modern web use, we recommend this hierarchy:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <strong className="text-green-900 dark:text-green-100">1. AVIF</strong>
                      <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                        50%+ better compression than JPEG, excellent quality, growing browser support
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <strong className="text-blue-900 dark:text-blue-100">2. WebP</strong>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        25-35% better compression than JPEG, 95%+ browser support
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <strong className="text-orange-900 dark:text-orange-100">3. JPEG</strong>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                        Universal compatibility, good compression, widely supported
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Can I convert HEIC files?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Yes! HEIC files from iPhones and other Apple devices are fully supported. We can convert them to JPEG, PNG, WebP, 
                    or any other format. For large HEIC files, we automatically use edge processing for optimal performance.
                  </p>
                </div>
              </div>
            </section>

            {/* Performance & Limits */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                Performance & Limits
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What's the file size limit?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Individual files up to 100MB are supported. For larger files, we automatically use edge processing to ensure optimal performance.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Pro tip:</strong> For very large files, consider splitting them into smaller batches for faster processing.
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">How fast is the conversion?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Conversion speed depends on file size and format complexity:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <strong className="text-green-900 dark:text-green-100">Small files (&lt;1MB):</strong>
                      <p className="text-green-800 dark:text-green-200 mt-1">&lt; 1 second</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <strong className="text-yellow-900 dark:text-yellow-100">Medium files (1-10MB):</strong>
                      <p className="text-yellow-800 dark:text-yellow-200 mt-1">1-3 seconds</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <strong className="text-orange-900 dark:text-orange-100">Large files (10-100MB):</strong>
                      <p className="text-orange-800 dark:text-orange-200 mt-1">3-10 seconds</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Can I process multiple files at once?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Yes! SnapConvert supports batch processing. You can upload multiple images and convert them all at once. 
                    The system intelligently manages memory and processing to handle large batches efficiently.
                  </p>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🔧</span>
                Troubleshooting
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Conversion failed - what should I do?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    If conversion fails, try these solutions:
                  </p>
                  <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-2">
                    <li>• <strong>Check file size:</strong> Ensure the file is under 100MB</li>
                    <li>• <strong>Verify format:</strong> Make sure it's a supported image format</li>
                    <li>• <strong>Try different quality:</strong> Lower quality settings may work better</li>
                    <li>• <strong>Clear browser cache:</strong> Refresh the page and try again</li>
                    <li>• <strong>Use edge processing:</strong> For large files, edge processing is automatic</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">The page is slow or unresponsive</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    For better performance:
                  </p>
                  <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-2">
                    <li>• <strong>Close other tabs:</strong> Free up browser memory</li>
                    <li>• <strong>Process fewer files:</strong> Try smaller batches</li>
                    <li>• <strong>Use lower quality:</strong> Reduce processing load</li>
                    <li>• <strong>Update browser:</strong> Ensure you're using the latest version</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Download not working</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    If downloads aren't working, check your browser's download settings and ensure pop-ups aren't blocked. 
                    Try using a different browser if the issue persists.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* AdSense Ad */}
          <div className="flex justify-center my-8">
            <InContentAd />
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Convert Your Images?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start converting your images with SnapConvert's powerful, privacy-first image conversion tool.
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
