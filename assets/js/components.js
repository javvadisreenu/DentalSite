import { loadConfig, el, BASE, getTheme, setTheme, initTheme } from './lib/config.js';
import { buildWhatsAppUrl } from './lib/whatsapp.js';
import { t, loadDict, getLoadedDict, applyI18n } from './lib/i18n.js';

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
    el('button', { class: 'hamburger', 'aria-label': 'Open menu', 'aria-expanded': 'false',
      onclick: (e) => {
        const open = document.getElementById('nav-links').classList.toggle('open');
        e.currentTarget.setAttribute('aria-expanded', String(open));
      }
    }, '☰')
  );
  host.replaceChildren(nav);
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
        el('h3', {}, 'Quick Links'),
        el('a', { href: `${BASE}index.html#services`, class: 'footer-link' }, 'Services'),
        el('br'),
        el('a', { href: `${BASE}index.html#doctors`, class: 'footer-link' }, 'Doctors'),
        el('br'),
        el('a', { href: `${BASE}index.html#appointment`, class: 'footer-link' }, 'Book Appointment')
      ),
      el('div', {},
        el('h3', {}, 'Follow Us'),
        el('a', { href: c.social.facebook, target: '_blank', rel: 'noopener', class: 'footer-link' }, 'Facebook'),
        el('br'),
        el('a', { href: c.social.instagram, target: '_blank', rel: 'noopener', class: 'footer-link' }, 'Instagram')
      )
    ),
    el('p', { class: 'copyright' }, `© 2026 ${c.name}. All rights reserved.`)
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

export function renderEmergencyBanner(clinic) {
  if (!clinic.flags.emergencyBanner) return;
  const banner = el('div', { class: 'emergency-banner', role: 'alert' },
    '🚑 Emergency Dental Care — 24/7 helpline: ',
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
  applyI18n(document, dict, lang);
}
boot();