/**
 * utils.js  –  R L Travels
 * ─────────────────────────────────────────────────────────────
 * Shared utilities:
 *   • WhatsApp floating button pulse
 *   • Back-to-top button show/hide + click
 *   • Active nav link underline on scroll
 *   • Smooth scroll for all anchor links
 *   • Lazy-load image error handler (already in HTML via onerror,
 *     but we also patch dynamically-added images)
 *   • Copyright year auto-update
 *   • Destination pill → WhatsApp pre-fill
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── 1. Copyright year ────────────────────────────────────── */
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── 2. Back-to-top button ────────────────────────────────── */
  var bttBtn = document.getElementById('back-to-top');

  if (bttBtn) {
    window.addEventListener('scroll', function () {
      var visible = window.scrollY > 480;
      bttBtn.classList.toggle('is-visible', visible);
      bttBtn.setAttribute('aria-hidden', String(!visible));
    }, { passive: true });

    bttBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. WhatsApp FAB pulse animation ─────────────────────── */
  var waFab = document.getElementById('wa-fab');

  if (waFab) {
    /* Pulse every 8 seconds after 4-second initial delay */
    function triggerPulse() {
      waFab.classList.add('is-pulsing');
      setTimeout(function () { waFab.classList.remove('is-pulsing'); }, 800);
    }
    setTimeout(function () {
      triggerPulse();
      setInterval(triggerPulse, 8000);
    }, 4000);
  }

  /* ── 4. Smooth scroll for all internal anchors ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id  = this.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) return;

      e.preventDefault();
      var navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
        10
      );
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 5. Destination pills → WhatsApp pre-fill ─────────────── */
  document.querySelectorAll('.destinations__pill').forEach(function (pill) {
    pill.setAttribute('role', 'button');
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('aria-label', 'Book a trip to ' + pill.textContent.trim());

    function openWhatsApp() {
      var dest    = pill.textContent.trim();
      var msg     = encodeURIComponent('Hi, I\'d like to book a trip to ' + dest + '. Please share details.');
      var waUrl   = 'https://wa.me/919238514756?text=' + msg;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    pill.addEventListener('click', openWhatsApp);
    pill.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWhatsApp(); }
    });
  });

  /* ── 6. Gallery lightbox (simple) ────────────────────────── */
  var overlay   = document.getElementById('lightbox-overlay');
  var lbImg     = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var lbClose   = document.getElementById('lightbox-close');
  var lbPrev    = document.getElementById('lightbox-prev');
  var lbNext    = document.getElementById('lightbox-next');

  var galleryItems = Array.from(document.querySelectorAll('.gallery__item img'));
  var currentIndex = 0;

  function openLightbox(index) {
    if (!overlay || !lbImg) return;
    currentIndex = index;
    var img = galleryItems[currentIndex];
    lbImg.src = img.src.replace(/w=\d+/, 'w=1400');
    lbImg.alt = img.alt;
    if (lbCaption) lbCaption.textContent = img.alt;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose && lbClose.focus();
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(function (img, i) {
    var item = img.closest('.gallery__item');
    if (item) {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'View image: ' + img.alt);
      item.style.cursor = 'pointer';

      item.addEventListener('click', function () { openLightbox(i); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    }
  });

  if (lbClose)   lbClose.addEventListener('click',   closeLightbox);
  if (lbPrev)    lbPrev.addEventListener('click',    showPrev);
  if (lbNext)    lbNext.addEventListener('click',    showNext);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

})();
