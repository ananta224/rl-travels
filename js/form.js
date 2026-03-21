/**
 * form.js  –  R L Travels
 * ─────────────────────────────────────────────────────────────
 * Handles:
 *   - Client-side validation (name, phone, message)
 *   - Submission to Google Sheets via Apps Script Web App
 *   - Toast notifications
 *   - Promo code clipboard copy
 *   - Travel date minimum (today)
 *
 * SETUP:
 *   1. Deploy google-apps-script/Code.gs as a Web App
 *   2. Paste the Web App URL into the form's data-sheet-url attribute
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var form      = document.getElementById('enquiry-form');
  var toast     = document.getElementById('toast');
  var promoCode = document.getElementById('promo-code');
  var copyHint  = document.getElementById('copy-hint');
  var toastTimer = null;

  /* ── Set date min = today ──────────────────────────── */
  var dateInput = document.getElementById('travel-date');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  /* ── Toast ─────────────────────────────────────────── */
  function showToast(msg, type, ms) {
    if (!toast) return;
    ms = ms || 4000;
    toast.textContent = msg;
    toast.style.background =
      type === 'success' ? '#2E7D52' :
      type === 'error'   ? '#C0392B' : '#1A1209';
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, ms);
  }

  /* ── Validation rules ──────────────────────────────── */
  var RULES = {
    name: function (v) {
      if (!v) return 'Full name is required.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    phone: function (v) {
      if (!v) return 'Phone number is required.';
      var d = v.replace(/[\s\-().+]/g, '');
      if (!/^[6-9]\d{9}$/.test(d)) return 'Enter a valid 10-digit Indian mobile number.';
      return '';
    },
    message: function (v) {
      if (!v) return 'Please describe your travel requirements.';
      if (v.length < 10) return 'Please provide more detail (at least 10 characters).';
      return '';
    }
  };

  /* ── Field error display ───────────────────────────── */
  function setFieldState(input, errorMsg) {
    var wrapper = input.closest('.form-group');
    if (!wrapper) return;
    var errorEl = wrapper.querySelector('.form-error');

    if (errorMsg) {
      input.setAttribute('aria-invalid', 'true');
      input.style.borderColor = '#C0392B';
      input.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.12)';
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        errorEl.style.cssText = 'display:block;font-size:12px;color:#C0392B;margin-top:5px;font-weight:500;';
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = errorMsg;
    } else {
      input.setAttribute('aria-invalid', 'false');
      input.style.borderColor = '';
      input.style.boxShadow   = '';
      if (errorEl) errorEl.remove();
    }
  }

  function validateField(input) {
    var rule  = RULES[input.dataset.validate];
    var error = rule ? rule(input.value.trim()) : '';
    setFieldState(input, error);
    return !error;
  }

  /* ── Inline validation ─────────────────────────────── */
  if (form) {
    form.querySelectorAll('[data-validate]').forEach(function (input) {
      input.addEventListener('blur',  function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });
  }

  /* ── Submit button state ───────────────────────────── */
  function setBtnLoading(btn, loading) {
    if (loading) {
      btn.disabled     = true;
      btn.dataset.orig = btn.textContent;
      btn.innerHTML    =
        '<span style="display:inline-flex;align-items:center;gap:8px;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2.5" style="animation:spin 0.8s linear infinite">' +
        '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83' +
        'M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>' +
        'Sending\u2026</span>';
    } else {
      btn.disabled    = false;
      btn.textContent = btn.dataset.orig || 'Send Enquiry \u2192';
    }
  }

  /* ── Collect payload ───────────────────────────────── */
  function getPayload(frm) {
    var now = new Date();
    return {
      name:        frm.querySelector('#name').value.trim(),
      phone:       frm.querySelector('#phone').value.trim(),
      travelDate:  (frm.querySelector('#travel-date') || {}).value || '',
      vehicle:     (frm.querySelector('#vehicle') || {}).value || '',
      message:     frm.querySelector('#message').value.trim(),
      submittedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source:      window.location.href,
    };
  }

  /* ── Form submit ───────────────────────────────────── */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Validate */
      var valid = true;
      form.querySelectorAll('[data-validate]').forEach(function (input) {
        if (!validateField(input)) valid = false;
      });

      if (!valid) {
        var bad = form.querySelector('[aria-invalid="true"]');
        if (bad) { bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); bad.focus(); }
        showToast('\u26a0\ufe0f Please fix the errors above before submitting.', 'error');
        return;
      }

      var scriptUrl = (form.dataset.sheetUrl || '').trim();
      var btn       = form.querySelector('[type="submit"]');
      var payload   = getPayload(form);

      /* Demo mode if URL not set */
      if (!scriptUrl ) {
        setBtnLoading(btn, true);
        setTimeout(function () {
          setBtnLoading(btn, false);
          showToast('\u2705 [Demo] Enquiry recorded! Set up Google Sheets to go live.', 'success', 5000);
          form.reset();
          console.info('[RL Travels] Paste your Apps Script Web App URL into data-sheet-url on the <form> tag.');
        }, 1200);
        return;
      }

      /* Live submission */
      setBtnLoading(btn, true);
      fetch(scriptUrl, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
        .then(function () {
          setBtnLoading(btn, false);
          showToast('\u2705 Enquiry sent! We\u2019ll call you back within 3 hours.', 'success');
          form.reset();
        })
        .catch(function (err) {
          setBtnLoading(btn, false);
          showToast('\u274c Network error. Please call +91 92385 14756 directly.', 'error', 6000);
          console.error('[RL Travels] Submit error:', err);
        });
    });
  }

  /* ── Promo code copy ───────────────────────────────── */
  if (promoCode) {
    promoCode.setAttribute('tabindex', '0');
    promoCode.setAttribute('role', 'button');
    promoCode.setAttribute('aria-label', 'Click to copy promo code YATRA10');

    function doCopy() {
      var code = promoCode.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          if (copyHint) copyHint.textContent = '\u2713 Copied!';
          showToast('\u2705 Code ' + code + ' copied!', 'success', 2500);
          setTimeout(function () {
            if (copyHint) copyHint.textContent = 'Click to copy';
          }, 2500);
        }).catch(function () {
          if (copyHint) copyHint.textContent = 'Select & copy: ' + code;
        });
      } else {
        if (copyHint) copyHint.textContent = 'Select & copy: ' + code;
      }
    }

    promoCode.addEventListener('click', doCopy);
    promoCode.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(); }
    });
  }

  /* ── Spin keyframe ─────────────────────────────────── */
  if (!document.getElementById('rl-spin')) {
    var s = document.createElement('style');
    s.id = 'rl-spin';
    s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
  }

})();
