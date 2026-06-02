/* ============================================
   Tuin Perfect — Main JavaScript
   ============================================ */

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Navbar Scroll Effect
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

// Before/After Comparison Slider
function initComparisonSliders() {
  const comparisons = document.querySelectorAll('[data-comparison]');

  comparisons.forEach(container => {
    const before = container.querySelector('.before-overlay');
    const handle = container.querySelector('.comparison-handle');
    if (!before || !handle) return;

    let isDragging = false;

    function updatePosition(x) {
      const rect = container.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.width = pct + '%';
      handle.style.left = pct + '%';
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updatePosition(e.clientX);
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);
  });
}

// Fade-in animations on scroll
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.service-item, .service-card, .before-after-card, .gallery-item, .stat-item, .usp-item');

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.style.opacity = '1');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined">check</span> Verstuurd!';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initComparisonSliders();
  initScrollAnimations();
  initContactForm();
});
