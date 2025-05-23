/**
 * PWA Debug Helper
 * This script helps diagnose PWA installation issues
 */

(function() {
  // Only run in development mode
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.includes('railway.app')) {
    return;
  }
  
  // Create debug container
  function createDebugContainer() {
    const container = document.createElement('div');
    container.id = 'pwa-debug-container';
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(0,0,0,0.8)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.fontSize = '12px';
    container.style.maxWidth = '300px';
    container.style.maxHeight = '200px';
    container.style.overflow = 'auto';
    
    document.body.appendChild(container);
    return container;
  }
  
  // Log PWA-related information
  function logPWAInfo() {
    const container = document.getElementById('pwa-debug-container') || createDebugContainer();
    
    const info = [
      `<strong>PWA Debug Info:</strong>`,
      `Protocol: ${window.location.protocol}`,
      `Display Mode: ${window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}`,
      `iOS Device: ${/iPhone|iPad|iPod/.test(navigator.userAgent)}`,
      `Install Prompt: ${window.deferredPrompt ? 'Available' : 'Not available'}`,
      `Service Worker: ${navigator.serviceWorker ? 'Supported' : 'Not supported'}`,
      `<hr>`,
      `<button id="pwa-debug-close" style="background: #f44336; border: none; color: white; padding: 5px; border-radius: 3px;">Close</button>`
    ];
    
    container.innerHTML = info.join('<br>');
    
    // Add close button handler
    document.getElementById('pwa-debug-close').addEventListener('click', function() {
      container.style.display = 'none';
    });
  }
  
  // Log when the beforeinstallprompt event is fired
  window.addEventListener('beforeinstallprompt', (e) => {
    const container = document.getElementById('pwa-debug-container');
    if (container) {
      container.innerHTML += '<br><strong>beforeinstallprompt event fired!</strong>';
    }
  });
  
  // Log when the app is installed
  window.addEventListener('appinstalled', (e) => {
    const container = document.getElementById('pwa-debug-container');
    if (container) {
      container.innerHTML += '<br><strong>App was installed!</strong>';
    }
  });
  
  // Initialize on page load
  window.addEventListener('load', () => {
    // Wait a bit to ensure all other scripts have run
    setTimeout(logPWAInfo, 1000);
    
    // Add keyboard shortcut (Ctrl+Shift+D) to show debug info
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const container = document.getElementById('pwa-debug-container');
        if (container) {
          container.style.display = container.style.display === 'none' ? 'block' : 'none';
        } else {
          logPWAInfo();
        }
      }
    });
  });
})();