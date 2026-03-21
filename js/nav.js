/**
 * nav.js  –  R L Travels
 * Handles: scroll-aware background, mobile drawer, active-link highlight
 */

(function () {
  'use strict';

  const nav        = document.getElementById('site-nav');
  const hamburger  = document.getElementById('nav-hamburger');
  const drawer     = document.getElementById('nav-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('.nav__drawer-link') : [];

  // ── Scroll: add/remove .is-scrolled ──────────────────
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Hamburger toggle ──────────────────────────────────
  function toggleDrawer(force) {
    if (!hamburger || !drawer) return;
    const isOpen = force !== undefined ? force : !drawer.classList.contains('is-open');

    hamburger.classList.toggle('is-open', isOpen);
    drawer.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Prevent body scroll while drawer is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleDrawer());
  }

  // Close drawer when a link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleDrawer(false);
  });

  // ── Active link on scroll ─────────────────────────────
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav__link[data-section]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => sectionObserver.observe(sec));
})();
