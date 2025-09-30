import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../components/BlogHeader';
import { InContentAd } from '../../components/AdSense';
import '../blog/blog.css';

export const metadata: Metadata = {
  title: 'Image Conversion Tutorials - SnapConvert',
  description: 'Step-by-step tutorials for image conversion, optimization techniques, and best practices for different use cases.',
  keywords: ['tutorials', 'image conversion', 'optimization', 'guides', 'step-by-step', 'how-to'],
  authors: [{ name: 'SnapConvert Team' }],
  creator: 'SnapConvert',
  publisher: 'SnapConvert',
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/tutorials',
  },
  openGraph: {
    title: 'Image Conversion Tutorials - SnapConvert',
    description: 'Step-by-step tutorials for image conversion, optimization techniques, and best practices for different use cases.',
    url: 'https://snapcovert.com/tutorials',
    siteName: 'SnapConvert',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SnapConvert Tutorials',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Conversion Tutorials - SnapConvert',
    description: 'Step-by-step tutorials for image conversion, optimization techniques, and best practices for different use cases.',
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

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav className="text-sm text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span>Tutorials</span>
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
              <span className="text-4xl mr-3">📚</span>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                Image Conversion Tutorials
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Step-by-step tutorials for image conversion, optimization techniques, and best practices for different use cases.
            </p>
          </header>

          {/* Tutorial Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Beginner Tutorials */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Beginner</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Perfect for those new to image conversion. Learn the basics and get started quickly.
              </p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
                <li>• Getting started with SnapConvert</li>
                <li>• Understanding image formats</li>
                <li>• Basic conversion techniques</li>
                <li>• Quality vs file size</li>
              </ul>
            </div>

            {/* Intermediate Tutorials */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Intermediate</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                For users who want to optimize their workflow and understand advanced features.
              </p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
                <li>• Batch processing techniques</li>
                <li>• Advanced format selection</li>
                <li>• Performance optimization</li>
                <li>• Metadata management</li>
              </ul>
            </div>

            {/* Advanced Tutorials */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Advanced</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Expert-level techniques for professionals and power users.
              </p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
                <li>• Professional workflows</li>
                <li>• Custom optimization</li>
                <li>• Large file handling</li>
                <li>• Integration strategies</li>
              </ul>
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="space-y-8">
            {/* Getting Started Tutorial */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Getting Started with SnapConvert</h2>
                  <p className="text-slate-600 dark:text-slate-400">Learn how to convert your first image in under 2 minutes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Step 1: Upload Your Image</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Click the "Choose Files" button or drag and drop your image onto the upload area. 
                      SnapConvert supports JPG, PNG, WebP, AVIF, HEIC, and more.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Pro tip:</strong> You can upload multiple images at once for batch conversion.
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Step 2: Choose Output Format</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Select your desired output format from the dropdown. For web use, we recommend WebP or AVIF for best compression.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">WebP: Best for modern websites</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">JPEG: Universal compatibility</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">PNG: Lossless quality</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Step 3: Adjust Quality</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Use the quality slider to balance file size and image quality. Higher values mean better quality but larger files.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Recommended:</strong> 85% for web images, 95% for print, 60% for thumbnails
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Step 4: Convert & Download</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click "Convert" and wait for processing to complete. Download individual files or get them all in a ZIP archive.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Start Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Upload your image</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Choose output format</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Set quality level</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Click convert</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Download results</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Batch Processing Tutorial */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-3xl">📦</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Batch Processing Tutorial</h2>
                  <p className="text-slate-600 dark:text-slate-400">Learn how to efficiently process multiple images at once</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Preparing Your Files</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Organize images in a single folder</li>
                      <li>• Check file sizes (under 100MB each)</li>
                      <li>• Ensure all files are image formats</li>
                      <li>• Consider grouping by similar content</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Upload Strategy</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Select all files at once (Ctrl/Cmd+A)</li>
                      <li>• Use drag and drop for convenience</li>
                      <li>• Monitor memory usage for large batches</li>
                      <li>• Start with smaller batches if needed</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Batch Processing Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Small Batches</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Process 10-20 images at a time for optimal performance and memory usage.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Consistent Settings</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Use the same quality and format settings for all images in a batch.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Monitor Progress</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Watch the progress bar and file names to track conversion status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Format Selection Guide */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Format Selection Guide</h2>
                  <p className="text-slate-600 dark:text-slate-400">Choose the right format for your specific use case</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="border border-slate-300 dark:border-slate-600 p-4 text-left">Format</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-4 text-left">Best For</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-4 text-left">Compression</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-4 text-left">Browser Support</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-4 text-left">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-600 p-4 font-medium">AVIF</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Modern web, photos</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Excellent (50%+ smaller)</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">85%+</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Excellent</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <td className="border border-slate-300 dark:border-slate-600 p-4 font-medium">WebP</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Web images, photos</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Very Good (25-35% smaller)</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">95%+</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Very Good</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-600 p-4 font-medium">JPEG</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Universal, photos</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Good (10-20:1)</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Universal</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Good</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <td className="border border-slate-300 dark:border-slate-600 p-4 font-medium">PNG</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Graphics, transparency</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Lossless</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Universal</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Perfect</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-600 p-4 font-medium">HEIC</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Apple devices, mobile</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Excellent (50% smaller)</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Limited</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-4">Excellent</td>
                    </tr>
                  </tbody>
                </table>
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
              Ready to Start Converting?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Put these tutorials into practice with SnapConvert's powerful image conversion tools.
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
