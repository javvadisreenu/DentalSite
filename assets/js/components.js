import { loadConfig, el } from './lib/config.js';
import { buildWhatsAppUrl } from './lib/whatsapp.js';

const NAV_LINKS = [
  { href: 'index.html#home', label: 'Home' },
  { href: 'index.html#services', label: 'Services' },
  { href: 'index.html#doctors', label: 'Doctors' },
  { href: 'index.html#gallery', label: 'Gallery' },
  { href: 'index.html#technology', label: 'Technology' },
  { href: 'index.html#contact', label: 'Contact' }
];

export function renderNavbar(clinic) {
  const host = document.getElementById('site-nav');
  if (!host) return;
  const links = NAV_LINKS.map(l => el('a', { href: l.href, class: 'nav-link' }, l.label));
  const nav = el('nav', { class: 'navbar container' },
    el('a', { href: 'index.html', class: 'brand', 'aria-label': clinic.clinic.name },
      el('img', { src: 'assets/img/logo.svg', alt: '', width: 40, height: 40 }),
      el('span', { class: 'brand-name' }, clinic.clinic.name)
    ),
    el('div', { class: 'nav-links', id: 'nav-links' }, ...links),
    el('a', { href: 'index.html#appointment', class: 'btn btn-primary nav-cta' }, 'Book Now'),
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

async function boot() {
  const clinic = await loadConfig();
  renderNavbar(clinic);
}
boot();