/* =============================================
   CURSO PRINCIPIANTES — acordeones + stagger
   ============================================= */

// ── ACORDEÓN (compartido para contenidos y FAQ) ──
document.querySelectorAll('.acordeon').forEach(function (acordeon) {
  acordeon.querySelectorAll('.acordeon-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = this.closest('.acordeon-item');
      var body = item.querySelector('.acordeon-body');
      var isOpen = item.classList.contains('is-open');

      // Cerrar todos los items del mismo acordeón
      acordeon.querySelectorAll('.acordeon-item').forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          otherItem.querySelector('.acordeon-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.acordeon-body').style.maxHeight = '0';
        }
      });

      // Abrir o cerrar el actual
      if (isOpen) {
        item.classList.remove('is-open');
        this.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('is-open');
        this.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
});

// ── TESTIMONIOS: entrada escalonada desde abajo al scrollear ──
(function () {
  var cards = document.querySelectorAll('.testimonio-card');
  if (!cards.length) return;

  var isMobile = window.innerWidth <= 768;

  if (isMobile) return; // en mobile usa scroll nativo

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    cards.forEach(function (card) { card.classList.add('is-visible'); });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (card) { card.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();
