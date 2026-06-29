/* ============================================================
   RAÍZ – main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── FAQ ACORDEÓN ── */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      faqItems.forEach(other => {
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq__answer').classList.remove('open');
      });

      // Abrir el clickeado si estaba cerrado
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  /* ── MENÚ MOBILE ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks  = document.querySelector('.nav__links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }


  /* ── FORMULARIO DE CONTACTO ── */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nombre  = form.nombre.value.trim();
      const email   = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();

      if (!nombre || !email || !mensaje) {
        formMsg.style.color = '#e53935';
        formMsg.textContent = 'Por favor completá todos los campos.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMsg.style.color = '#e53935';
        formMsg.textContent = 'Ingresá un email válido.';
        return;
      }

      // Simulación de envío exitoso
      formMsg.style.color = '#4CAF7D';
      formMsg.textContent = '¡Mensaje enviado! Nos pondremos en contacto pronto.';
      form.reset();

      setTimeout(() => { formMsg.textContent = ''; }, 5000);
    });
  }

  /* ── SLIDER DE TESTIMONIOS ── */
  const track      = document.getElementById('testimonialsTrack');
  const dotsWrap   = document.getElementById('testimonialsDots');
  const btnPrev    = document.querySelector('.testimonials__arrow--prev');
  const btnNext    = document.querySelector('.testimonials__arrow--next');

  if (track && dotsWrap) {
    const cards        = Array.from(track.querySelectorAll('.testimonial-card'));
    const totalCards   = cards.length;
    let currentIndex   = 0;

    /* Cuántas cards se ven según el ancho */
    function visibleCount() {
      return window.innerWidth <= 700 ? 1 : 3;
    }

    /* Máximo índice posible */
    function maxIndex() {
      return totalCards - visibleCount();
    }

    /* Mover el track */
    function goTo(index) {
      const visible = visibleCount();
      currentIndex  = Math.max(0, Math.min(index, maxIndex()));

      // Ancho de una card + gap (24px)
      const cardWidth = track.querySelector('.testimonial-card').getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Actualizar dots
      const dots = dotsWrap.querySelectorAll('.dot');
      dots.forEach((d, i) => {
        d.classList.toggle('dot--active', i === currentIndex);
      });
    }

    btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext.addEventListener('click', () => goTo(currentIndex + 1));

    // Dots clickeables
    dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Swipe táctil
    let touchStartX = 0;
    let touchDeltaX = 0;

    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      track.classList.add('dragging');
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      track.classList.remove('dragging');
      if (Math.abs(touchDeltaX) > 50) {
        goTo(touchDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
      }
      touchDeltaX = 0;
    });

    // Drag con mouse (desktop)
    let mouseStartX = 0;
    let isDragging  = false;

    track.addEventListener('mousedown', e => {
      isDragging  = true;
      mouseStartX = e.clientX;
      track.classList.add('dragging');
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      touchDeltaX = e.clientX - mouseStartX;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      if (Math.abs(touchDeltaX) > 60) {
        goTo(touchDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
      }
      touchDeltaX = 0;
    });

    // Recalcular al cambiar tamaño
    window.addEventListener('resize', () => goTo(currentIndex));
  }

});
/* ============================================================
   SLIDER ANTES / DESPUÉS
   ============================================================ */
document.querySelectorAll('.ba-slider').forEach(function(slider) {

  var isDragging = false;

  function getPercent(e, rect) {
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var x = clientX - rect.left;
    var percent = Math.min(Math.max(x / rect.width * 100, 0), 100);
    return percent;
  }

  function updateSlider(percent) {
    var after  = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    after.style.clipPath  = 'inset(0 0 0 ' + percent + '%)';
    handle.style.left     = percent + '%';
  }

  // Mouse
  slider.addEventListener('mousedown', function(e) {
    isDragging = true;
    var rect = slider.getBoundingClientRect();
    updateSlider(getPercent(e, rect));
  });

  window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    var rect = slider.getBoundingClientRect();
    updateSlider(getPercent(e, rect));
  });

  window.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Touch
  slider.addEventListener('touchstart', function(e) {
    isDragging = true;
    var rect = slider.getBoundingClientRect();
    updateSlider(getPercent(e, rect));
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    var rect = slider.getBoundingClientRect();
    updateSlider(getPercent(e, rect));
  }, { passive: true });

  window.addEventListener('touchend', function() {
    isDragging = false;
  });

});