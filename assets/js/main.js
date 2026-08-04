import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';
import { renderServiceCards, renderEquipment } from './lib/render.js';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  renderServiceCards(clinic);
  renderEquipment(clinic);
}
init();