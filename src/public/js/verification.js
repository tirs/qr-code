/**
 * QR Code Verification System - Verification Page JavaScript
 * Enhances the verification page with animations and improved user experience
 */

document.addEventListener('DOMContentLoaded', function() {
  // Format the last 4 characters input
  const lastFourInput = document.getElementById('lastFourDigits');
  if (lastFourInput) {
    // Focus the input field when the page loads
    lastFourInput.focus();
    
    lastFourInput.addEventListener('input', function(e) {
      // Store the current cursor position
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      // Remove non-alphanumeric characters
      const filteredValue = this.value.replace(/[^A-Za-z0-9]/g, '');
      
      // Convert to uppercase for better readability
      const upperValue = filteredValue.toUpperCase();
      
      // Limit to 4 characters
      const finalValue = upperValue.slice(0, 4);
      
      // Only update if the value has changed
      if (this.value !== finalValue) {
        this.value = finalValue;
        
        // Restore cursor position if possible
        if (start && end) {
          this.setSelectionRange(start, end);
        }
      }
      
      // Auto-submit when 4 characters are entered
      if (finalValue.length === 4 && document.querySelector('form')) {
        // Add visual feedback
        this.classList.add('is-valid');
        
        // Wait a moment before submitting to show the visual feedback
        setTimeout(() => {
          if (document.querySelector('form')) {
            document.querySelector('form').submit();
          }
        }, 500);
      }
    });
  }
  
  // Add animation to success message
  const successMessage = document.querySelector('.verification-success');
  if (successMessage) {
    // Add confetti effect for successful verification
    createConfetti();
  }
  
  // Add animation to error message
  const errorMessage = document.querySelector('.alert-danger');
  if (errorMessage) {
    errorMessage.classList.add('animate__animated', 'animate__headShake');
  }
});

// Simple confetti effect for successful verification
function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  document.body.appendChild(confettiContainer);
  
  const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confettiContainer.appendChild(confetti);
  }
  
  // Remove confetti after animation completes
  setTimeout(() => {
    confettiContainer.remove();
  }, 6000);
}