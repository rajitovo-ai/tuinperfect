/**
 * Tuin Perfect - Main JavaScript
 * Functionality for mobile menu and interactive elements
 */

// Mobile Menu Toggle
toggleMobileMenu = function() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
  mobileMenuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      toggleMobileMenu();
    });
  });
  
  // Smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Active nav link highlighting based on current page
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function(link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Form validation enhancement
  const forms = document.querySelectorAll('form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderBottomColor = 'var(--color-error)';
        } else {
          field.style.borderBottomColor = '';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        // Show error message
        const existingError = form.querySelector('.form-error');
        if (!existingError) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'form-error';
          errorDiv.style.cssText = 'color: var(--color-error); font-family: Work Sans, sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 16px;';
          errorDiv.textContent = 'Vul alle verplichte velden in.';
          form.insertBefore(errorDiv, form.firstChild);
        }
      } else {
        // Remove error message if exists
        const existingError = form.querySelector('.form-error');
        if (existingError) {
          existingError.remove();
        }
        // For demo purposes, prevent actual submission and show success
        e.preventDefault();
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = 'background-color: var(--color-primary-container); color: #000; font-family: Work Sans, sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; padding: 16px; margin-bottom: 16px; text-align: center;';
        successDiv.textContent = 'Bedankt voor uw aanvraag! We nemen binnen 24 uur contact met u op.';
        form.innerHTML = '';
        form.appendChild(successDiv);
      }
    });
  });
  
  // Gallery image hover effects enhancement
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function(item) {
    const img = item.querySelector('img');
    if (img) {
      item.addEventListener('mouseenter', function() {
        img.style.transform = 'scale(1.1)';
      });
      item.addEventListener('mouseleave', function() {
        img.style.transform = 'scale(1)';
      });
    }
  });
  
  // Contact image grayscale hover
  const contactImage = document.querySelector('.contact-image-side img');
  if (contactImage) {
    contactImage.parentElement.addEventListener('mouseenter', function() {
      contactImage.style.filter = 'grayscale(0%)';
    });
    contactImage.parentElement.addEventListener('mouseleave', function() {
      contactImage.style.filter = 'grayscale(100%)';
    });
  }
  
  // Hero image grayscale hover
  const heroFrame = document.querySelector('.hero-image-frame');
  if (heroFrame) {
    heroFrame.addEventListener('mouseenter', function() {
      const img = heroFrame.querySelector('img');
      if (img) img.style.filter = 'grayscale(0%)';
    });
    heroFrame.addEventListener('mouseleave', function() {
      const img = heroFrame.querySelector('img');
      if (img) img.style.filter = 'grayscale(100%)';
    });
  }
});

// Navbar scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.backgroundColor = 'rgba(18, 20, 20, 0.98)';
    } else {
      navbar.style.backgroundColor = 'rgba(18, 20, 20, 0.9)';
    }
    
    lastScroll = currentScroll;
  }
});

// Comparison slider functionality (for before/after)
function initComparisonSlider() {
  const comparisons = document.querySelectorAll('.comparison');
  comparisons.forEach(function(comparison) {
    const before = comparison.querySelector('.comparison-before');
    const handle = comparison.querySelector('.comparison-handle');
    let isDragging = false;
    
    function updateSlider(x) {
      const rect = comparison.getBoundingClientRect();
      let percentage = ((x - rect.left) / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      
      if (before) {
        before.style.width = percentage + '%';
      }
      if (handle) {
        handle.style.left = percentage + '%';
      }
    }
    
    comparison.addEventListener('mousedown', function(e) {
      isDragging = true;
      updateSlider(e.clientX);
    });
    
    comparison.addEventListener('touchstart', function(e) {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    });
    
    window.addEventListener('mousemove', function(e) {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });
    
    window.addEventListener('touchmove', function(e) {
      if (isDragging) {
        updateSlider(e.touches[0].clientX);
      }
    });
    
    window.addEventListener('mouseup', function() {
      isDragging = false;
    });
    
    window.addEventListener('touchend', function() {
      isDragging = false;
    });
  });
}

// Initialize comparison slider on load
document.addEventListener('DOMContentLoaded', initComparisonSlider);
