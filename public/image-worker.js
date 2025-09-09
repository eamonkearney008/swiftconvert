// Image processing Web Worker
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'CONVERT_IMAGE':
      convertImage(data);
      break;
    case 'EXTRACT_METADATA':
      extractMetadata(data);
      break;
    default:
      self.postMessage({ error: 'Unknown message type' });
  }
};

async function convertImage({ file, settings, format }) {
  try {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    
    // Create image from file
    const imageBitmap = await createImageBitmap(file);
    
    // Set canvas dimensions
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    
    // Draw image to canvas
    ctx.drawImage(imageBitmap, 0, 0);
    
    // Convert to desired format
    const mimeType = getMimeType(format);
    const quality = settings.quality || 0.9;
    
    const blob = await canvas.convertToBlob({
      type: mimeType,
      quality: quality
    });
    
    // Calculate compression ratio
    const originalSize = file.size;
    const compressedSize = blob.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    self.postMessage({
      type: 'CONVERSION_COMPLETE',
      data: {
        blob,
        originalSize,
        compressedSize,
        compressionRatio,
        format: format,
        dimensions: {
          width: imageBitmap.width,
          height: imageBitmap.height
        }
      }
    });
    
  } catch (error) {
    self.postMessage({
      type: 'CONVERSION_ERROR',
      error: error.message
    });
  }
}

async function extractMetadata({ file }) {
  try {
    const imageBitmap = await createImageBitmap(file);
    
    const metadata = {
      width: imageBitmap.width,
      height: imageBitmap.height,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      name: file.name
    };
    
    self.postMessage({
      type: 'METADATA_EXTRACTED',
      data: metadata
    });
    
  } catch (error) {
    self.postMessage({
      type: 'METADATA_ERROR',
      error: error.message
    });
  }
}

function getMimeType(format) {
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'bmp': 'image/bmp',
    'gif': 'image/gif'
  };
  return mimeTypes[format] || 'image/jpeg';
}
