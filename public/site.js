/* TigerTex Air — site interactions (vanilla, no deps beyond Lucide) */
(function () {
  'use strict';

  // ── Sticky header shadow ──
  const header = document.querySelector('.header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav ──
  const burger = document.querySelector('.hamburger');
  const mnav = document.querySelector('.mobile-nav');
  const toggleNav = (open) => {
    if (!mnav) return;
    const isOpen = open ?? !mnav.classList.contains('open');
    mnav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (burger) {
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.classList.toggle('is-open', isOpen);
    }
  };
  burger && burger.addEventListener('click', () => toggleNav());
  mnav && mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleNav(false)));
  const closeBtn = mnav && mnav.querySelector('.mobile-nav-close');
  closeBtn && closeBtn.addEventListener('click', () => toggleNav(false));

  // ── Booking modal ──
  const overlay = document.querySelector('.modal-overlay');
  const form = document.querySelector('#booking-form');
  const formWrap = document.querySelector('#booking-body');
  const success = document.querySelector('#booking-success');
  const openModal = (service) => {
    if (!overlay) return;
    if (formWrap) formWrap.style.display = '';
    if (success) success.style.display = 'none';
    const sel = overlay.querySelector('select[name="service"]');
    if (sel && service) sel.value = service;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-book]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); toggleNav(false); openModal(el.getAttribute('data-book')); });
  });
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  overlay && overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  // ── Netlify Forms submission ──
  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
    } catch (_) {}
    if (formWrap) formWrap.style.display = 'none';
    if (success) success.style.display = 'block';
    if (window.lucide) window.lucide.createIcons();
  });

  // ── Reveal on scroll ──
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    io.observe(el);
  });

  // ── Lucide icons ──
  if (window.lucide) window.lucide.createIcons();
})();
