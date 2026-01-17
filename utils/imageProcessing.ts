/**
 * Image Processing Utilities
 * Uses native Canvas API - no external dependencies
 */

/**
 * Load an image from a URL
 */
export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Convert canvas to blob URL
 */
export function canvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });
}

/**
 * Apply levels adjustment to an image (RGB channels)
 */
export async function applyLevels(
  imageUrl: string,
  rLow: number, rMid: number, rHigh: number,
  gLow: number, gMid: number, gHigh: number,
  bLow: number, bMid: number, bHigh: number
): Promise<string> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply levels for each channel
  for (let i = 0; i < data.length; i += 4) {
    // Red channel
    data[i] = applyLevelToChannel(data[i], rLow, rMid, rHigh);
    // Green channel
    data[i + 1] = applyLevelToChannel(data[i + 1], gLow, gMid, gHigh);
    // Blue channel
    data[i + 2] = applyLevelToChannel(data[i + 2], bLow, bMid, bHigh);
    // Alpha channel stays the same
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlobUrl(canvas);
}

function applyLevelToChannel(value: number, low: number, mid: number, high: number): number {
  // Normalize to 0-1 range
  const normalized = value / 255;
  
  // Apply input levels (low to high)
  let adjusted = (normalized - low / 255) / ((high - low) / 255);
  adjusted = Math.max(0, Math.min(1, adjusted));
  
  // Apply gamma (mid point)
  adjusted = Math.pow(adjusted, 1 / mid);
  
  // Scale back to 0-255
  return Math.round(Math.max(0, Math.min(255, adjusted * 255)));
}

/**
 * Apply blur effect to an image
 */
export async function applyBlur(
  imageUrl: string, 
  radius: number, 
  type: 'box' | 'gaussian' = 'gaussian'
): Promise<string> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Use CSS filter for blur (browser optimized)
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(img, 0, 0);
  
  return canvasToBlobUrl(canvas);
}

/**
 * Crop an image
 */
export async function applyCrop(
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<string> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw cropped portion
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  
  return canvasToBlobUrl(canvas);
}

/**
 * Invert colors of an image
 */
export async function applyInvert(imageUrl: string): Promise<string> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Invert RGB channels
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];         // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
    // Alpha channel stays the same
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlobUrl(canvas);
}

/**
 * Composite two images together
 */
export async function applyCompositor(
  baseImageUrl: string,
  overlayImageUrl: string,
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' = 'normal',
  opacity: number = 1.0
): Promise<string> {
  const baseImg = await loadImage(baseImageUrl);
  const overlayImg = await loadImage(overlayImageUrl);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = Math.max(baseImg.width, overlayImg.width);
  canvas.height = Math.max(baseImg.height, overlayImg.height);
  
  // Draw base image
  ctx.drawImage(baseImg, 0, 0);
  
  // Draw overlay with blend mode
  ctx.globalCompositeOperation = blendMode;
  ctx.globalAlpha = opacity;
  ctx.drawImage(overlayImg, 0, 0);
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  
  return canvasToBlobUrl(canvas);
}

/**
 * Apply painterly effect to an image
 */
export async function applyPainter(imageUrl: string, intensity: number = 0.5): Promise<string> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Apply blur for painterly effect
  ctx.filter = `blur(${intensity * 2}px)`;
  ctx.drawImage(img, 0, 0);
  
  // Add texture/noise for painterly look
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 15;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
    // Alpha stays the same
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlobUrl(canvas);
}







