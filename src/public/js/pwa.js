// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Global variable to store the deferred prompt
let deferredPrompt;

// Function to show the install button
function showInstallButton() {
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.classList.remove('d-none');
  }
  
  const installGuideBtn = document.getElementById('install-guide-btn');
  if (installGuideBtn) {
    installGuideBtn.disabled = false;
  }
}

// Function to hide the install button
function hideInstallButton() {
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.classList.add('d-none');
  }
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Store the event for later use
  deferredPrompt = e;
  
  // Show the install button
  showInstallButton();
  
  console.log('Install prompt ready');
});

// Set up the install button click handlers
document.addEventListener('DOMContentLoaded', () => {
  // Main install button
  const addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.addEventListener('click', installApp);
  }
  
  // Install button on the guide page
  const installGuideBtn = document.getElementById('install-guide-btn');
  if (installGuideBtn) {
    installGuideBtn.addEventListener('click', installApp);
  }
});

// Function to handle the installation
function installApp() {
  if (!deferredPrompt) {
    console.log('No installation prompt available');
    window.location.href = '/install';
    return;
  }
  
  // Show the prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the installation');
      hideInstallButton();
    } else {
      console.log('User declined the installation');
    }
    
    // Clear the prompt
    deferredPrompt = null;
  });
}

// Handle app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed');
  hideInstallButton();
});

// Handle app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed to the home screen');
});