// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Theme switcher functionality
  const themeToggle = document.getElementById('checkbox');
  const htmlElement = document.documentElement;
  
  // Function to set theme
  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      if (themeToggle) themeToggle.checked = true;
      document.body.classList.add('dark-mode');
    } else {
      if (themeToggle) themeToggle.checked = false;
      document.body.classList.remove('dark-mode');
    }
    
    // Dispatch an event that theme has changed
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }
  
  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
  
  // Toggle theme when switch is clicked
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      setTheme(this.checked ? 'dark' : 'light');
    });
  }
  
  // Listen for OS theme preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      const closeButton = alert.querySelector('.btn-close');
      if (closeButton) {
        closeButton.click();
      }
    }, 5000);
  });
  
  // Format verification code inputs
  const lastFourInput = document.getElementById('lastFourDigits');
  if (lastFourInput) {
    lastFourInput.addEventListener('input', function() {
      // Remove non-alphanumeric characters
      this.value = this.value.replace(/[^A-Za-z0-9]/g, '');
      
      // Convert to uppercase for better readability
      this.value = this.value.toUpperCase();
      
      // Limit to 4 characters
      if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
      }
    });
    
    // Auto-submit form when 4 characters are entered
    lastFourInput.addEventListener('keyup', function() {
      if (this.value.length === 4) {
        const form = this.closest('form');
        if (form) {
          // Add a small delay to allow the user to see what they typed
          setTimeout(() => {
            form.submit();
          }, 300);
        }
      }
    });
  }
  
  // Add active class to current nav item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.startsWith(href) && href !== '/') {
      link.classList.add('active');
    }
  });
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Add container styling for better UI
  const mainContainer = document.querySelector('.container.py-4');
  if (mainContainer) {
    mainContainer.classList.add('main-content');
  }
  
  // Add animation to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-container, .card, .how-it-works .step');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate__animated', 'animate__fadeInUp');
      }
    });
  };
  
  // Run once on page load
  animateOnScroll();
  
  // Add event listener for scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Add logo to navbar
  const navbarBrand = document.querySelector('.navbar-brand');
  if (navbarBrand) {
    const logoImg = document.createElement('img');
    logoImg.src = '/img/logo.svg';
    logoImg.alt = 'QR Verification';
    logoImg.style.height = '30px';
    logoImg.style.marginRight = '10px';
    
    // Replace the icon with the logo
    const icon = navbarBrand.querySelector('i');
    if (icon) {
      navbarBrand.replaceChild(logoImg, icon);
    } else {
      navbarBrand.prepend(logoImg);
    }
  }
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});