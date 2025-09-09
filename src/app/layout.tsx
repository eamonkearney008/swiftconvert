import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SnapConvert - Fast, Private Image Converter",
  description: "A blazingly fast, privacy-first image converter that works in-browser. Convert between JPG, PNG, WebP, AVIF, HEIC and more.",
  keywords: ["image converter", "privacy", "browser", "webp", "avif", "heic", "png", "jpg"],
  authors: [{ name: "SnapConvert Team" }],
  creator: "SnapConvert",
  publisher: "SnapConvert",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snapconvert.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SnapConvert - Fast, Private Image Converter",
    description: "Convert images fast and privately in your browser. Support for JPG, PNG, WebP, AVIF, HEIC and more.",
    url: 'https://snapconvert.com',
    siteName: 'SnapConvert',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnapConvert - Fast, Private Image Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SnapConvert - Fast, Private Image Converter",
    description: "Convert images fast and privately in your browser. Support for JPG, PNG, WebP, AVIF, HEIC and more.",
    images: ['/og-image.png'],
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
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SnapConvert',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SnapConvert',
    'application-name': 'SnapConvert',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
