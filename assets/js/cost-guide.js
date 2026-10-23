import { loadConfig, el, BASE } from './lib/config.js';
import { initScrollReveal } from './lib/reveal.js';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  const fmt = (p, n) => `${p.currency}${n.toLocaleString('en-IN')}`;
  const rows = clinic.services.filter(s => clinic.pricing[s.id]).map(s => {
    const p = clinic.pricing[s.id];
    return el('tr', {},
      el('th', { scope: 'row' }, el('a', { href: `${BASE}${s.page}` }, s.name)),
      el('td', { class: 'price-cell' }, `${fmt(p, p.min)} – ${fmt(p, p.max)}`),
      el('td', { class: 'muted' }, (p.factors || []).join(', '))
    );
  });
  document.getElementById('price-rows').replaceChildren(...rows);
  if (clinic.clinic.consultationFee) document.querySelectorAll('[data-consult-fee]').forEach(n => { n.textContent = clinic.clinic.consultationFee; });
}
init();
