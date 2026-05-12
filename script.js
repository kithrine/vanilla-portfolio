/* =============================================================
   NEON NOSTALGIA — script.js
   Sections:
     1. Star field generator
     2. Scroll-spy (active nav link)
     3. Scroll-reveal animations
     4. Mobile sidebar toggle
     5. Contact form handler
     6. Smooth scroll for nav links
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STAR FIELD ──────────────────────────────────────── */
  const starsContainer = document.getElementById('stars');
  if (starsContainer) {
    const STAR_COUNT = 120;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 55; // only upper half (sky area)
      const dur = (Math.random() * 4 + 2).toFixed(1);
      const delay = (Math.random() * 5).toFixed(1);

      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --dur: ${dur}s;
        --delay: ${delay}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);
  }

  /* ── 2. SCROLL-SPY ──────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === id);
      });

      // Swap "Now Playing" track name based on active section
      updateNowPlaying(id);
    });
  }, observerOptions);

  sections.forEach((s) => sectionObserver.observe(s));

  const trackMap = {
    home:       'Midnight Drive',
    about:      'Neon Daydream',
    skills:     'Synthwave Grid',
    experience: 'Retrograde',
    projects:   'Build Mode',
    contact:    'Outrun Tonight',
  };

  function updateNowPlaying(sectionId) {
    const el = document.getElementById('track-title');
    if (el && trackMap[sectionId]) {
      el.textContent = trackMap[sectionId];
    }
  }

  /* ── 3. SCROLL-REVEAL ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.section-card, .skill-item, .project-card, .timeline-item');

  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── 4. MOBILE SIDEBAR ──────────────────────────────────── */
  const sidebar    = document.getElementById('sidebar');
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const mainContent = document.getElementById('main-content');

  function closeSidebar() {
    sidebar.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn?.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close sidebar when a nav link is clicked on mobile
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Close sidebar when clicking outside it on mobile
  mainContent?.addEventListener('click', () => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  /* ── 5. CONTACT FORM ────────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'var(--pink)');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'var(--pink)');
      return;
    }

    // Simulated send — replace with your own fetch/EmailJS/Formspree call
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'SENDING…';
    btn.disabled = true;

    setTimeout(() => {
      showStatus('Message sent! I\'ll get back to you soon ✦', 'var(--cyan)');
      form.reset();
      btn.textContent = 'SEND MESSAGE ✦';
      btn.disabled = false;
    }, 1200);
  });

  function showStatus(msg, color) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.style.color = color;
    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* ── 6. SMOOTH SCROLL ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
