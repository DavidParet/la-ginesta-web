/* ═══════════════════════════════════════════════
   La Ginesta — script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Header scroll behaviour ─────────────── */
  const header = document.getElementById('site-header');
  const hero   = document.querySelector('.hero');

  const updateHeader = () => {
    if (!hero) return;
    header.classList.toggle('scrolled', window.scrollY > hero.offsetHeight * 0.55);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ─── Back-to-top visibility ──────────────── */
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 480);
  }, { passive: true });

  /* ─── Fade-in on scroll ───────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 0.04}s`;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ─── Active pill nav ─────────────────────── */
  const pills    = document.querySelectorAll('.pill');
  const sections = document.querySelectorAll('[id^="s-"]');

  const pillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pills.forEach(pill => {
          pill.classList.toggle('active', pill.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

  sections.forEach(s => pillObserver.observe(s));

  /* ─── Checklist — localStorage persistence ── */
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-id]');

  checkboxes.forEach(cb => {
    const key = `lg-check-${cb.dataset.id}`;

    if (localStorage.getItem(key) === '1') {
      cb.checked = true;
      cb.closest('li').classList.add('checked');
    }

    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked ? '1' : '0');
      cb.closest('li').classList.toggle('checked', cb.checked);
    });
  });

  /* ─── Checklist — reset buttons ──────────── */
  document.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = document.getElementById(btn.dataset.list);
      if (!list) return;
      list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        localStorage.setItem(`lg-check-${cb.dataset.id}`, '0');
        cb.closest('li').classList.remove('checked');
      });
    });
  });

  /* ─── Details expand arrow ────────────────── */
  document.querySelectorAll('.expand').forEach(det => {
    det.addEventListener('toggle', () => {
      const arrow = det.querySelector('.expand-arrow');
      if (arrow) arrow.textContent = det.open ? '›' : '›';
    });
  });

  /* ─── Hero panoramic pan ─────────────────── */
  const heroMedia = document.querySelector('.hero-media');
  const heroImgEl = document.querySelector('.hero-img');
  const panHint   = document.getElementById('hero-pan-hint');

  if (heroMedia && heroImgEl) {
    let panX       = 0;
    let maxPan     = 0;
    let hintHidden = false;

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const applyPan = (x) => {
      panX = clamp(x, -maxPan, 0);
      heroImgEl.style.transform = `translateX(${panX}px)`;
    };

    const calcMax = () => {
      if (window.innerWidth >= 640) {
        heroImgEl.style.transform = '';
        maxPan = 0;
        return;
      }
      const h     = heroMedia.offsetHeight;
      const ratio = heroImgEl.naturalWidth / heroImgEl.naturalHeight || 1.5;
      maxPan = Math.max(0, h * ratio - heroMedia.offsetWidth);
      applyPan(panX);
    };

    const hideHint = () => {
      if (hintHidden || !panHint) return;
      hintHidden = true;
      panHint.classList.add('hidden');
    };

    if (heroImgEl.complete && heroImgEl.naturalWidth) {
      calcMax();
    } else {
      heroImgEl.addEventListener('load', calcMax, { once: true });
    }
    window.addEventListener('resize', calcMax, { passive: true });

    /* Touch — passive: true so vertical page scroll is never blocked */
    let touchStartX = 0;
    let panAtTouch  = 0;

    heroMedia.addEventListener('touchstart', e => {
      if (window.innerWidth >= 640 || maxPan <= 0) return;
      touchStartX = e.touches[0].clientX;
      panAtTouch  = panX;
      hideHint();
    }, { passive: true });

    heroMedia.addEventListener('touchmove', e => {
      if (window.innerWidth >= 640 || maxPan <= 0) return;
      applyPan(panAtTouch + e.touches[0].clientX - touchStartX);
    }, { passive: true });

    /* Mouse drag — desktop */
    let isDragging  = false;
    let mouseStartX = 0;
    let panAtMouse  = 0;

    heroMedia.addEventListener('mousedown', e => {
      if (maxPan <= 0) return;
      isDragging  = true;
      mouseStartX = e.clientX;
      panAtMouse  = panX;
      heroMedia.classList.add('grabbing');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      applyPan(panAtMouse + e.clientX - mouseStartX);
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      heroMedia.classList.remove('grabbing');
    });
  }

});
