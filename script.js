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

  /* ─── Accordion cards ─────────────────────── */
  const allCards = document.querySelectorAll('.card');

  const openCard = (card) => {
    allCards.forEach(c => {
      if (c !== card) c.classList.remove('open');
    });
    card.classList.toggle('open');
    if (card.classList.contains('open')) {
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  };

  allCards.forEach(card => {
    const hd = card.querySelector('.card-hd');
    if (!hd) return;
    hd.addEventListener('click', () => openCard(card));
    hd.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(card); }
    });
    hd.setAttribute('tabindex', '0');
    hd.setAttribute('role', 'button');
  });

  /* ─── Nav links → auto-open target card ──── */
  document.querySelectorAll('a[href^="#s-"]').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target && target.classList.contains('card')) {
        setTimeout(() => {
          allCards.forEach(c => c.classList.remove('open'));
          target.classList.add('open');
        }, 80);
      }
    });
  });

  /* ─── Hero panoramic pan ─────────────────── */
  const heroMedia  = document.querySelector('.hero-media');
  const heroImgEl  = document.querySelector('.hero-img');
  const panBtnL    = document.getElementById('hero-pan-left');
  const panBtnR    = document.getElementById('hero-pan-right');

  if (heroMedia && heroImgEl) {
    let panX   = 0;
    let maxPan = 0;

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const applyPan = (x) => {
      panX = clamp(x, -maxPan, 0);
      heroImgEl.style.transform = `translateX(${panX}px)`;
    };

    const updateArrows = () => {
      panBtnL?.classList.toggle('edge', panX >= 0);
      panBtnR?.classList.toggle('edge', panX <= -maxPan);
    };

    const calcMax = () => {
      requestAnimationFrame(() => {
        if (window.innerWidth >= 640) {
          heroImgEl.style.transform = '';
          maxPan = 0;
          return;
        }
        /* image is 160vw wide, viewport is 100vw → 60vw of pan */
        maxPan = Math.round(window.innerWidth * 0.6);
        applyPan(panX);
        updateArrows();
      });
    };

    calcMax();
    window.addEventListener('load',   calcMax, { once: true });
    window.addEventListener('resize', calcMax, { passive: true });

    const PAN_STEP = 160;

    panBtnL?.addEventListener('click', () => {
      heroImgEl.classList.add('pan-transition');
      applyPan(panX + PAN_STEP);
      updateArrows();
    });
    panBtnR?.addEventListener('click', () => {
      heroImgEl.classList.add('pan-transition');
      applyPan(panX - PAN_STEP);
      updateArrows();
    });

    /* Touch swipe — all passive, vertical page scroll never blocked */
    let touchStartX = 0;
    let panAtTouch  = 0;

    heroMedia.addEventListener('touchstart', e => {
      if (window.innerWidth >= 640) return;
      heroImgEl.classList.remove('pan-transition');
      touchStartX = e.touches[0].clientX;
      panAtTouch  = panX;
    }, { passive: true });

    heroMedia.addEventListener('touchmove', e => {
      if (window.innerWidth >= 640) return;
      applyPan(panAtTouch + e.touches[0].clientX - touchStartX);
      updateArrows();
    }, { passive: true });

    heroMedia.addEventListener('touchend', () => {
      heroImgEl.classList.add('pan-transition');
    }, { passive: true });

    /* Mouse drag — desktop */
    let isDragging = false, mouseStartX = 0, panAtMouse = 0;

    heroMedia.addEventListener('mousedown', e => {
      if (maxPan <= 0) return;
      isDragging = true;
      mouseStartX = e.clientX;
      panAtMouse  = panX;
      heroImgEl.classList.remove('pan-transition');
      heroMedia.classList.add('grabbing');
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      applyPan(panAtMouse + e.clientX - mouseStartX);
      updateArrows();
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      heroImgEl.classList.add('pan-transition');
      heroMedia.classList.remove('grabbing');
    });
  }

});
