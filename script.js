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

  if (heroMedia) {
    const isMobile   = () => window.innerWidth < 640;
    const clamp      = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    /* ── Mobile: pan via background-position % ──────────── */
    /* Image intrinsic: 1536×1024. Rendered height = 100vh.
       Rendered width = 1536/1024 × vh. Overflow = renderedW - vw. */
    const IMG_RATIO  = 1536 / 1024;
    const bgOverflow = () => Math.max(1, IMG_RATIO * window.innerHeight - window.innerWidth);

    let bgPos = 20; // matches CSS initial — window + curtain + kitchen

    const applyBgPan = (pos, smooth = false) => {
      bgPos = clamp(pos, 0, 100);
      heroMedia.classList.toggle('bg-smooth', smooth);
      heroMedia.style.backgroundPosition = `${bgPos}% center`;
      panBtnL?.classList.toggle('edge', bgPos <= 0);
      panBtnR?.classList.toggle('edge', bgPos >= 100);
    };

    /* ── Desktop: pan via translateX on img ─────────────── */
    let panX = 0, maxPan = 0;

    const applyImgPan = (x) => {
      panX = clamp(x, -maxPan, 0);
      heroImgEl && (heroImgEl.style.transform = `translateX(${panX}px)`);
      panBtnL?.classList.toggle('edge', panX >= 0);
      panBtnR?.classList.toggle('edge', panX <= -maxPan);
    };

    const initDesktop = () => requestAnimationFrame(() => {
      if (isMobile()) { heroImgEl && (heroImgEl.style.transform = ''); maxPan = 0; return; }
      maxPan = Math.round(window.innerWidth * 0.6);
      applyImgPan(panX);
    });

    initDesktop();
    window.addEventListener('load',   initDesktop, { once: true });
    window.addEventListener('resize', initDesktop, { passive: true });

    /* Initialize mobile arrows state */
    if (isMobile()) applyBgPan(bgPos);

    /* ── Button clicks ───────────────────────────────────── */
    const BG_STEP  = 18;  // % per tap on mobile
    const PAN_STEP = 160; // px per click on desktop

    panBtnL?.addEventListener('click', () => {
      if (isMobile()) { applyBgPan(bgPos - BG_STEP, true); }
      else            { heroImgEl?.classList.add('pan-transition'); applyImgPan(panX + PAN_STEP); }
    });
    panBtnR?.addEventListener('click', () => {
      if (isMobile()) { applyBgPan(bgPos + BG_STEP, true); }
      else            { heroImgEl?.classList.add('pan-transition'); applyImgPan(panX - PAN_STEP); }
    });

    /* ── Touch swipe ─────────────────────────────────────── */
    let touchStartX = 0, bgPosAtTouch = 0, panAtTouch = 0;

    heroMedia.addEventListener('touchstart', e => {
      touchStartX   = e.touches[0].clientX;
      bgPosAtTouch  = bgPos;
      panAtTouch    = panX;
      heroMedia.classList.remove('bg-smooth');
      heroImgEl?.classList.remove('pan-transition');
    }, { passive: true });

    heroMedia.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      if (isMobile()) {
        applyBgPan(bgPosAtTouch - (dx / bgOverflow()) * 100);
      } else {
        applyImgPan(panAtTouch + dx);
      }
    }, { passive: true });

    heroMedia.addEventListener('touchend', () => {
      heroImgEl?.classList.add('pan-transition');
    }, { passive: true });

    /* ── Mouse drag (desktop) ────────────────────────────── */
    let isDragging = false, mouseStartX = 0, panAtMouse = 0;

    heroMedia.addEventListener('mousedown', e => {
      if (isMobile() || maxPan <= 0) return;
      isDragging = true;
      mouseStartX = e.clientX;
      panAtMouse  = panX;
      heroImgEl?.classList.remove('pan-transition');
      heroMedia.classList.add('grabbing');
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      applyImgPan(panAtMouse + e.clientX - mouseStartX);
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      heroImgEl?.classList.add('pan-transition');
      heroMedia.classList.remove('grabbing');
    });
  }

});
