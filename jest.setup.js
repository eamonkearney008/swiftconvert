import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock WebAssembly
global.WebAssembly = {
  instantiate: jest.fn(),
  instantiateStreaming: jest.fn(),
  compile: jest.fn(),
  validate: jest.fn(),
}

// Mock SharedArrayBuffer
global.SharedArrayBuffer = class SharedArrayBuffer {
  constructor() {}
}

// Mock Worker
global.Worker = class Worker {
  constructor() {}
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}

// Mock OffscreenCanvas
global.OffscreenCanvas = class OffscreenCanvas {
  constructor() {}
  getContext() {
    return {
      drawImage: jest.fn(),
      clearRect: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
    }
  }
  convertToBlob() {
    return Promise.resolve(new Blob())
  }
}

// Mock createImageBitmap
global.createImageBitmap = jest.fn(() => Promise.resolve({
  width: 100,
  height: 100,
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock fetch
global.fetch = jest.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

