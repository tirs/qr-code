// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Force update by unregistering any existing service workers first
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
        console.log('Unregistered old service worker');
      }
      
      // Register the service worker
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check for updates
          registration.update();
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  });
}

// Add to Home Screen functionality
window.deferredPrompt = null; // Make it globally available

// Log installation eligibility
console.log('PWA installation status:');
console.log('- Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
console.log('- iOS:', /iPhone|iPad|iPod/.test(navigator.userAgent));
console.log('- https:', window.location.protocol === 'https:');

// Function to show the install button
function showInstallButton() {
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    console.log('Making install button visible');
    addToHomeBtn.style.display = 'block';
  }
}

// Function to hide the install button
function hideInstallButton() {
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'none';
  }
}

// Function to handle the installation process
function handleInstallClick(e) {
  console.log('Install button clicked');
  
  // Get the button that was clicked
  const button = e.target.closest('button');
  if (!button) return;
  
  if (!window.deferredPrompt) {
    console.log('No installation prompt available, redirecting to install guide');
    window.location.href = '/install';
    return;
  }
  
  console.log('Showing installation prompt');
  
  // Show the prompt
  window.deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  window.deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the installation prompt');
      hideInstallButton();
    } else {
      console.log('User dismissed the installation prompt');
    }
    window.deferredPrompt = null;
  }).catch(err => {
    console.error('Error with installation prompt:', err);
  });
}

// Function to initialize the install buttons
function initInstallButtons() {
  console.log('Initializing install buttons');
  
  // Main install button in the footer
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    console.log('Found main install button');
    addToHomeBtn.addEventListener('click', handleInstallClick);
    
    // Hide initially, will be shown if installation is available
    addToHomeBtn.style.display = 'none';
  }
  
  // Install button on the installation guide page
  const installGuideBtn = document.getElementById('install-guide-btn');
  if (installGuideBtn) {
    console.log('Found guide page install button');
    installGuideBtn.addEventListener('click', handleInstallClick);
  }
  
  // If we already have a deferred prompt, show the button
  if (window.deferredPrompt) {
    showInstallButton();
  }
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Received beforeinstallprompt event');
  
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  window.deferredPrompt = e;
  
  // Show the install button
  showInstallButton();
});

// Initialize the install buttons when the DOM is loaded
document.addEventListener('DOMContentLoaded', initInstallButtons);

// Handle app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed to the home screen');
});