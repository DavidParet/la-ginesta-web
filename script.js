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
          const active = pill.getAttribute('href') === `#${id}`;
          pill.classList.toggle('active', active);
          if (active) {
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
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

  /* ─── Smooth scroll offset for hash links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--hdr'), 10) + 48 + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
