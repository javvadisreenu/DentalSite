import { loadConfig, el, BASE, getTheme, setTheme, initTheme } from './lib/config.js';
import { buildWhatsAppUrl } from './lib/whatsapp.js';
import { t, loadDict, getLoadedDict, applyI18n } from './lib/i18n.js';
import { scrollToSection, samePageHash } from './lib/nav.js';
import { openStatus } from './lib/hours.js';
import { initClickTracking } from './lib/track.js';

const NAV_LINKS = [
  { href: 'index.html#home', key: 'nav.home' },
  { href: 'index.html#services', key: 'nav.services' },
  { href: 'index.html#doctors', key: 'nav.doctors' },
  { href: 'index.html#gallery', key: 'nav.gallery' },
  { href: 'index.html#technology', key: 'nav.technology' },
  { href: 'index.html#contact', key: 'nav.contact' }
];

export function renderNavbar(clinic, dict, lang) {
  const host = document.getElementById('site-nav');
  if (!host) return;
  const links = NAV_LINKS.map(l =>
    el('a', { href: `${BASE}${l.href}`, class: 'nav-link', 'data-i18n': l.key }, t(l.key, dict, lang))
  );
  const ICON_MOON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="i-moon"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const ICON_SUN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="i-sun"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const ICON_MENU = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" class="i-menu"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const ICON_CLOSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" class="i-close"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const nav = el('nav', { class: 'navbar container' },
    el('a', { href: `${BASE}index.html`, class: 'brand', 'aria-label': clinic.clinic.name },
      el('img', { src: `${BASE}assets/img/logo-full.png`, alt: clinic.clinic.name, class: 'brand-logo-img', height: 68 })
    ),
    el('div', { class: 'nav-links', id: 'nav-links' }, ...links),
    el('a', { href: `${BASE}index.html#appointment`, class: 'btn btn-primary nav-cta', 'data-i18n': 'cta.book' }, t('cta.book', dict, lang)),
    el('div', { class: 'nav-actions' },
      el('button', { type: 'button', class: 'icon-btn theme-toggle', 'aria-label': 'Switch to dark mode', title: 'Switch theme', html: ICON_MOON + ICON_SUN,
        onclick: () => { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); syncThemeLabel(); } }),
      el('button', { type: 'button', class: 'icon-btn hamburger', 'aria-label': 'Open menu', 'aria-expanded': 'false', 'aria-controls': 'nav-links', html: ICON_MENU + ICON_CLOSE,
        onclick: () => setMenu(!menu.classList.contains('open')) })
    )
  );
  host.replaceChildren(nav);

  const menu = nav.querySelector('#nav-links');
  const burger = nav.querySelector('.hamburger');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  const themeBtn = nav.querySelector('.theme-toggle');
  function syncThemeLabel() {
    themeBtn.setAttribute('aria-label', getTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncThemeLabel();

  // Any nav link: close the mobile menu; for sections on this page,
  // scroll there smoothly (below the sticky navbar) without reloading.
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    setMenu(false);
    const id = samePageHash(a.href);
    if (id && scrollToSection(id)) {
      e.preventDefault();
      history.pushState(null, '', `#${id}`);
    }
  });
  // Close on Escape or when tapping outside the menu.
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
  document.addEventListener('click', (e) => { if (menu.classList.contains('open') && !nav.contains(e.target)) setMenu(false); });
  const onScroll = () => host.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function renderFooter(clinic) {
  const host = document.getElementById('site-footer');
  if (!host) return;
  const c = clinic.clinic;
  host.replaceChildren(el('footer', { class: 'footer' },
    el('div', { class: 'container footer-grid' },
      el('div', {},
        el('h3', {}, c.name),
        el('p', { class: 'muted' }, c.address),
        el('p', { class: 'muted' }, `📞 ${c.phoneDisplay} · ✉️ ${c.email}`),
        ...c.hours.map(h => el('p', { class: 'muted' }, `🕒 ${h.days}: ${h.time}`))
      ),
      el('div', {},
        el('h3', {}, 'Treatments'),
        ...clinic.services.flatMap(sv => [el('a', { href: `${BASE}${sv.page}`, class: 'footer-link' }, sv.name), el('br')])
      ),
      el('div', {},
        el('h3', {}, 'Quick Links'),
        ...[['index.html#doctors', 'Our Doctors'], ['index.html#faq', 'FAQs'], ['cost-guide.html', 'Treatment Prices'], ['blog/index.html', 'Oral Health Blog'], ['index.html#appointment', 'Book Appointment'], ['index.html#contact', 'Contact & Directions']]
          .flatMap(([href, label]) => [el('a', { href: `${BASE}${href}`, class: 'footer-link' }, label), el('br')])
      ),
      el('div', {},
        el('h3', {}, 'Follow Us'),
        el('a', { href: c.social.facebook, target: '_blank', rel: 'noopener', class: 'footer-link' }, 'Facebook'),
        el('br'),
        el('a', { href: c.social.instagram, target: '_blank', rel: 'noopener', class: 'footer-link' }, 'Instagram')
      )
    ),
    el('p', { class: 'copyright' }, `© ${new Date().getFullYear()} ${c.name}. All rights reserved.`)
  ));
}

export function renderWhatsAppFloat(clinic) {
  if (document.getElementById('whatsapp-float')) return;
  const url = buildWhatsAppUrl(clinic.clinic.phone, "Hi, I'd like to book a dental appointment");
  const a = el('a', { href: url, target: '_blank', rel: 'noopener', class: 'whatsapp-float', 'aria-label': 'Chat on WhatsApp' },
    el('img', { src: `${BASE}assets/img/whatsapp.svg`, alt: 'WhatsApp', width: 28, height: 28 })
  );
  document.body.append(a);
}

export function renderMobileCTA(clinic) {
  if (document.getElementById('mobile-cta')) return;
  // Book Now goes to this page's own form when it has one.
  const bookHref = document.getElementById('appointment') ? '#appointment' : `${BASE}index.html#appointment`;
  const bar = el('div', { class: 'mobile-cta', id: 'mobile-cta', 'aria-hidden': 'true' },
    el('a', { href: `tel:${clinic.clinic.phone}`, class: 'btn btn-outline', tabindex: '-1' }, 'Call'),
    el('a', { href: bookHref, class: 'btn btn-primary', tabindex: '-1' }, 'Book Now')
  );
  document.body.append(bar);

  // Show the bar only when the hero buttons and the booking form are both
  // off screen, so the same Call / Book buttons never appear twice.
  const watched = [document.querySelector('.hero .hero-cta, .hero .btn'), document.getElementById('appointment')].filter(Boolean);
  const setShown = (on) => {
    bar.classList.toggle('show', on);
    document.body.classList.toggle('cta-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    bar.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', on ? '0' : '-1'));
  };
  if (!watched.length || !('IntersectionObserver' in window)) { setShown(true); return; }
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    setShown(visible.size === 0);
  });
  watched.forEach(n => io.observe(n));
}

export function renderLiveChat(clinic) {
  if (!clinic.flags.liveChat || !clinic.flags.tawkId) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://embed.tawk.to/${clinic.flags.tawkId}/default`;
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  document.body.append(s);
}

export function renderAnalytics(clinic) {
  const a = clinic.flags.analytics;
  if (!a || !a.enabled || !a.ga4Id) return;
  const s1 = document.createElement('script');
  s1.async = true; s1.src = `https://www.googletagmanager.com/gtag/js?id=${a.ga4Id}`;
  const s2 = document.createElement('script');
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${a.ga4Id}');`;
  document.head.append(s1, s2);
}

export function renderReviews(clinic) {
  const host = document.getElementById('reviews-widget');
  if (!clinic.flags.reviews) { if (host) host.closest('section').hidden = true; return; }
  if (!host) return;
  host.innerHTML = '<p class="muted" style="text-align:center">Google Reviews widget — paste your provider embed here.</p>';
  // When ready, inject the third-party review widget script here.
}

// Show the intro video / care PDF only once the real files are uploaded
// and the matching flag is turned on in clinic.json.
export function renderOptionalMedia(clinic) {
  if (clinic.flags.video) document.querySelectorAll('[data-video-block]').forEach(n => { n.hidden = false; });
  if (clinic.flags.carePdf) document.querySelectorAll('[data-care-pdf]').forEach(n => { n.hidden = false; });
}

// "Open now · closes 8:00 PM" badges, refreshed every minute.
export function renderOpenStatus(clinic) {
  const nodes = document.querySelectorAll('[data-open-status]');
  const c = clinic.clinic;
  if (!nodes.length || !c.openingHours) return;
  const update = () => {
    const st = openStatus(new Date(), c.openingHours, c.timezone || 'Asia/Kolkata');
    nodes.forEach(n => {
      n.textContent = st.label;
      n.classList.toggle('is-open', st.open);
      n.classList.toggle('is-closed', !st.open);
      n.hidden = false;
    });
  };
  update();
  setInterval(update, 60000);
}

export function renderEmergencyBanner(clinic) {
  if (!clinic.flags.emergencyBanner) return;
  const banner = el('div', { class: 'emergency-banner', role: 'region', 'aria-label': 'Dental emergency' },
    '🚑 Dental emergency?', el('span', { class: 'eb-long' }, ' Severe pain, swelling or a broken tooth —'), ' Call ',
    el('a', { href: `tel:${clinic.clinic.phone}` }, clinic.clinic.phoneDisplay)
  );
  document.body.prepend(banner);
}

async function boot() {
  const clinic = await loadConfig();
  initTheme();
  // Site is English-only; clear any language saved by the old selector.
  const lang = 'en';
  try { localStorage.removeItem('lang'); } catch {}
  const dict = await loadDict(lang);
  renderNavbar(clinic, dict, lang);
  renderFooter(clinic);
  renderWhatsAppFloat(clinic);
  renderEmergencyBanner(clinic);
  renderMobileCTA(clinic);
  renderLiveChat(clinic);
  renderAnalytics(clinic);
  renderReviews(clinic);
  renderOptionalMedia(clinic);
  renderOpenStatus(clinic);
  initClickTracking();
  applyI18n(document, dict, lang);
}
boot();