import { loadConfig, el, BASE, getTheme, setTheme, initTheme } from './lib/config.js';
import { buildWhatsAppUrl } from './lib/whatsapp.js';
import { t, loadDict, getLoadedDict, applyI18n } from './lib/i18n.js';
import { scrollToSection, samePageHash } from './lib/nav.js';

const NAV_LINKS = [
  { href: 'index.html#home', key: 'nav.home' },
  { href: 'index.html#services', key: 'nav.services' },
  { href: 'index.html#doctors', key: 'nav.doctors' },
  { href: 'index.html#gallery', key: 'nav.gallery' },
  { href: 'index.html#technology', key: 'nav.technology' },
  { href: 'index.html#contact', key: 'nav.contact' }
];

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' }
];

export function renderNavbar(clinic, dict, lang) {
  const host = document.getElementById('site-nav');
  if (!host) return;
  const links = NAV_LINKS.map(l =>
    el('a', { href: `${BASE}${l.href}`, class: 'nav-link', 'data-i18n': l.key }, t(l.key, dict, lang))
  );
  const current = localStorage.getItem('lang') || 'en';
  const langToggle = el('select', {
    class: 'lang-toggle',
    'aria-label': 'Change language',
    onchange: (e) => {
      localStorage.setItem('lang', e.target.value);
      location.reload();
    }
  }, ...LANGS.map(l => {
    const opt = el('option', { value: l.code }, l.label);
    if (l.code === current) opt.setAttribute('selected', 'selected');
    return opt;
  }));
  const nav = el('nav', { class: 'navbar container' },
    el('a', { href: `${BASE}index.html`, class: 'brand', 'aria-label': clinic.clinic.name },
      el('img', { src: `${BASE}assets/img/logo-full.png`, alt: clinic.clinic.name, class: 'brand-logo-img', height: 68 })
    ),
    el('div', { class: 'nav-links', id: 'nav-links' }, ...links),
    langToggle,
    el('a', { href: `${BASE}index.html#appointment`, class: 'btn btn-primary nav-cta', 'data-i18n': 'cta.book' }, t('cta.book', dict, lang)),
    el('button', { class: 'theme-toggle', 'aria-label': 'Toggle dark mode', onclick: () => setTheme(getTheme() === 'dark' ? 'light' : 'dark') }, '🌗'),
    el('button', { class: 'hamburger', 'aria-label': 'Open menu', 'aria-expanded': 'false', 'aria-controls': 'nav-links',
      onclick: () => setMenu(!menu.classList.contains('open'))
    }, '☰')
  );
  host.replaceChildren(nav);

  const menu = nav.querySelector('#nav-links');
  const burger = nav.querySelector('.hamburger');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.textContent = open ? '✕' : '☰';
  }

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
        ...[['index.html#doctors', 'Our Doctors'], ['index.html#faq', 'FAQs'], ['blog/index.html', 'Oral Health Blog'], ['index.html#appointment', 'Book Appointment'], ['index.html#contact', 'Contact & Directions']]
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
  const bar = el('div', { class: 'mobile-cta', id: 'mobile-cta' },
    el('a', { href: `tel:${clinic.clinic.phone}`, class: 'btn btn-outline' }, 'Call'),
    el('a', { href: `${BASE}index.html#appointment`, class: 'btn btn-primary' }, 'Book Now')
  );
  document.body.append(bar);
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

export function renderEmergencyBanner(clinic) {
  if (!clinic.flags.emergencyBanner) return;
  const banner = el('div', { class: 'emergency-banner', role: 'region', 'aria-label': 'Dental emergency' },
    '🚑 Dental emergency? Severe pain, swelling or a broken tooth — call us now: ',
    el('a', { href: `tel:${clinic.clinic.phone}` }, clinic.clinic.phoneDisplay)
  );
  document.body.prepend(banner);
}

async function boot() {
  const clinic = await loadConfig();
  initTheme();
  const lang = localStorage.getItem('lang') || 'en';
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
  applyI18n(document, dict, lang);
}
boot();