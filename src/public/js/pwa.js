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

// Add to Home Screen functionality
let deferredPrompt;
const addToHomeBtn = document.getElementById('add-to-home');

// Hide the button initially
if (addToHomeBtn) {
  addToHomeBtn.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the button if available
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'block';
    
    addToHomeBtn.addEventListener('click', () => {
      // Hide the button
      addToHomeBtn.style.display = 'none';
      
      // Show the prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

// Handle app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed to the home screen');
});