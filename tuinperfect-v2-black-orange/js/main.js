/* Tuin Perfect — Main JS */

// Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.toggle('active');
  document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', function () {

  // Close menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(function (link) {
    link.addEventListener('click', function () { toggleMobileMenu(); });
  });

  // Active nav
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Fade-in on scroll
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

  // Navbar scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.pageYOffset > 80);
  });

  // Before/After sliders
  document.querySelectorAll('.ba-slider-wrap').forEach(function (wrap) {
    const beforeEl = wrap.querySelector('.ba-slider-before');
    const line = wrap.querySelector('.ba-slider-line');
    const handle = wrap.querySelector('.ba-slider-handle');
    let dragging = false;

    function setPos(x) {
      const rect = wrap.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      if (beforeEl) beforeEl.style.width = pct + '%';
      if (line) line.style.left = pct + '%';
      if (handle) handle.style.left = pct + '%';
    }

    wrap.addEventListener('mousedown', function (e) { dragging = true; setPos(e.clientX); });
    wrap.addEventListener('touchstart', function (e) { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', function (e) { if (dragging) setPos(e.clientX); });
    window.addEventListener('touchmove', function (e) { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', function () { dragging = false; });
    window.addEventListener('touchend', function () { dragging = false; });
  });

  // Contact image hover (grayscale)
  const ctaImg = document.querySelector('.cta-image-side');
  if (ctaImg) {
    const img = ctaImg.querySelector('img');
    ctaImg.addEventListener('mouseenter', function () { if (img) img.style.filter = 'grayscale(0%)'; });
    ctaImg.addEventListener('mouseleave', function () { if (img) img.style.filter = 'grayscale(100%)'; });
  }

  // Form handling
  document.querySelectorAll('form.tp-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (f) {
        if (!f.value.trim()) { valid = false; f.style.borderBottomColor = '#e53e3e'; }
        else { f.style.borderBottomColor = ''; }
      });
      if (!valid) {
        if (feedback) { feedback.className = 'form-feedback error'; feedback.style.display = 'block'; feedback.textContent = 'Vul alle verplichte velden in.'; }
        return;
      }
      if (feedback) { feedback.className = 'form-feedback success'; feedback.style.display = 'block'; feedback.textContent = 'Bedankt! We nemen binnen 24 uur contact met u op.'; }
      form.querySelectorAll('input:not([type=submit]), textarea, select').forEach(function (f) { f.value = ''; });
    });
  });

  // Filter buttons (projecten page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item[data-cat]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectItems.forEach(function (item) {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

});
