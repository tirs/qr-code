# PWA Implementation for QR Code Verification System

This document outlines the Progressive Web App (PWA) implementation for the QR Code Verification System.

## What is a PWA?

A Progressive Web App (PWA) is a type of application software delivered through the web, built using common web technologies including HTML, CSS, and JavaScript. It is intended to work on any platform that uses a standards-compliant browser, including both desktop and mobile devices.

## Features Implemented

- **Installable**: Users can add the app to their home screen
- **Offline Support**: Basic functionality works without an internet connection
- **Responsive**: Works on all devices and screen sizes
- **App-like Experience**: Feels like a native app with full-screen mode

## Setup Instructions

### Icon Generation

1. Visit `/generate-icons` in your development environment
2. Click "Generate Icons" button
3. Download both icon sizes
4. Save them to the `/src/public/img/` directory as:
   - `icon-192x192.png`
   - `icon-512x512.png`

### Testing PWA Features

1. **Installation**:
   - Open the app in Chrome
   - You should see an "Install App" button in the bottom right corner
   - Alternatively, you can use the browser's menu to install the app

2. **Offline Testing**:
   - Open the Network tab in Chrome DevTools
   - Check "Offline" to simulate offline mode
   - Refresh the page - you should still be able to access basic functionality
   - Navigate to different pages to test offline capabilities

## Technical Implementation

The PWA implementation includes:

1. **Web App Manifest** (`/src/public/manifest.json`):
   - Defines how the app appears when installed
   - Specifies icons, colors, and behavior

2. **Service Worker** (`/src/public/sw.js`):
   - Caches essential assets for offline use
   - Handles offline navigation
   - Manages cache updates

3. **PWA Registration** (`/src/public/js/pwa.js`):
   - Registers the service worker
   - Handles "Add to Home Screen" functionality

## Customization

To customize the PWA implementation:

1. **Icons**: Replace the generated icons with your own branded versions
2. **Colors**: Update theme colors in `manifest.json` and meta tags
3. **Offline Experience**: Modify the offline page (`/src/views/offline.ejs`)
4. **Cache Strategy**: Adjust which files are cached in `sw.js`

## Browser Support

PWA features are supported in:
- Chrome (desktop & mobile)
- Edge
- Firefox
- Safari (partial support)
- Samsung Internet

## Additional Resources

- [Google's PWA Documentation](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Lighthouse PWA Audits](https://developers.google.com/web/tools/lighthouse)