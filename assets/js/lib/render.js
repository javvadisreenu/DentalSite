import { el, BASE } from './config.js';
const ICONS = {
  tooth: '🦷', extract: '🔧', implant: '🔩', clean: '🪥', filling: '🧩', crown: '👑', sparkle: '✨'
};
export function renderServiceCards(clinic, selector = '#service-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  const more = document.querySelector('#more-services');
  if (more) {
    more.replaceChildren(...clinic.services.filter(s => s.core === false).map(s =>
      el('a', { href: `${BASE}${s.page}`, class: 'card mini-service' },
        el('span', { class: 'service-icon sm', 'aria-hidden': 'true' }, ICONS[s.icon] || '🦷'),
        el('span', {}, el('strong', {}, s.name), el('span', { class: 'muted' }, s.blurb))
      )
    ));
  }
  host.replaceChildren(...clinic.services.filter(s => s.core !== false).map(s =>
    el('article', { class: 'card service-card' },
      el('div', { class: 'service-icon', 'aria-hidden': 'true' }, ICONS[s.icon] || '🦷'),
      el('h3', {}, s.name),
      el('p', { class: 'muted' }, s.blurb),
      el('a', { href: `${BASE}${s.page}`, class: 'service-link' }, 'Learn More →')
    )
  ));
}
export function renderEquipment(clinic, selector = '#tech-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.equipment.map(eq =>
    el('div', { class: 'tech-card card' },
      eq.image
        ? el('div', { class: 'tech-img-wrap' },
            el('img', { src: `${BASE}${eq.image}`, alt: eq.name, loading: 'lazy', width: 300, height: 200, class: 'tech-img' })
          )
        : el('div', { class: 'tech-dot', 'aria-hidden': 'true' }),
      el('div', { class: 'tech-content' },
        el('h3', {}, eq.name),
        el('p', { class: 'muted' }, eq.benefit)
      )
    )
  ));
}

export function renderDoctors(clinic, selector = '#doctor-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.doctors.map(d =>
    el('article', { class: 'card doctor-card' },
      el('img', { src: `${BASE}${d.photo}`, alt: `${d.name}, ${d.specialization}`, loading: 'lazy', width: 320, height: 240 }),
      el('span', { class: 'badge' }, `${d.experienceYears}+ yrs`),
      el('h3', {}, d.name),
      el('p', { class: 'spec' }, d.specialization),
      el('p', { class: 'qual muted' }, d.qualifications),
      el('p', { class: 'muted' }, d.bio),
      d.languages && d.languages.length ? el('p', { class: 'langs' }, `🗣 Speaks: ${d.languages.join(', ')}`) : null
    )
  ));
}
export function renderFAQ(clinic, selector = '#faq-list') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.faqs.map(f =>
    el('details', { class: 'faq' },
      el('summary', {}, f.q),
      el('p', { class: 'muted' }, f.a)
    )
  ));
}
