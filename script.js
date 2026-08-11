/* ===================================================================
   DILIGOA PROPERTIES — shared behaviour across all 5 pages
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Active nav link ---------- */
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => { el.style.setProperty('--i', i % 8); io.observe(el); });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Property filters (properties.html) ---------- */
  const filterBar = document.querySelector('.filter-bar');
  const propertyCards = document.querySelectorAll('[data-property]');
  if (filterBar && propertyCards.length) {
    const locSel = document.getElementById('f-location');
    const typeSel = document.getElementById('f-type');
    const bhkSel = document.getElementById('f-bhk');
    const statusSel = document.getElementById('f-status');
    const resetBtn = document.getElementById('f-reset');
    const emptyMsg = document.querySelector('.filter-empty');

    const applyFilters = () => {
      let visibleCount = 0;
      propertyCards.forEach(card => {
        const matches =
          (!locSel || !locSel.value || card.dataset.location === locSel.value) &&
          (!typeSel || !typeSel.value || card.dataset.type === typeSel.value) &&
          (!bhkSel || !bhkSel.value || card.dataset.bhk === bhkSel.value) &&
          (!statusSel || !statusSel.value || card.dataset.status === statusSel.value);
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });
      if (emptyMsg) emptyMsg.style.display = visibleCount ? 'none' : 'block';
    };

    [locSel, typeSel, bhkSel, statusSel].forEach(sel => sel && sel.addEventListener('change', applyFilters));
    if (resetBtn) resetBtn.addEventListener('click', () => {
      [locSel, typeSel, bhkSel, statusSel].forEach(sel => sel && (sel.value = ''));
      applyFilters();
    });
  }

  /* ---------- Gallery filter + lightbox (goa.html / index gallery) ---------- */
  const galleryButtons = document.querySelectorAll('.gallery-filters button');
  const galleryItems = document.querySelectorAll('.g-item');
  if (galleryButtons.length && galleryItems.length) {
    galleryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        galleryItems.forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.g-item img').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  /* ---------- Enquiry / contact form -> WhatsApp ---------- */
  const enquiryForms = document.querySelectorAll('.enquiry-form');
  enquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const lines = [
        `New enquiry — DILIGOA PROPERTIES`,
        data.name ? `Name: ${data.name}` : '',
        data.phone ? `Phone: ${data.phone}` : '',
        data.email ? `Email: ${data.email}` : '',
        data.location ? `Interested Location: ${data.location}` : '',
        data.type ? `Property Type: ${data.type}` : '',
        data.budget ? `Budget: ${data.budget}` : '',
        data.message ? `Message: ${data.message}` : ''
      ].filter(Boolean).join('\n');

      const waNumber = '919911112323';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;
      const note = form.querySelector('.form-note');
      if (note) { note.textContent = 'Opening WhatsApp with your enquiry…'; note.style.color = 'var(--gold-deep)'; }
      window.open(url, '_blank');
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
});
