// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── SCROLL FADE ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── GENERIC CAROUSEL ──
function initCarousel(trackId, dotsId, visibleCount) {
  const track = document.getElementById(trackId);
  const dotsEl = document.getElementById(dotsId);
  if (!track || !dotsEl) return;

  const cards = track.children;
  let current = 0;
  const total = cards.length;

  function getStep() {
    return track.parentElement.offsetWidth / visibleCount + 24;
  }

  function go(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(-${current * getStep()}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  dotsEl.querySelectorAll('.dot').forEach(d => {
    d.addEventListener('click', () => go(+d.dataset.i));
  });

  // Auto-advance
  setInterval(() => go(current + 1), 4000);

  // Touch swipe
  let startX = 0;
  track.parentElement.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.parentElement.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(current + (diff > 0 ? 1 : -1));
  });
}

function getVisibleCount() {
  return window.innerWidth <= 700 ? 1 : window.innerWidth <= 900 ? 2 : 3;
}

initCarousel('capsulaTrack', 'capsulaDots', getVisibleCount());
initCarousel('testiTrack', 'testiDots', getVisibleCount());

// Hero dot decoration (cosmetic)
document.querySelectorAll('#heroDots .dot').forEach(d => {
  d.addEventListener('click', () => {
    document.querySelectorAll('#heroDots .dot').forEach(x => x.classList.remove('active'));
    d.classList.add('active');
  });
});

// ── FORM ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '¡Mensaje enviado!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Enviar mensaje'; btn.disabled = false; e.target.reset(); }, 3000);
}
