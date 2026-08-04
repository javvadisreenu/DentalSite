import { el } from './config.js';

export function initCarousel(clinic, selector = '#testimonial-carousel') {
  const host = document.querySelector(selector);
  if (!host || !clinic.testimonials.length) return;
  const items = clinic.testimonials;
  let i = 0;
  host.replaceChildren(...items.map((t, idx) =>
    el('figure', { class: 'carousel-item' + (idx === 0 ? ' active' : ''), role: 'tabpanel', 'aria-hidden': idx === 0 ? 'false' : 'true' },
      el('blockquote', {}, t.text),
      el('figcaption', {}, `${t.name} — ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}`)
    )
  ));
  const dots = document.querySelector('#carousel-dots');
  if (dots) {
    dots.replaceChildren(...items.map((_, idx) =>
      el('button', { class: 'dot' + (idx === 0 ? ' active' : ''), role: 'tab',
        'aria-label': `Testimonial ${idx + 1}`, 'aria-selected': idx === 0 ? 'true' : 'false',
        onclick: () => go(idx) })
    ));
  }
  function go(n) {
    i = (n + items.length) % items.length;
    host.querySelectorAll('.carousel-item').forEach((node, idx) => {
      const on = idx === i;
      node.classList.toggle('active', on);
      node.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (dots) dots.querySelectorAll('.dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
      d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
  }
  let timer = setInterval(() => go(i + 1), 5000);
  host.addEventListener('mouseenter', () => clearInterval(timer));
  host.addEventListener('mouseleave', () => timer = setInterval(() => go(i + 1), 5000));
  host.addEventListener('click', () => go(i + 1));
}