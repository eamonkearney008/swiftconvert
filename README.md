# SnapCovert

A blazingly fast, privacy-first image converter that works in-browser by default (WASM) and seamlessly offloads to the edge for heavy jobs.

<!-- Last updated: Mobile optimization for large file previews -->

## Features

- **Privacy First**: All conversions happen in your browser. Your files never leave your device.
- **Lightning Fast**: WASM-powered codecs with SIMD and multi-threading for maximum speed.
- **All Formats**: Support for JPG, PNG, WebP, AVIF, HEIC, TIFF, BMP, GIF, and SVG.
- **Batch Processing**: Convert multiple files at once with progress tracking.
- **Smart Presets**: Web-optimized, visually lossless, smallest size, and print quality presets.
- **Modern UI**: Clean, accessible interface following latest design best practices.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Jotai
- **Animation**: Framer Motion
- **Codecs**: WASM (mozjpeg, libaom-av1, libwebp, oxipng)
- **Deployment**: Vercel Edge Runtime

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd snapcovert
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/
│   ├── codecs/         # WASM codec management
│   ├── presets/        # Conversion presets
│   ├── workers/        # Web Workers for processing
│   └── zip/            # ZIP file handling
├── pages/              # Additional pages
└── types/              # TypeScript type definitions
```

## Development

### Adding New Codecs

1. Add the WASM file to `public/wasm/`
2. Register the codec in `src/lib/codecs/registry.ts`
3. Implement the codec interface

### Adding New Presets

1. Define the preset in `src/lib/presets/index.ts`
2. Add UI controls in the main component

## Deployment

The app is configured for deployment on Vercel with edge runtime support. The cross-origin isolation headers are configured for WASM support.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] v1: Core conversion functionality with JPG/PNG/WebP/AVIF
- [ ] v1.1: HEIC support via edge processing
- [ ] v1.2: Animated GIF support and PWA features
- [ ] v2: Advanced features and desktop app
