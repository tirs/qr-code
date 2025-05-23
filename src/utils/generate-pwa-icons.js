/**
 * Automatic PWA Icon Generator
 * This script generates PWA icons during deployment
 */

const fs = require('fs');
const path = require('path');

// Ensure the img directory exists
const imgDir = path.join(__dirname, '../public/img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Try to require canvas, but provide a fallback if it fails
let canvasModule;
try {
  canvasModule = require('canvas');
} catch (error) {
  console.error('Warning: canvas module failed to load. Using fallback icon generation.');
  console.error(error.message);
  canvasModule = null;
}

// Function to draw QR code icon
function drawQRIcon(ctx, size) {
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Background
  ctx.fillStyle = '#4e73df';
  ctx.fillRect(0, 0, size, size);
  
  // QR code frame
  const padding = size * 0.15;
  const qrSize = size - (padding * 2);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(padding, padding, qrSize, qrSize);
  
  // QR code elements
  ctx.fillStyle = '#4e73df';
  
  // Corner squares
  const cornerSize = qrSize * 0.25;
  const cornerPadding = qrSize * 0.05;
  
  // Top-left corner
  ctx.fillRect(padding + cornerPadding, padding + cornerPadding, cornerSize, cornerSize);
  
  // Top-right corner
  ctx.fillRect(padding + qrSize - cornerSize - cornerPadding, padding + cornerPadding, cornerSize, cornerSize);
  
  // Bottom-left corner
  ctx.fillRect(padding + cornerPadding, padding + qrSize - cornerSize - cornerPadding, cornerSize, cornerSize);
  
  // Center pattern
  const centerSize = qrSize * 0.4;
  const centerPos = padding + (qrSize - centerSize) / 2;
  ctx.fillRect(centerPos, centerPos, centerSize, centerSize);
  
  // QR code dots
  const dotSize = qrSize * 0.06;
  const dotSpacing = qrSize * 0.12;
  
  // Draw a grid of dots
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      // Skip corners and center
      if ((i < 2 && j < 2) || (i < 2 && j > 2) || (i > 2 && j < 2) || (i === 2 && j === 2)) {
        continue;
      }
      
      const x = padding + cornerPadding + cornerSize + (i - 2) * dotSpacing;
      const y = padding + cornerPadding + cornerSize + (j - 2) * dotSpacing;
      
      ctx.fillRect(x, y, dotSize, dotSize);
    }
  }
  
  // Add a check mark overlay
  ctx.fillStyle = '#4CAF50';
  const checkSize = size * 0.3;
  const checkX = size - checkSize - (size * 0.1);
  const checkY = size - checkSize - (size * 0.1);
  
  ctx.beginPath();
  ctx.arc(checkX, checkY, checkSize / 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw check mark
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(checkX - checkSize * 0.2, checkY);
  ctx.lineTo(checkX - checkSize * 0.05, checkY + checkSize * 0.2);
  ctx.lineTo(checkX + checkSize * 0.25, checkY - checkSize * 0.2);
  ctx.stroke();
}

// Main function to generate icons
function generateIcons() {
  if (canvasModule) {
    try {
      const { createCanvas } = canvasModule;
      
      // Generate 192x192 icon
      const canvas192 = createCanvas(192, 192);
      const ctx192 = canvas192.getContext('2d');
      drawQRIcon(ctx192, 192);
      fs.writeFileSync(path.join(imgDir, 'icon-192x192.png'), canvas192.toBuffer('image/png'));
      console.log('✅ Generated 192x192 PWA icon');
      
      // Generate 512x512 icon
      const canvas512 = createCanvas(512, 512);
      const ctx512 = canvas512.getContext('2d');
      drawQRIcon(ctx512, 512);
      fs.writeFileSync(path.join(imgDir, 'icon-512x512.png'), canvas512.toBuffer('image/png'));
      console.log('✅ Generated 512x512 PWA icon');
      
      console.log('✅ PWA icons generated successfully');
      return true;
    } catch (error) {
      console.error('Error generating icons with canvas:', error);
      return false;
    }
  }
  return false;
}

// Create fallback icons if canvas generation fails
function createFallbackIcons() {
  console.log('Creating fallback PWA icons...');
  
  // Simple 1x1 pixel PNG files (transparent)
  const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  
  try {
    fs.writeFileSync(path.join(imgDir, 'icon-192x192.png'), transparentPixel);
    fs.writeFileSync(path.join(imgDir, 'icon-512x512.png'), transparentPixel);
    console.log('✅ Created fallback PWA icons');
    return true;
  } catch (error) {
    console.error('Error creating fallback icons:', error);
    return false;
  }
}

// Try to generate icons, fall back if needed
if (!generateIcons()) {
  createFallbackIcons();
}

