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

  // ── Premium Before/After Sliders ──────────────────────────────────────────
  document.querySelectorAll('.ba-slider-wrap').forEach(function (wrap) {
    const beforeEl = wrap.querySelector('.ba-slider-before');
    const line     = wrap.querySelector('.ba-slider-line');
    const handle   = wrap.querySelector('.ba-slider-handle');
    if (!beforeEl || !line || !handle) return;

    // Use clip-path for crisp hardware-accelerated reveal
    beforeEl.style.clipPath  = 'inset(0 50% 0 0)';
    beforeEl.style.width     = '100%';
    beforeEl.style.position  = 'absolute';
    beforeEl.style.inset     = '0';
    line.style.left          = '50%';
    handle.style.left        = '50%';

    let current = 50;   // current displayed %
    let target  = 50;   // target %
    let dragging = false;
    let rafId    = null;

    // Spring physics loop
    function springTick() {
      const diff = target - current;
      if (Math.abs(diff) < 0.05) {
        current = target;
        applyPos(current);
        rafId = null;
        return;
      }
      current += diff * 0.14;   // spring factor — higher = snappier
      applyPos(current);
      rafId = requestAnimationFrame(springTick);
    }

    function applyPos(pct) {
      const p = Math.max(1, Math.min(99, pct));
      beforeEl.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
      line.style.left         = p + '%';
      handle.style.left       = p + '%';
    }

    function setTarget(x) {
      const rect = wrap.getBoundingClientRect();
      target = Math.max(2, Math.min(98, ((x - rect.left) / rect.width) * 100));
      if (!rafId) rafId = requestAnimationFrame(springTick);
    }

    // Cursor feedback
    wrap.style.cursor = 'ew-resize';
    handle.style.cursor = 'ew-resize';

    // Mouse
    handle.addEventListener('mousedown', function (e) {
      dragging = true;
      e.preventDefault();
      wrap.classList.add('ba-dragging');
    });
    wrap.addEventListener('mousedown', function (e) {
      dragging = true;
      setTarget(e.clientX);
      wrap.classList.add('ba-dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (dragging) setTarget(e.clientX);
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      wrap.classList.remove('ba-dragging');
    });

    // Touch
    handle.addEventListener('touchstart', function (e) {
      dragging = true;
      wrap.classList.add('ba-dragging');
    }, { passive: true });
    wrap.addEventListener('touchstart', function (e) {
      dragging = true;
      setTarget(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (dragging) setTarget(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', function () {
      dragging = false;
      wrap.classList.remove('ba-dragging');
    });

    // Keyboard: arrow keys when handle is focused
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Voor/Na vergelijking schuifregelaar');
    handle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { target = Math.max(2,  target - 2); if (!rafId) rafId = requestAnimationFrame(springTick); }
      if (e.key === 'ArrowRight') { target = Math.min(98, target + 2); if (!rafId) rafId = requestAnimationFrame(springTick); }
    });

    // Intro reveal animation: sweep from 0→50 on first scroll-into-view
    const introObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          current = 2;
          target  = 50;
          if (!rafId) rafId = requestAnimationFrame(springTick);
          introObs.unobserve(wrap);
        }
      });
    }, { threshold: 0.3 });
    introObs.observe(wrap);

    // Hint pulse: wiggle handle once after intro to signal interactivity
    setTimeout(function () {
      if (!dragging) {
        handle.classList.add('ba-hint');
        setTimeout(function () { handle.classList.remove('ba-hint'); }, 1200);
      }
    }, 1800);
  });

  // ── Teller-animatie op stats ──────────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length) {
    const countObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target   = parseFloat(el.dataset.count);
        const suffix   = el.dataset.suffix  || '';
        const prefix   = el.dataset.prefix  || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1600;
        const start    = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = eased * target;
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function(el) { countObs.observe(el); });
  }

  // ── Scroll-to-top knop ────────────────────────────────────────────────────
  var scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      scrollTopBtn.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });
  }

  // ── Page fade-transition ──────────────────────────────────────────────────
  document.body.classList.add('page-loaded');
  document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('tel:') || href.startsWith('mailto:') ||
        href.startsWith('https:') || link.target === '_blank') return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      document.body.classList.add('page-leaving');
      setTimeout(function() { window.location.href = href; }, 280);
    });
  });

  // Contact image hover (grayscale)
  const ctaImg = document.querySelector('.cta-image-side');
  if (ctaImg) {
    const img = ctaImg.querySelector('img');
    ctaImg.addEventListener('mouseenter', function () { if (img) img.style.filter = 'grayscale(0%)'; });
    ctaImg.addEventListener('mouseleave', function () { if (img) img.style.filter = 'grayscale(100%)'; });
  }

  // ── Mailformulier handling (AJAX naar mail.php) ─────────────────────────
  let mailCsrfToken = '';

  // Haal CSRF-token op bij laden
  fetch('mail.php?csrf=1')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && data.csrf) {
        mailCsrfToken = data.csrf;
        document.querySelectorAll('form.tp-form input[name="csrf_token"]').forEach(function (el) { el.value = mailCsrfToken; });
      }
    })
    .catch(function () { /* fallback: token blijft leeg, server geeft dan fout */ });

  document.querySelectorAll('form.tp-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      const submitBtn = form.querySelector('button[type="submit"]');
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

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Bezig met versturen…'; }
      if (feedback) { feedback.className = 'form-feedback'; feedback.style.display = 'block'; feedback.textContent = ''; }

      const formData = new FormData(form);
      if (mailCsrfToken) { formData.set('csrf_token', mailCsrfToken); }

      fetch('mail.php', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (submitBtn) { submitBtn.disabled = false; }
        if (data && data.success) {
          if (feedback) { feedback.className = 'form-feedback success'; feedback.style.display = 'block'; feedback.textContent = data.message || 'Bedankt! We nemen binnen 24 uur contact met u op.'; }
          form.querySelectorAll('input:not([type=submit]):not([type=hidden]), textarea, select').forEach(function (f) { f.value = ''; });
        } else {
          if (feedback) { feedback.className = 'form-feedback error'; feedback.style.display = 'block'; feedback.textContent = (data && data.message) ? data.message : 'Er is iets misgegaan. Probeer het later opnieuw.'; }
        }
      })
      .catch(function () {
        if (submitBtn) { submitBtn.disabled = false; }
        if (feedback) { feedback.className = 'form-feedback error'; feedback.style.display = 'block'; feedback.textContent = 'Er is iets misgegaan bij het versturen. Controleer uw internetverbinding.'; }
      });
    });
  });

  // Cookie Consent
  const cookieBanner = document.getElementById('cookieConsent');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'block';
    const acceptBtn = document.getElementById('cookieAccept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.style.display = 'none';
      });
    }
  } else if (cookieBanner) {
    cookieBanner.style.display = 'none';
  }

});
