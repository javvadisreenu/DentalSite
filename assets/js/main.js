import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';
import { renderServiceCards, renderEquipment, renderDoctors, renderFAQ } from './lib/render.js';
import { initCarousel } from './lib/carousel.js';
import { initBookingForm } from './lib/form.js';
import { initI18n } from './lib/i18n.js';
import { initBeforeAfter } from './lib/slider.js';
import { initEstimator } from './lib/estimator.js';
import { initNewsletter } from './lib/newsletter.js';
import { scrollToSection } from './lib/nav.js';

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
  if (clinic.clinic.consultationFee) document.querySelectorAll('[data-consult-fee]').forEach(n => { n.textContent = clinic.clinic.consultationFee; });
  // Content above was injected after load, so the browser's own jump to
  // #section may have landed in the wrong place. Re-align once rendered.
  if (location.hash) requestAnimationFrame(() => scrollToSection(decodeURIComponent(location.hash.slice(1)), false));
}
init();