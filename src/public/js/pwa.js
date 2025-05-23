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
let deferredPrompt;
window.deferredPrompt = null; // Make it globally available

// Function to initialize the install button
function initInstallButton() {
  const addToHomeBtn = document.getElementById('add-to-home');
  const installGuideBtn = document.getElementById('install-guide-btn');
  
  // Hide the button initially
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'none';
  }
  
  // Set up the install button click handler
  function setupInstallButton(button) {
    if (!button) return;
    
    button.addEventListener('click', () => {
      if (!window.deferredPrompt) {
        // If no prompt is available, redirect to install guide
        window.location.href = '/install';
        return;
      }
      
      // Hide the button
      button.style.display = 'none';
      
      // Show the prompt
      window.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        window.deferredPrompt = null;
      });
    });
  }
  
  // Set up both buttons
  setupInstallButton(addToHomeBtn);
  setupInstallButton(installGuideBtn);
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  window.deferredPrompt = e;
  
  // Show the install button if available
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'block';
  }
});

// Initialize the install button when the DOM is loaded
document.addEventListener('DOMContentLoaded', initInstallButton);

// Handle app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed to the home screen');
});