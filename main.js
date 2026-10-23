/* la Jime · Portafolio — interacciones base */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1) Separa "PORTAFOLIO" en letras para animarlas una a una */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    Array.from(text).forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = char;
      span.style.setProperty('--i', i);
      el.appendChild(span);
    });
  });

  /* 2) Copia del texto resaltado: lo de adentro de la caja se ve durazno,
        lo de afuera (ascendentes y descendentes) queda crema */
  document.querySelectorAll('.sel-text').forEach((el) => {
    const ink = document.createElement('span');
    ink.className = 'sel-ink';
    ink.setAttribute('aria-hidden', 'true');
    ink.textContent = el.textContent;
    el.appendChild(ink);
  });

  /* 3) Aparición al hacer scroll */
  const targets = document.querySelectorAll('[data-reveal], .sel, .tools, .portrait');
  const showAll = () => targets.forEach((t) => t.classList.add('in'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => observer.observe(t));
  }

  /* 4) La portada arranca cuando las tipografías ya cargaron
        (con un tope de 1.2 s por si la conexión es lenta) */
  const fontsReady = (document.fonts && document.fonts.ready)
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
    : Promise.resolve();

  fontsReady.then(() => requestAnimationFrame(() => root.classList.add('ready')));
})();
