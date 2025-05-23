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
      
      // Update meta theme-color for dark mode
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1e1e2d');
      }
      
      // Fix badge styling for dark mode
      document.querySelectorAll('.badge.bg-light.text-dark').forEach(badge => {
        badge.classList.remove('bg-light', 'text-dark');
        badge.classList.add('bg-secondary', 'text-light');
      });
      
      // Fix card headers with bg-white class
      document.querySelectorAll('.card-header.bg-white').forEach(header => {
        header.classList.remove('bg-white');
      });
      
      // Fix card footers with bg-white class
      document.querySelectorAll('.card-footer.bg-white').forEach(footer => {
        footer.classList.remove('bg-white');
      });
      
      // Fix form controls
      document.querySelectorAll('.form-control, .form-select').forEach(control => {
        control.classList.add('dark-input');
      });
      
      // Fix tables
      document.querySelectorAll('.table').forEach(table => {
        table.classList.add('table-dark');
      });
      
      // Fix list groups
      document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.add('dark-list-item');
      });
      
      // Fix modals
      document.querySelectorAll('.modal-content').forEach(modal => {
        modal.classList.add('dark-modal');
      });
      
    } else {
      if (themeToggle) themeToggle.checked = false;
      document.body.classList.remove('dark-mode');
      
      // Update meta theme-color for light mode
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#4e73df');
      }
      
      // Restore badge styling for light mode
      document.querySelectorAll('.badge.bg-secondary.text-light').forEach(badge => {
        if (!badge.classList.contains('rounded-pill')) {
          badge.classList.remove('bg-secondary', 'text-light');
          badge.classList.add('bg-light', 'text-dark');
        }
      });
      
      // Restore form controls
      document.querySelectorAll('.form-control, .form-select').forEach(control => {
        control.classList.remove('dark-input');
      });
      
      // Restore tables
      document.querySelectorAll('.table').forEach(table => {
        table.classList.remove('table-dark');
      });
      
      // Restore list groups
      document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('dark-list-item');
      });
      
      // Restore modals
      document.querySelectorAll('.modal-content').forEach(modal => {
        modal.classList.remove('dark-modal');
      });
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
  
  // Listen for theme changes to update UI elements
  document.addEventListener('themeChanged', function(e) {
    const theme = e.detail.theme;
    updateUIForTheme(theme);
  });
  
  // Function to update UI elements based on theme
  function updateUIForTheme(theme) {
    // Update table styling
    const tables = document.querySelectorAll('.table');
    if (theme === 'dark') {
      // Update tables
      tables.forEach(table => {
        table.classList.add('table-dark');
      });
      
      // Update card headers with bg-white class
      document.querySelectorAll('.card-header.bg-white').forEach(header => {
        header.classList.remove('bg-white');
      });
      
      // Update card footers with bg-white class
      document.querySelectorAll('.card-footer.bg-white').forEach(footer => {
        footer.classList.remove('bg-white');
      });
      
      // Update card headers
      document.querySelectorAll('.card-header').forEach(header => {
        header.classList.add('text-light');
      });
      
      // Update list group items
      document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.add('dark-list-item');
      });
      
      // Update badges
      document.querySelectorAll('.badge.bg-light').forEach(badge => {
        badge.classList.remove('bg-light', 'text-dark');
        badge.classList.add('bg-secondary', 'text-light');
      });
      
      // Update form controls
      document.querySelectorAll('.form-control, .form-select').forEach(control => {
        control.classList.add('dark-input');
      });
      
      // Update modals
      document.querySelectorAll('.modal-content').forEach(modal => {
        modal.classList.add('dark-modal');
      });
      
      // Update text-muted elements
      document.querySelectorAll('.text-muted').forEach(element => {
        element.style.color = 'var(--text-muted) !important';
      });
      
      // Update buttons
      document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.classList.add('dark-btn-outline');
      });
      
    } else {
      // Update tables
      tables.forEach(table => {
        table.classList.remove('table-dark');
      });
      
      // Update card headers
      document.querySelectorAll('.card-header').forEach(header => {
        header.classList.remove('text-light');
      });
      
      // Update list group items
      document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('dark-list-item');
      });
      
      // Update badges
      document.querySelectorAll('.badge.bg-secondary').forEach(badge => {
        if (!badge.classList.contains('rounded-pill')) {
          badge.classList.remove('bg-secondary', 'text-light');
          badge.classList.add('bg-light', 'text-dark');
        }
      });
      
      // Update form controls
      document.querySelectorAll('.form-control, .form-select').forEach(control => {
        control.classList.remove('dark-input');
      });
      
      // Update modals
      document.querySelectorAll('.modal-content').forEach(modal => {
        modal.classList.remove('dark-modal');
      });
      
      // Update buttons
      document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.classList.remove('dark-btn-outline');
      });
    }
    
    // Add a custom event that theme has been updated
    document.dispatchEvent(new CustomEvent('themeUpdated', { detail: { theme } }));
  }
  
  // Function to fix any remaining dark mode issues
  function fixRemainingDarkModeIssues() {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      // Fix any bg-white classes that might be added dynamically
      document.querySelectorAll('.bg-white').forEach(element => {
        element.classList.remove('bg-white');
      });
      
      // Fix any text-dark classes that might cause visibility issues
      document.querySelectorAll('.text-dark').forEach(element => {
        if (!element.classList.contains('btn') && !element.closest('.badge')) {
          element.classList.remove('text-dark');
          element.classList.add('text-light');
        }
      });
      
      // Fix any hardcoded white background styles
      document.querySelectorAll('[style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: #ffffff"]').forEach(element => {
        element.style.backgroundColor = 'var(--bg-secondary)';
      });
      
      // Fix any hardcoded black text styles
      document.querySelectorAll('[style*="color: black"], [style*="color: #000"], [style*="color: #000000"]').forEach(element => {
        element.style.color = 'var(--text-color)';
      });
    }
  }
  
  // Run initial UI update with a slight delay to ensure DOM is loaded
  setTimeout(() => {
    updateUIForTheme(localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light'));
    fixRemainingDarkModeIssues();
  }, 100);
  
  // Add a mutation observer to fix dark mode issues for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      fixRemainingDarkModeIssues();
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
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
    
    // Make container responsive to screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        mainContainer.classList.add('px-2');
        mainContainer.classList.remove('px-4');
      } else {
        mainContainer.classList.add('px-4');
        mainContainer.classList.remove('px-2');
      }
    };
    
    // Initial call
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
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
  
  // Add auto-refresh functionality for dashboard
  if (window.location.pathname.includes('/admin/dashboard')) {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
      // Create refresh button
      const dashboardHeader = document.querySelector('.d-flex.justify-content-between.align-items-center.mb-4');
      if (dashboardHeader) {
        const refreshButton = document.createElement('button');
        refreshButton.className = 'btn btn-outline-primary ms-2';
        refreshButton.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>Refresh';
        refreshButton.id = 'refreshDashboard';
        
        // Add auto-refresh toggle
        const autoRefreshContainer = document.createElement('div');
        autoRefreshContainer.className = 'd-flex align-items-center ms-2';
        autoRefreshContainer.innerHTML = `
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="autoRefreshToggle">
            <label class="form-check-label" for="autoRefreshToggle">Auto-refresh</label>
          </div>
        `;
        
        // Add elements to header
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex align-items-center';
        buttonContainer.appendChild(refreshButton);
        buttonContainer.appendChild(autoRefreshContainer);
        
        // Find the add product button and insert before it
        const addProductButton = dashboardHeader.querySelector('button');
        if (addProductButton) {
          dashboardHeader.insertBefore(buttonContainer, addProductButton);
        } else {
          dashboardHeader.appendChild(buttonContainer);
        }
        
        // Set up refresh functionality
        let refreshInterval;
        const toggleAutoRefresh = (enabled) => {
          if (enabled) {
            refreshInterval = setInterval(() => {
              // Show loading indicator
              const loadingIndicator = document.createElement('div');
              loadingIndicator.className = 'position-fixed top-0 start-0 w-100 bg-primary text-white text-center py-1';
              loadingIndicator.style.zIndex = '9999';
              loadingIndicator.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Refreshing dashboard...';
              document.body.appendChild(loadingIndicator);
              
              // Reload after a short delay to show the indicator
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }, 60000); // Refresh every minute
          } else {
            clearInterval(refreshInterval);
          }
        };
        
        // Add event listeners
        document.getElementById('refreshDashboard').addEventListener('click', () => {
          // Show loading indicator
          const loadingIndicator = document.createElement('div');
          loadingIndicator.className = 'position-fixed top-0 start-0 w-100 bg-primary text-white text-center py-1';
          loadingIndicator.style.zIndex = '9999';
          loadingIndicator.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Refreshing dashboard...';
          document.body.appendChild(loadingIndicator);
          
          // Reload after a short delay to show the indicator
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
        
        document.getElementById('autoRefreshToggle').addEventListener('change', function() {
          toggleAutoRefresh(this.checked);
          
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'position-fixed bottom-0 end-0 p-3';
          toast.style.zIndex = '9999';
          toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header">
                <i class="bi bi-clock me-2"></i>
                <strong class="me-auto">Auto-refresh</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div class="toast-body">
                Auto-refresh is now ${this.checked ? 'enabled' : 'disabled'}
              </div>
            </div>
          `;
          document.body.appendChild(toast);
          
          // Remove toast after 3 seconds
          setTimeout(() => {
            toast.remove();
          }, 3000);
        });
      }
    }, 500); // Small delay to ensure DOM is fully loaded
  }
  
  // Add spinning animation for refresh icon
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 1s linear infinite;
      display: inline-block;
    }
  `;
  document.head.appendChild(style);
  
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
  
  // Add click-to-copy functionality for verification codes
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('verification-code-badge') || 
        e.target.closest('.verification-code-badge')) {
      
      const badge = e.target.classList.contains('verification-code-badge') ? 
                    e.target : e.target.closest('.verification-code-badge');
      const code = badge.textContent.trim();
      
      // Copy to clipboard
      navigator.clipboard.writeText(code).then(() => {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
          <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <i class="bi bi-clipboard-check me-2 text-success"></i>
              <strong class="me-auto">Copied!</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Code <strong>${code}</strong> copied to clipboard
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        
        // Add visual feedback to the badge
        badge.classList.add('bg-success', 'text-white');
        setTimeout(() => {
          badge.classList.remove('bg-success', 'text-white');
        }, 1000);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  });
});