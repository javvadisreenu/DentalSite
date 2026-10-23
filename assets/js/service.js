import { loadConfig } from './lib/config.js';
import { renderDoctors } from './lib/render.js';
import { initBookingForm } from './lib/form.js';
import { initScrollReveal } from './lib/reveal.js';

// Service id comes from the file name, e.g. services/dental-implants.html
const sid = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  if (!clinic.services.some(s => s.id === sid)) return;
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