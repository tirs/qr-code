/**
 * PWA Test Script
 * This script helps test PWA functionality
 */

// Check if service worker is registered
function checkServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        if (registrations.length > 0) {
          console.log('✅ Service Worker is registered');
          registrations.forEach(registration => {
            console.log('Service Worker scope:', registration.scope);
          });
        } else {
          console.error('❌ No Service Worker registrations found');
        }
      })
      .catch(error => {
        console.error('❌ Error checking Service Worker:', error);
      });
  } else {
    console.error('❌ Service Workers not supported in this browser');
  }
}

// Check if app is installed
function checkInstallState() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ App is installed and running in standalone mode');
    return true;
  } else if (window.navigator.standalone === true) {
    console.log('✅ App is installed and running in standalone mode (iOS)');
    return true;
  } else {
    console.log('ℹ️ App is running in browser mode (not installed)');
    return false;
  }
}

// Check cache storage
function checkCacheStorage() {
  if ('caches' in window) {
    caches.keys()
      .then(cacheNames => {
        if (cacheNames.length > 0) {
          console.log('✅ Cache Storage is available and contains caches:', cacheNames);
          
          // Check specific cache
          return caches.open('qr-verify-v1');
        } else {
          console.warn('⚠️ No caches found in Cache Storage');
          return null;
        }
      })
      .then(cache => {
        if (cache) {
          return cache.keys();
        }
        return [];
      })
      .then(requests => {
        if (requests.length > 0) {
          console.log(`✅ Found ${requests.length} cached resources`);
        } else {
          console.warn('⚠️ No resources found in cache');
        }
      })
      .catch(error => {
        console.error('❌ Error checking Cache Storage:', error);
      });
  } else {
    console.error('❌ Cache Storage API not supported in this browser');
  }
}

// Check manifest
function checkManifest() {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  
  if (manifestLink) {
    console.log('✅ Web App Manifest is linked:', manifestLink.href);
    
    // Fetch and validate manifest
    fetch(manifestLink.href)
      .then(response => response.json())
      .then(manifest => {
        console.log('✅ Manifest loaded successfully');
        
        // Check required fields
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length === 0) {
          console.log('✅ Manifest contains all required fields');
        } else {
          console.warn('⚠️ Manifest is missing fields:', missingFields.join(', '));
        }
        
        // Check icons
        if (manifest.icons && manifest.icons.length > 0) {
          const has192 = manifest.icons.some(icon => icon.sizes === '192x192');
          const has512 = manifest.icons.some(icon => icon.sizes === '512x512');
          
          if (has192 && has512) {
            console.log('✅ Manifest has required icon sizes (192x192, 512x512)');
          } else {
            console.warn('⚠️ Manifest is missing required icon sizes');
          }
        }
      })
      .catch(error => {
        console.error('❌ Error loading manifest:', error);
      });
  } else {
    console.error('❌ No Web App Manifest found in the document');
  }
}

// Run all tests
function runPWATests() {
  console.log('🧪 Running PWA Tests...');
  console.log('------------------------');
  
  checkServiceWorker();
  const isInstalled = checkInstallState();
  checkCacheStorage();
  checkManifest();
  
  console.log('------------------------');
  console.log(`🧪 PWA Test Summary: App is ${isInstalled ? 'installed' : 'not installed'}`);
  console.log('To run more tests, use Lighthouse in Chrome DevTools');
}

// Run tests when page is fully loaded
window.addEventListener('load', () => {
  // Add a button to run tests
  const testButton = document.createElement('button');
  testButton.textContent = 'Run PWA Tests';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '70px';
  testButton.style.right = '20px';
  testButton.style.zIndex = '1000';
  testButton.style.padding = '8px 16px';
  testButton.style.backgroundColor = '#4e73df';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  testButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  testButton.addEventListener('click', runPWATests);
  
  // Only add in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.body.appendChild(testButton);
  }
});