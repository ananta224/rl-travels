/**
 * reveal.js  –  R L Travels
 * Intersection-Observer based scroll reveal for .reveal elements
 */

(function () {
  'use strict';

  const REVEAL_CLASS   = 'reveal';
  const VISIBLE_CLASS  = 'is-visible';

  // If user prefers reduced motion, skip animations
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Show everything immediately
    document.querySelectorAll('.' + REVEAL_CLASS).forEach(el => {
      el.classList.add(VISIBLE_CLASS);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(VISIBLE_CLASS);
          // Unobserve once visible (fire once)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.10,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  // Observe all reveal elements
  document.querySelectorAll('.' + REVEAL_CLASS).forEach(el => {
    observer.observe(el);
  });
})();
