import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AdSenseScript from '../components/AdSenseScript';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapCovert - Fast, Private Image Converter",
  description: "A blazingly fast, privacy-first image converter that works in-browser. Convert between JPG, PNG, WebP, AVIF, HEIC and more.",
  keywords: ["image converter", "privacy", "browser", "webp", "avif", "heic", "png", "jpg"],
  authors: [{ name: "SnapCovert Team" }],
  creator: "SnapCovert",
  publisher: "SnapCovert",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SnapCovert - Fast, Private Image Converter",
    description: "Convert images fast and privately in your browser. Support for JPG, PNG, WebP, AVIF, HEIC and more.",
    url: 'https://snapcovert.com',
    siteName: 'SnapCovert',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SnapCovert - Fast, Private Image Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SnapCovert - Fast, Private Image Converter",
    description: "Convert images fast and privately in your browser. Support for JPG, PNG, WebP, AVIF, HEIC and more.",
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
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SnapCovert',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SnapCovert',
    'application-name': 'SnapCovert',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
    'google-site-verification': '1olwrRwXEBJqc_EYyjiWXhVk_bJYEY_gSPFFAsKtBDU',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* AdSense Script - Direct approach as backup */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1867152521862157"
          crossOrigin="anonymous"
        />
      </head>
                  <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                  >
                    <AdSenseScript />
                    {children}
                    <Analytics />
                    <SpeedInsights />
                  </body>
    </html>
  );
}
