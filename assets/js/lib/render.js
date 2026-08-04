import { el } from './config.js';
const ICONS = {
  tooth: '🦷', extract: '🔧', implant: '🔩'
};
export function renderServiceCards(clinic, selector = '#service-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.services.map(s =>
    el('article', { class: 'card service-card' },
      el('div', { class: 'service-icon', 'aria-hidden': 'true' }, ICONS[s.icon] || '🦷'),
      el('h3', {}, s.name),
      el('p', { class: 'muted' }, s.blurb),
      el('a', { href: s.page, class: 'service-link' }, 'Learn More →')
    )
  ));
}
export function renderEquipment(clinic, selector = '#tech-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.equipment.map(eq =>
    el('div', { class: 'tech-card' },
      el('div', { class: 'tech-dot', 'aria-hidden': 'true' }),
      el('h3', {}, eq.name),
      el('p', { class: 'muted' }, eq.benefit)
    )
  ));
}