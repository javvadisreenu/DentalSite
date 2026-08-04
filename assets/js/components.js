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
        el('a', { href: 'index.html#services', class: 'footer-link' }, 'Services'),
        el('br'),
        el('a', { href: 'index.html#doctors', class: 'footer-link' }, 'Doctors'),
        el('br'),
        el('a', { href: 'index.html#appointment', class: 'footer-link' }, 'Book Appointment')
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
    el('img', { src: 'assets/img/whatsapp.svg', alt: 'WhatsApp', width: 28, height: 28 })
  );
  document.body.append(a);
}

async function boot() {
  const clinic = await loadConfig();
  renderNavbar(clinic);
  renderFooter(clinic);
  renderWhatsAppFloat(clinic);
}
boot();