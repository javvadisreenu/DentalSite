import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';
import { renderServiceCards, renderEquipment, renderDoctors, renderFAQ } from './lib/render.js';
import { initCarousel } from './lib/carousel.js';
import { initBookingForm } from './lib/form.js';
import { initI18n } from './lib/i18n.js';
import { initBeforeAfter } from './lib/slider.js';
import { initEstimator } from './lib/estimator.js';
import { initNewsletter } from './lib/newsletter.js';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  await initI18n(document);
  renderServiceCards(clinic);
  renderEquipment(clinic);
  renderDoctors(clinic);
  renderFAQ(clinic);
  initCarousel(clinic);
  initBookingForm(clinic);
  initBeforeAfter();
  initEstimator(clinic);
  initNewsletter();
}
init();