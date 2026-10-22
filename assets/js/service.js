import { loadConfig } from './lib/config.js';
import { renderDoctors } from './lib/render.js';
import { initBookingForm } from './lib/form.js';
import { initScrollReveal } from './lib/reveal.js';

const PAGE = {
  'root-canal-treatment.html': 'root-canal-treatment',
  'tooth-extraction.html': 'tooth-extraction',
  'dental-implants.html': 'dental-implants'
};
const sid = PAGE[location.pathname.split('/').pop()] || 'root-canal-treatment';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  const doctors = { ...clinic, doctors: clinic.doctors.filter(d => d.services.includes(sid)) };
  renderDoctors(doctors);
  const svc = clinic.services.find(s => s.id === sid);
  initBookingForm(clinic, svc ? svc.name : '');
  const price = clinic.pricing[sid];
  if (price) {
    const fmt = n => `${price.currency}${n.toLocaleString('en-IN')}`;
    document.querySelectorAll(`[data-price="${sid}"]`).forEach(n => { n.textContent = `${fmt(price.min)} – ${fmt(price.max)}`; });
    document.querySelectorAll(`[data-price-factors="${sid}"]`).forEach(n => { n.textContent = `Depends on: ${(price.factors || []).join(', ')}`; });
  }
}
init();