import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';
import { renderServiceCards, renderEquipment, renderDoctors } from './lib/render.js';
import { initCarousel } from './lib/carousel.js';
import { initBookingForm } from './lib/form.js';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  renderServiceCards(clinic);
  renderEquipment(clinic);
  renderDoctors(clinic);
  initCarousel(clinic);
  initBookingForm(clinic);
}
init();