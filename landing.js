/* ═══════════════════════════════════════════════
   La Ginesta — Landing Page
   landing.js
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Header: scroll state ──────────────────── */
  const header = document.getElementById('l-header');

  function updateHeader () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ─── Scroll-reveal (fade-up) ───────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  /* ─── Stagger grid children ─────────────────── */
  const staggerParents = document.querySelectorAll(
    '.l-exp-grid, .l-digital-grid, .l-diferent-grid'
  );

  staggerParents.forEach((parent) => {
    parent.querySelectorAll('.fade-up').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  /* ─── Hero: subtle parallax ─────────────────── */
  const heroImg = document.querySelector('.l-hero-img');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroImg && !prefersReduced) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroImg.style.transform = `translateY(${y * 0.28}px)`;
        }
      },
      { passive: true }
    );
  }

  /* ─── Smooth scroll for hash links ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--hdr-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Gallery Carousel ──────────────────────── */
  function initCarousel () {
    const track       = document.getElementById('l-carousel-track');
    const dotsWrap    = document.getElementById('l-carousel-dots');
    const btnPrev     = document.getElementById('l-carousel-prev');
    const btnNext     = document.getElementById('l-carousel-next');

    if (!track) return;

    const items   = Array.from(track.querySelectorAll('.l-carousel-item'));
    const total   = items.length;
    let current   = 0;
    let autoTimer = null;
    let startX    = 0;
    let isDrag    = false;

    /* Build dots */
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className       = 'l-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Imatge ${i + 1} de ${total}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.l-carousel-dot'));

    function updateUI () {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function goTo (index) {
      current = ((index % total) + total) % total;
      updateUI();
    }

    function startAuto () {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 4800);
    }
    function stopAuto () {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    /* Touch swipe */
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDrag = false;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (Math.abs(e.touches[0].clientX - startX) > 8) isDrag = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDrag) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) {
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    });

    /* Pause on hover/focus */
    const carousel = document.getElementById('l-carousel');
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin',    stopAuto);
    carousel.addEventListener('focusout',   startAuto);

    /* Keyboard nav */
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
    });

    updateUI();
    startAuto();
  }

  initCarousel();

})();
