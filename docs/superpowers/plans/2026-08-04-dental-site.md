# Dental Hospital Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, responsive, single-clinic dental hospital website (Root Canal, Extraction, Implants) as a zero-build static site with vanilla-JS component includes, then layer on the full set of Section 10 extras.

**Architecture:** Zero-build static HTML/CSS/JS. A single `clinic.json` config drives all content. `components.js` renders shared chrome (nav, footer, floats) into placeholders. Pure logic lives in importable ES modules under `assets/js/lib/` (tested with Node's built-in `node:test`); DOM wiring in `main.js` is verified manually. CSS variables drive theming.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES modules), Google Fonts (Sora + Inter), `node:test` for pure-function tests, any static server for manual verification.

## Global Constraints

- No framework, no jQuery, no build step. Site must open by serving the folder from any static host — no `npm install` required to view it.
- Palette tokens (verbatim from spec): `--teal #0F766E`, `--mint #5EEAD4`, `--coral #FF6B5B`, `--bg #F8FAFA`, `--surface #FFFFFF`, `--text #1E293B`, `--muted #64748B`, `--whatsapp #25D366`. Fonts: Sora (headings), Inter (body).
- v1 ships placeholder "Smile Care Dental Hospital" content. All clinic facts (name, phone, address, hours, doctors, services, pricing) come from `assets/data/clinic.json` — single swap point.
- No AI/fake photos presented as real clinic staff/equipment. Placeholder imagery is clearly labeled.
- Appointment form submits via WhatsApp `wa.me` only — no backend.
- Every image has `alt`; every interactive control is keyboard-operable; WCAG AA contrast; `prefers-reduced-motion` disables animations.
- Deploy target: static host (Netlify/Vercel/GitHub Pages). Lighthouse goal 90+ on Performance/SEO/Accessibility.
- Commit after every task with `feat:`/`chore:` prefix.

## Testing Strategy

Pure functions in `assets/js/lib/*.js` are plain ES modules exporting functions that take/return plain data (no DOM, no fetch inside them). Tests in `test/*.test.js` use Node's built-in runner:

```bash
node --test
```

This requires Node 18+ but adds **no dependency** (built-in) and is not part of the shipped site. DOM wiring is verified against the manual checklist in the final integration task.

---

# Phase 1 — Core Site (working & deployable)

## Task 1: Project scaffolding, config, dev server, test harness

**Files:**
- Create: `package.json`, `assets/data/clinic.json`, `test/sanity.test.js`, `.gitignore`
- Create: `index.html` (minimal shell for now)

**Interfaces:**
- Produces: `assets/data/clinic.json` (shape all later tasks consume), a working `node --test` harness.

- [ ] **Step 1: Create `package.json` with a test script (no runtime deps)**

```json
{
  "name": "dental-site",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test test/",
    "serve": "npx --yes serve ."
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
.DS_Store
dist/
```

- [ ] **Step 3: Create `assets/data/clinic.json` (the single source of truth)**

```json
{
  "clinic": {
    "name": "Smile Care Dental Hospital",
    "phone": "+919876543210",
    "phoneDisplay": "+91 98765 43210",
    "email": "info@smilecaredental.com",
    "address": "Plot No. 12, Road No. 5, Banjara Hills, Hyderabad, Telangana – 500034",
    "geo": { "lat": 17.4126, "lng": 78.4478 },
    "mapsEmbed": "https://www.google.com/maps?q=Banjara+Hills+Hyderabad&output=embed",
    "hours": [
      { "days": "Mon–Sat", "time": "9:00 AM – 8:00 PM" },
      { "days": "Sun", "time": "10:00 AM – 2:00 PM" }
    ],
    "social": {
      "facebook": "https://www.facebook.com/smilecaredental",
      "instagram": "https://www.instagram.com/smilecaredental"
    },
    "url": "https://www.smilecaredental.com/"
  },
  "flags": {
    "liveChat": false,
    "analytics": { "enabled": false, "ga4Id": "" },
    "reviews": false,
    "video": true,
    "emergencyBanner": true
  },
  "services": [
    { "id": "root-canal-treatment", "name": "Root Canal Treatment", "icon": "tooth", "blurb": "Pain-free, single-visit RCT with rotary endodontics.", "page": "services/root-canal-treatment.html" },
    { "id": "tooth-extraction", "name": "Tooth Extraction", "icon": "extract", "blurb": "Wisdom tooth & surgical extraction, painless techniques.", "page": "services/tooth-extraction.html" },
    { "id": "dental-implants", "name": "Dental Implants", "icon": "implant", "blurb": "Single tooth, full mouth & same-day implants.", "page": "services/dental-implants.html" }
  ],
  "doctors": [
    {
      "id": "dr-priya-sharma",
      "name": "Dr. Priya Sharma",
      "photo": "assets/img/doctors/dr-priya-sharma.svg",
      "qualifications": "BDS, MDS (Endodontics)",
      "specialization": "Root Canal Specialist",
      "experienceYears": 12,
      "bio": "Single-visit rotary endodontics & pain-free RCT.",
      "languages": ["English", "Hindi", "Telugu"],
      "rating": 4.9,
      "services": ["root-canal-treatment"]
    },
    {
      "id": "dr-arjun-rao",
      "name": "Dr. Arjun Rao",
      "photo": "assets/img/doctors/dr-arjun-rao.svg",
      "qualifications": "BDS, MDS (Oral Surgery)",
      "specialization": "Oral & Maxillofacial Surgeon",
      "experienceYears": 15,
      "bio": "Painless extractions & surgical wisdom-tooth removal.",
      "languages": ["English", "Telugu"],
      "rating": 4.8,
      "services": ["tooth-extraction"]
    },
    {
      "id": "dr-meera-iyer",
      "name": "Dr. Meera Iyer",
      "photo": "assets/img/doctors/dr-meera-iyer.svg",
      "qualifications": "BDS, MDS (Prosthodontics)",
      "specialization": "Implantologist",
      "experienceYears": 10,
      "bio": "Guided, minimally invasive dental implants & full-mouth rehabilitation.",
      "languages": ["English", "Hindi"],
      "rating": 5.0,
      "services": ["dental-implants"]
    }
  ],
  "equipment": [
    { "id": "opg", "name": "Digital OPG X-Ray", "benefit": "Full-mouth imaging in seconds with minimal radiation." },
    { "id": "rvg", "name": "RVG Intraoral X-Ray", "benefit": "Instant single-tooth imaging chairside, no film." },
    { "id": "cbct", "name": "CBCT 3D Scan", "benefit": "3D scan for precise implant planning." },
    { "id": "scanner", "name": "Intraoral Scanner", "benefit": "Digital impressions — no messy putty molds." },
    { "id": "rotary", "name": "Rotary Endodontics", "benefit": "Faster, more precise root canal treatment." },
    { "id": "implant-motor", "name": "Implant Motor & Surgical Kit", "benefit": "Guided, minimally invasive implant placement." },
    { "id": "laser", "name": "Soft-Tissue Laser", "benefit": "Painless gum treatments, faster healing." },
    { "id": "apex", "name": "Apex Locator", "benefit": "Accurate root canal length measurement." },
    { "id": "autoclave", "name": "Autoclave Sterilizer", "benefit": "Hospital-grade sterilization of every instrument." },
    { "id": "curing", "name": "LED Curing Light", "benefit": "Long-lasting, precise fillings." },
    { "id": "scaler", "name": "Ultrasonic Scaler", "benefit": "Comfortable, thorough teeth cleaning." },
    { "id": "smile-design", "name": "Smile Design Software", "benefit": "Preview your new smile before treatment." }
  ],
  "testimonials": [
    { "id": "t1", "name": "Rahul V.", "rating": 5, "text": "Painless root canal, done in a single visit. Excellent care!" },
    { "id": "t2", "name": "Sneha K.", "rating": 5, "text": "My implant feels completely natural. Highly recommend." },
    { "id": "t3", "name": "Imran S.", "rating": 4, "text": "Wisdom tooth extraction was quick and comfortable." }
  ],
  "faqs": [
    { "id": "f1", "q": "Is root canal treatment painful?", "a": "No. With modern rotary endodontics and local anesthesia, RCT is virtually pain-free and often completed in a single visit." },
    { "id": "f2", "q": "How long does a dental implant take?", "a": "Same-day implants are possible for some cases; full integration typically takes 3–6 months before the final crown is placed." },
    { "id": "f3", "q": "Do you offer EMI/insurance options?", "a": "Yes. We offer EMI plans and assist with insurance paperwork for eligible procedures." }
  ],
  "pricing": {
    "root-canal-treatment": { "min": 3500, "max": 8000, "currency": "₹", "factors": ["Tooth position", "Number of canals", "Crown type"] },
    "tooth-extraction": { "min": 800, "max": 6000, "currency": "₹", "factors": ["Simple vs surgical", "Wisdom tooth", "Bone impaction"] },
    "dental-implants": { "min": 20000, "max": 45000, "currency": "₹", "factors": ["Implant brand", "Bone grafting", "Single vs full mouth"] }
  }
}
```

- [ ] **Step 4: Create `test/sanity.test.js` verifying the config loads and parses**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../assets/data/clinic.json', import.meta.url), 'utf8'));

test('clinic.json has required top-level keys', () => {
  for (const k of ['clinic', 'flags', 'services', 'doctors', 'equipment', 'testimonials', 'faqs', 'pricing']) {
    assert.ok(k in data, `missing ${k}`);
  }
});

test('every doctor has a specialization and photo', () => {
  for (const d of data.doctors) {
    assert.ok(d.specialization, `${d.id} missing specialization`);
    assert.ok(d.photo, `${d.id} missing photo`);
    assert.ok(Array.isArray(d.services), `${d.id} missing services array`);
  }
});

test('every service has a pricing entry', () => {
  for (const s of data.services) {
    assert.ok(data.pricing[s.id], `missing pricing for ${s.id}`);
  }
});
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: 3 passing.

- [ ] **Step 6: Create a minimal `index.html` shell (full content comes in later tasks)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smile Care Dental Hospital | Root Canal, Extraction & Implants in Hyderabad</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <div id="site-nav"></div>
  <main></main>
  <div id="site-footer"></div>
  <script type="module" src="assets/js/components.js"></script>
  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add package.json .gitignore assets/data/clinic.json test/sanity.test.js index.html
git commit -m "chore: scaffold project, config, test harness"
```

---

## Task 2: Design tokens & base stylesheet

**Files:**
- Create: `assets/css/styles.css`

**Interfaces:**
- Produces: CSS custom properties and layout primitives all later tasks use.

- [ ] **Step 1: Write `assets/css/styles.css` with tokens, reset, primitives**

```css
:root {
  --teal: #0F766E;
  --mint: #5EEAD4;
  --coral: #FF6B5B;
  --bg: #F8FAFA;
  --surface: #FFFFFF;
  --text: #1E293B;
  --muted: #64748B;
  --whatsapp: #25D366;
  --grad: linear-gradient(135deg, var(--teal), var(--mint));
  --shadow: 0 10px 30px rgba(15,118,110,0.08);
  --shadow-lg: 0 20px 50px rgba(15,118,110,0.12);
  --radius: 20px;
  --radius-sm: 12px;
  --space: 8px;
  --maxw: 1140px;
  --font-head: 'Sora', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --nav-h: 72px;
  color-scheme: light;
}
:root[data-theme="dark"] {
  --bg: #0B1F1E;
  --surface: #102A29;
  --text: #E2F3F0;
  --muted: #94B4B0;
  --shadow: 0 10px 30px rgba(0,0,0,0.4);
  color-scheme: dark;
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: var(--nav-h); }
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}
h1, h2, h3 { font-family: var(--font-head); line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 0.5em; }
h1 { font-size: clamp(2rem, 5vw, 3.4rem); }
h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); }
a { color: var(--teal); text-decoration: none; }
img { max-width: 100%; display: block; }
section { padding: clamp(48px, 8vw, 96px) 0; }
.container { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 28px;
  transition: transform .25s ease, box-shadow .25s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 999px; border: 0; cursor: pointer;
  font-weight: 600; font-family: var(--font-body); font-size: 1rem;
  transition: transform .2s ease, filter .2s ease;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.btn-primary { background: var(--grad); color: #fff; box-shadow: var(--shadow); }
.btn-outline { background: transparent; color: var(--teal); border: 2px solid var(--teal); }
.grid { display: grid; gap: 24px; }
@media (min-width: 700px) { .grid.cols-3 { grid-template-columns: repeat(3, 1fr); } .grid.cols-4 { grid-template-columns: repeat(4, 1fr); } }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.reveal.reveal-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Add the Google Fonts link to `index.html` `<head>` (before stylesheet)**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Verify visually** — run `npm run serve`, open the URL, confirm page loads with no console errors and a blank themed background. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat: design tokens and base stylesheet"
```

---

## Task 3: WhatsApp URL builder (pure function, TDD)

**Files:**
- Create: `assets/js/lib/whatsapp.js`, `test/whatsapp.test.js`

**Interfaces:**
- Produces: `buildWhatsAppUrl(phone, message)` → string; `buildBookingMessage(fields)` → string.

- [ ] **Step 1: Write failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, buildBookingMessage } from '../assets/js/lib/whatsapp.js';

test('buildWhatsAppUrl strips non-digits and percent-encodes text', () => {
  const url = buildWhatsAppUrl('+91 98765 43210', 'Hi, book appointment');
  assert.equal(url, 'https://wa.me/919876543210?text=Hi%2C%20book%20appointment');
});

test('buildBookingMessage formats multiline booking details', () => {
  const msg = buildBookingMessage({ name: 'Rahul', phone: '99999', service: 'Root Canal', date: '2026-09-01', time: '10:00' });
  assert.match(msg, /Name: Rahul/);
  assert.match(msg, /Service: Root Canal/);
  assert.match(msg, /Preferred Date: 2026-09-01/);
  assert.match(msg, /Preferred Time: 10:00/);
});
```

- [ ] **Step 2: Run tests — expect FAIL (`Cannot find module`)**

Run: `npm test`

- [ ] **Step 3: Implement `assets/js/lib/whatsapp.js`**

```js
export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildBookingMessage(f) {
  return [
    "Hello, I'd like to book an appointment.",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Service: ${f.service}`,
    `Preferred Date: ${f.date}`,
    `Preferred Time: ${f.time}`
  ].join('\n');
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test`

- [ ] **Step 5: Commit**

```bash
git add assets/js/lib/whatsapp.js test/whatsapp.test.js
git commit -m "feat: whatsapp url builder with tests"
```

---

## Task 4: components.js — Navbar (shared chrome bootstrap)

**Files:**
- Create: `assets/js/components.js`, `assets/js/lib/config.js`
- Create: `assets/img/logo.svg`

**Interfaces:**
- Produces: `loadConfig()` (fetch + cache `clinic.json`); `renderNavbar(clinic)` injecting into `#site-nav`.

- [ ] **Step 1: Create `assets/js/lib/config.js` (config loader + helpers)**

```js
let cache = null;
export async function loadConfig() {
  if (cache) return cache;
  const res = await fetch('assets/data/clinic.json');
  cache = await res.json();
  return cache;
}
export function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    n.append(c.nodeType ? c : document.createTextNode(c));
  }
  return n;
}
```

- [ ] **Step 2: Create `assets/img/logo.svg`** (simple tooth mark in teal)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40" role="img" aria-label="Smile Care logo">
  <path fill="#0F766E" d="M24 6c-6 0-10 3-13 3S6 8 6 14c0 8 4 12 5 19 .6 4 3 5 4 1 1-5 3-9 5-9s4 4 5 9c1 4 3.4 3 4-1 1-7 5-11 5-19 0-6-3-5-5-5s-6-3-13-3z"/>
</svg>
```

- [ ] **Step 3: Create `assets/js/components.js` with navbar + bootstrap**

```js
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
```

- [ ] **Step 4: Add navbar CSS to `assets/css/styles.css`**

```css
#site-nav { position: sticky; top: 0; z-index: 50; transition: background .3s, box-shadow .3s; }
#site-nav.scrolled { background: rgba(248,250,250,0.8); backdrop-filter: blur(12px); box-shadow: var(--shadow); }
:root[data-theme="dark"] #site-nav.scrolled { background: rgba(11,31,30,0.8); }
.navbar { display: flex; align-items: center; gap: 16px; height: var(--nav-h); }
.brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-head); font-weight: 700; color: var(--text); }
.nav-links { display: flex; gap: 20px; margin-left: auto; }
.nav-link { color: var(--text); font-weight: 500; }
.nav-link:hover { color: var(--teal); }
.nav-cta { margin-left: 8px; }
.hamburger { display: none; background: none; border: 0; font-size: 1.6rem; color: var(--text); cursor: pointer; }
@media (max-width: 760px) {
  .hamburger { display: block; margin-left: auto; }
  .nav-cta { display: none; }
  .nav-links { position: absolute; top: var(--nav-h); left: 0; right: 0; flex-direction: column; background: var(--surface); padding: 16px 24px; box-shadow: var(--shadow); display: none; }
  .nav-links.open { display: flex; }
}
```

- [ ] **Step 5: Verify** — `npm run serve`, open, confirm navbar renders with logo, links, Book Now, and hamburger on mobile width. Click hamburger → menu opens. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add assets/js/components.js assets/js/lib/config.js assets/img/logo.svg assets/css/styles.css
git commit -m "feat: shared navbar with scroll glassmorphism"
```

---

## Task 5: components.js — Footer & WhatsApp float

**Files:**
- Modify: `assets/js/components.js` (add `renderFooter`, `renderWhatsAppFloat`)
- Modify: `assets/css/styles.css` (footer + float + pulse)

**Interfaces:**
- Produces: `renderFooter(clinic)`, `renderWhatsAppFloat(clinic)`.

- [ ] **Step 1: Add renderers to `components.js` (after navbar, before `boot`)**

```js
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
```

- [ ] **Step 2: Update `boot()` to call the new renderers**

```js
async function boot() {
  const clinic = await loadConfig();
  renderNavbar(clinic);
  renderFooter(clinic);
  renderWhatsAppFloat(clinic);
}
```

- [ ] **Step 3: Create `assets/img/whatsapp.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" role="img" aria-label="WhatsApp"><path fill="#fff" d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-2.1c1.8 1 3.8 1.5 5.6 1.5 7 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22.5c-1.7 0-3.3-.4-4.7-1.2l-.3-.2-4.4 1.3 1.3-4.3-.2-.3a9.5 9.5 0 01-1.5-5.3c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10zm5.3-7.2c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.2 1.8.7 2.4.8 3.3.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
```

- [ ] **Step 4: Add CSS**

```css
.footer { background: var(--surface); border-top: 1px solid rgba(15,118,110,0.1); padding: 48px 0 24px; }
.footer-grid { display: grid; gap: 32px; }
@media (min-width: 700px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr; } }
.footer-link, .footer h3 { color: var(--text); }
.muted { color: var(--muted); }
.copyright { text-align: center; color: var(--muted); padding: 24px 0 0; margin: 24px 0 0; border-top: 1px solid rgba(15,118,110,0.08); }
.whatsapp-float {
  position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px;
  border-radius: 50%; background: var(--whatsapp); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(37,211,102,0.4); z-index: 999; animation: pulse 2s infinite;
}
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,.5);} 70% { box-shadow: 0 0 0 14px rgba(37,211,102,0);} 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0);} }
@media (prefers-reduced-motion: reduce) { .whatsapp-float { animation: none; } }
```

- [ ] **Step 5: Verify** — footer renders with address/hours/links; pulsing WhatsApp button bottom-right opens a `wa.me` link. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add assets/js/components.js assets/img/whatsapp.svg assets/css/styles.css
git commit -m "feat: footer and floating whatsapp button"
```

---

## Task 6: main.js — ScrollReveal (IntersectionObserver)

**Files:**
- Create: `assets/js/main.js`

**Interfaces:**
- Produces: `initScrollReveal()` (no-op if no `[data-reveal]`).

- [ ] **Step 1: Create `assets/js/main.js`**

```js
import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';

function init() {
  initScrollReveal();
}
init();
```

- [ ] **Step 2: Create `assets/js/lib/reveal.js`**

```js
export function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('reveal-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });
  els.forEach(e => { e.classList.add('reveal'); io.observe(e); });
}
```

- [ ] **Step 3: Verify** — temporarily add `<section data-reveal><h2>Test</h2></section>` to `index.html` `<main>`, confirm it fades up on scroll, then remove it. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js assets/js/lib/reveal.js
git commit -m "feat: intersectionobserver scroll reveal"
```

---

## Task 7: Hero & Trust Bar

**Files:**
- Modify: `index.html` (add `#home` hero and `#trust` sections to `<main>`)

- [ ] **Step 1: Add Hero + Trust Bar to `index.html` `<main>`**

```html
<header id="home" class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <h1>Your Smile, <span class="accent">Our Specialty</span></h1>
      <p class="muted">Painless root canal, extraction & dental implants in Hyderabad — modern equipment, expert specialists, care you can trust.</p>
      <div class="hero-cta">
        <a href="#appointment" class="btn btn-primary">Book Appointment</a>
        <a href="tel:+919876543210" class="btn btn-outline">Call Now</a>
      </div>
    </div>
    <img class="hero-art" src="assets/img/hero-tooth.svg" alt="Dental tooth illustration" width="420" height="420">
  </div>
</header>

<section id="trust" class="trust-bar">
  <div class="container grid cols-4 trust-grid">
    <div class="trust-item"><strong>15+</strong><span class="muted">Years of care</span></div>
    <div class="trust-item"><strong>20k+</strong><span class="muted">Patients treated</span></div>
    <div class="trust-item"><strong>4.9★</strong><span class="muted">Patient rating</span></div>
    <div class="trust-item"><strong>ISO</strong><span class="muted">Certified sterilization</span></div>
  </div>
</section>
```

- [ ] **Step 2: Create `assets/img/hero-tooth.svg`** (decorative)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420" role="img" aria-label="Stylized tooth illustration">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5EEAD4"/><stop offset="1" stop-color="#0F766E"/></linearGradient></defs>
  <circle cx="210" cy="210" r="190" fill="url(#g)" opacity="0.15"/>
  <path fill="url(#g)" d="M210 90c-40 0-65 20-85 20s-35-8-35 12c0 50 28 75 34 120 4 26 20 34 27 7 7-30 20-60 34-60s27 30 34 60c7 27 23 19 27-7 6-45 34-70 34-120 0-20-15-12-35-12s-45-20-85-20z"/>
</svg>
```

- [ ] **Step 3: Add CSS**

```css
.hero { padding: clamp(48px, 10vw, 120px) 0; background: linear-gradient(135deg, rgba(94,234,212,0.12), rgba(15,118,110,0.06)); }
.hero-grid { display: grid; gap: 32px; align-items: center; }
@media (min-width: 820px) { .hero-grid { grid-template-columns: 1.1fr 0.9fr; } }
.hero-cta { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 24px; }
.accent { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero-art { margin: 0 auto; }
.trust-bar { padding: 32px 0; background: var(--surface); }
.trust-grid { text-align: center; }
.trust-item strong { display: block; font-family: var(--font-head); font-size: 1.8rem; color: var(--teal); }
.trust-item span { font-size: .9rem; }
```

- [ ] **Step 4: Verify** — hero shows headline, dual CTA, illustration; trust bar shows 4 stats. Both responsive. (Manual.)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/img/hero-tooth.svg assets/css/styles.css
git commit -m "feat: hero and trust bar"
```

---

## Task 8: Services section (3 cards → service pages)

**Files:**
- Modify: `index.html` (add `#services` section)
- Create: `assets/js/lib/render.js` (shared data-driven card renderers)

**Interfaces:**
- Produces: `renderServiceCards(clinic, containerSelector)`.

- [ ] **Step 1: Add `#services` to `index.html` `<main>` (after trust bar)**

```html
<section id="services">
  <div class="container">
    <h2 data-reveal>Our Specializations</h2>
    <p class="muted" data-reveal>Expert care across three core dental disciplines.</p>
    <div class="grid cols-3" id="service-cards" data-reveal></div>
  </div>
</section>
```

- [ ] **Step 2: Create `assets/js/lib/render.js`**

```js
import { el } from './config.js';
const ICONS = {
  tooth: '🦷', extract: '🔧', implant: '🔩'
};
export function renderServiceCards(clinic, selector = '#service-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.services.map(s =>
    el('article', { class: 'card service-card' },
      el('div', { class: 'service-icon', 'aria-hidden': 'true' }, ICONS[s.icon] || '🦷'),
      el('h3', {}, s.name),
      el('p', { class: 'muted' }, s.blurb),
      el('a', { href: s.page, class: 'service-link' }, 'Learn More →')
    )
  ));
}
```

- [ ] **Step 3: Wire into `main.js`**

```js
import { initScrollReveal } from './lib/reveal.js';
import { loadConfig } from './lib/config.js';
import { renderServiceCards } from './lib/render.js';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  renderServiceCards(clinic);
}
init();
```

- [ ] **Step 4: Add CSS**

```css
.service-card { display: flex; flex-direction: column; gap: 8px; }
.service-icon { font-size: 2rem; }
.service-link { margin-top: auto; font-weight: 600; }
.service-link:hover { text-decoration: underline; }
```

- [ ] **Step 5: Verify** — 3 cards render with icon, name, blurb, "Learn More →" link. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/lib/render.js assets/js/main.js assets/css/styles.css
git commit -m "feat: services section with config-driven cards"
```

---

## Task 9: Why Choose Us & Our Technology grid

**Files:**
- Modify: `index.html` (add `#why` and `#technology`)
- Modify: `assets/js/lib/render.js` (add `renderEquipment`)
- Modify: `assets/js/main.js`

**Interfaces:**
- Produces: `renderEquipment(clinic, selector)`.

- [ ] **Step 1: Add sections to `index.html` (after services)**

```html
<section id="why" class="alt">
  <div class="container">
    <h2 data-reveal>Why Choose Us</h2>
    <div class="grid cols-4" data-reveal>
      <div class="card"><h3>Modern Equipment</h3><p class="muted">Latest digital & laser tech for precise care.</p></div>
      <div class="card"><h3>Sterilization Protocol</h3><p class="muted">Hospital-grade autoclave for every instrument.</p></div>
      <div class="card"><h3>Painless Treatment</h3><p class="muted">Sedation & gentle techniques throughout.</p></div>
      <div class="card"><h3>EMI & Insurance</h3><p class="muted">Flexible financing and insurance assistance.</p></div>
    </div>
  </div>
</section>

<section id="technology">
  <div class="container">
    <h2 data-reveal>Advanced Technology We Use</h2>
    <p class="muted" data-reveal>Modern equipment for accurate diagnosis, painless treatment & faster recovery.</p>
    <div class="grid cols-4" id="tech-cards" data-reveal></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderEquipment` to `assets/js/lib/render.js`**

```js
export function renderEquipment(clinic, selector = '#tech-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.equipment.map(eq =>
    el('div', { class: 'tech-card' },
      el('div', { class: 'tech-dot', 'aria-hidden': 'true' }),
      el('h3', {}, eq.name),
      el('p', { class: 'muted' }, eq.benefit)
    )
  ));
}
```

- [ ] **Step 3: Call `renderEquipment(clinic)` in `main.js` init.**

- [ ] **Step 4: Add CSS**

```css
.alt { background: var(--surface); }
.tech-card { padding: 20px; }
.tech-dot { width: 40px; height: 40px; border-radius: 12px; background: var(--grad); margin-bottom: 12px; }
```

- [ ] **Step 5: Verify** — 4 why-choose cards + 12 equipment cards render. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/lib/render.js assets/js/main.js assets/css/styles.css
git commit -m "feat: why-choose-us and technology grid"
```

---

## Task 10: Doctors section (config-driven cards)

**Files:**
- Modify: `index.html` (add `#doctors`)
- Modify: `assets/js/lib/render.js` (add `renderDoctors`)
- Modify: `assets/js/main.js`

**Interfaces:**
- Produces: `renderDoctors(clinic, selector)`.

- [ ] **Step 1: Add `#doctors` to `index.html` (after technology)**

```html
<section id="doctors" class="alt">
  <div class="container">
    <h2 data-reveal>Meet Our Specialists</h2>
    <p class="muted" data-reveal>Experienced doctors dedicated to your comfort.</p>
    <div class="grid cols-3" id="doctor-cards" data-reveal></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderDoctors` to `render.js`**

```js
export function renderDoctors(clinic, selector = '#doctor-cards') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.doctors.map(d =>
    el('article', { class: 'card doctor-card' },
      el('img', { src: d.photo, alt: `${d.name}, ${d.specialization}`, loading: 'lazy', width: 320, height: 240 }),
      el('span', { class: 'badge' }, `${d.experienceYears}+ yrs`),
      el('h3', {}, d.name),
      el('p', { class: 'spec' }, d.specialization),
      el('p', { class: 'qual muted' }, d.qualifications),
      el('p', { class: 'muted' }, d.bio)
    )
  ));
}
```

- [ ] **Step 3: Create a placeholder doctor portrait SVG and reference for each doctor**

Create `assets/img/doctors/dr-priya-sharma.svg`, `dr-arjun-rao.svg`, `dr-meera-iyer.svg` — each a labeled placeholder:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240" role="img" aria-label="Placeholder doctor portrait">
  <rect width="320" height="240" fill="#E6F4F2"/>
  <circle cx="160" cy="95" r="40" fill="#5EEAD4"/>
  <path d="M95 220c0-40 30-65 65-65s65 25 65 65z" fill="#5EEAD4"/>
  <text x="160" y="232" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" fill="#64748B">Placeholder portrait — replace with real photo</text>
</svg>
```

(Repeat per file, changing the `aria-label`/`<text>` name accordingly.)

- [ ] **Step 4: Call `renderDoctors(clinic)` in `main.js` init.**

- [ ] **Step 5: Add CSS**

```css
.doctor-card { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; }
.doctor-card img { border-radius: var(--radius-sm); aspect-ratio: 4/3; object-fit: cover; }
.doctor-card .badge { position: absolute; top: 16px; right: 16px; background: var(--grad); color: #fff; padding: 4px 10px; border-radius: 999px; font-size: .8rem; font-weight: 600; }
.doctor-card .spec { color: var(--teal); font-weight: 600; margin: 4px 0 0; }
.doctor-card .qual { font-size: .9rem; }
```

- [ ] **Step 6: Verify** — 3 doctor cards with photo, experience badge, name, specialization, qualifications, bio. (Manual.)

- [ ] **Step 7: Commit**

```bash
git add index.html assets/js/lib/render.js assets/js/main.js assets/css/styles.css assets/img/doctors/
git commit -m "feat: doctors section with config-driven cards and placeholder portraits"
```

---

## Task 11: Testimonials carousel

**Files:**
- Modify: `index.html` (add `#testimonials`)
- Create: `assets/js/lib/carousel.js`
- Modify: `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `initCarousel(clinic, selector)`.

- [ ] **Step 1: Add `#testimonials` to `index.html` (after doctors)**

```html
<section id="testimonials">
  <div class="container">
    <h2 data-reveal>What Our Patients Say</h2>
    <div class="carousel" id="testimonial-carousel" data-reveal aria-live="polite"></div>
    <div class="carousel-dots" id="carousel-dots" role="tablist" aria-label="Testimonial navigation"></div>
  </div>
</section>
```

- [ ] **Step 2: Create `assets/js/lib/carousel.js`**

```js
import { el } from './config.js';

export function initCarousel(clinic, selector = '#testimonial-carousel') {
  const host = document.querySelector(selector);
  if (!host || !clinic.testimonials.length) return;
  const items = clinic.testimonials;
  let i = 0;
  host.replaceChildren(...items.map((t, idx) =>
    el('figure', { class: 'carousel-item' + (idx === 0 ? ' active' : ''), role: 'tabpanel', 'aria-hidden': idx === 0 ? 'false' : 'true' },
      el('blockquote', {}, t.text),
      el('figcaption', {}, `${t.name} — ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}`)
    )
  ));
  const dots = document.querySelector('#carousel-dots');
  if (dots) {
    dots.replaceChildren(...items.map((_, idx) =>
      el('button', { class: 'dot' + (idx === 0 ? ' active' : ''), role: 'tab',
        'aria-label': `Testimonial ${idx + 1}`, 'aria-selected': idx === 0 ? 'true' : 'false',
        onclick: () => go(idx) })
    ));
  }
  function go(n) {
    i = (n + items.length) % items.length;
    host.querySelectorAll('.carousel-item').forEach((node, idx) => {
      const on = idx === i;
      node.classList.toggle('active', on);
      node.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (dots) dots.querySelectorAll('.dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
      d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
  }
  let timer = setInterval(() => go(i + 1), 5000);
  host.addEventListener('mouseenter', () => clearInterval(timer));
  host.addEventListener('mouseleave', () => timer = setInterval(() => go(i + 1), 5000));
  host.addEventListener('click', () => go(i + 1));
}
```

- [ ] **Step 3: Call `initCarousel(clinic)` in `main.js` init.**

- [ ] **Step 4: Add CSS**

```css
.carousel { position: relative; min-height: 160px; }
.carousel-item { display: none; margin: 0; text-align: center; }
.carousel-item.active { display: block; animation: fade .5s ease; }
.carousel-item blockquote { font-size: 1.2rem; font-style: italic; }
.carousel-item figcaption { color: var(--muted); margin-top: 12px; }
.carousel-dots { display: flex; gap: 8px; justify-content: center; margin-top: 16px; }
.dot { width: 10px; height: 10px; border-radius: 50%; border: 0; background: rgba(15,118,110,0.25); cursor: pointer; padding: 0; }
.dot.active { background: var(--teal); }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .carousel-item.active { animation: none; } }
```

- [ ] **Step 5: Verify** — auto-rotating testimonials, dots clickable, pause on hover. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/lib/carousel.js assets/js/main.js assets/css/styles.css
git commit -m "feat: auto-rotating testimonials carousel"
```

---

## Task 12: Appointment booking form (validation + WhatsApp submit)

**Files:**
- Create: `assets/js/lib/form.js`, `test/form.test.js`
- Modify: `index.html` (add `#appointment`)
- Modify: `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `validateBookingForm(data)` → `{valid, errors}`; `initBookingForm(clinic)`.

- [ ] **Step 1: Write failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBookingForm } from '../assets/js/lib/form.js';

test('valid form passes', () => {
  const r = validateBookingForm({ name: 'Rahul', phone: '9876543210', service: 'Root Canal Treatment', date: '2099-01-01', time: '10:00' });
  assert.ok(r.valid);
  assert.equal(r.errors.length, 0);
});

test('missing name fails', () => {
  const r = validateBookingForm({ name: '', phone: '9876543210', service: 'x', date: '2099-01-01', time: '10:00' });
  assert.ok(!r.valid);
  assert.match(r.errors[0], /name/i);
});

test('invalid phone fails', () => {
  const r = validateBookingForm({ name: 'R', phone: '123', service: 'x', date: '2099-01-01', time: '10:00' });
  assert.ok(!r.valid);
  assert.ok(r.errors.some(e => /phone/i.test(e)));
});

test('past date fails', () => {
  const r = validateBookingForm({ name: 'R', phone: '9876543210', service: 'x', date: '2000-01-01', time: '10:00' });
  assert.ok(!r.valid);
  assert.ok(r.errors.some(e => /date/i.test(e)));
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Create `assets/js/lib/form.js`**

```js
export function validateBookingForm(d) {
  const errors = [];
  if (!d.name || d.name.trim().length < 2) errors.push('Name is required.');
  if (!d.phone || !/^\d{10}$/.test(String(d.phone).replace(/\D/g, '').slice(-10))) errors.push('A valid 10-digit phone is required.');
  if (!d.service) errors.push('Please select a service.');
  if (!d.date) errors.push('Preferred date is required.');
  else {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const chosen = new Date(d.date);
    if (chosen < today) errors.push('Preferred date cannot be in the past.');
  }
  if (!d.time) errors.push('Preferred time is required.');
  return { valid: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run — expect PASS.** Run: `npm test`

- [ ] **Step 5: Add `#appointment` to `index.html` (after testimonials)**

```html
<section id="appointment" class="alt">
  <div class="container appointment-grid">
    <div>
      <h2 data-reveal>Book an Appointment</h2>
      <p class="muted" data-reveal>Fill the form and we'll confirm via WhatsApp.</p>
    </div>
    <form id="appointmentForm" novalidate data-reveal>
      <div class="field"><label for="name">Name</label><input id="name" name="name" required></div>
      <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" required></div>
      <div class="field"><label for="service">Service</label>
        <select id="service" name="service" required></select></div>
      <div class="field-row">
        <div class="field"><label for="date">Preferred Date</label><input id="date" name="date" type="date" required></div>
        <div class="field"><label for="time">Preferred Time</label><input id="time" name="time" type="time" required></div>
      </div>
      <div class="field"><label for="message">Message (optional)</label><textarea id="message" name="message" rows="2"></textarea></div>
      <ul id="formErrors" class="form-errors" role="alert" hidden></ul>
      <button type="submit" class="btn btn-primary">Send on WhatsApp</button>
    </form>
  </div>
</section>
```

- [ ] **Step 6: Add `initBookingForm` to `form.js` and wire into `main.js`**

```js
import { buildWhatsAppUrl, buildBookingMessage } from './whatsapp.js';

export function initBookingForm(clinic, presetService) {
  const form = document.getElementById('appointmentForm');
  if (!form) return;
  const sel = document.getElementById('service');
  clinic.services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name; opt.textContent = s.name;
    sel.append(opt);
  });
  if (presetService) sel.value = presetService;
  const errBox = document.getElementById('formErrors');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value, phone: form.phone.value, service: form.service.value,
      date: form.date.value, time: form.time.value
    };
    const { valid, errors } = validateBookingForm(data);
    if (!valid) {
      errBox.hidden = false;
      errBox.replaceChildren(...errors.map(m => {
        const li = document.createElement('li'); li.textContent = m; return li;
      }));
      return;
    }
    errBox.hidden = true;
    window.open(buildWhatsAppUrl(clinic.clinic.phone, buildBookingMessage(data)), '_blank');
  });
}
```

In `main.js`, after config load: `initBookingForm(clinic);`

- [ ] **Step 7: Add CSS**

```css
.appointment-grid { display: grid; gap: 32px; }
@media (min-width: 820px) { .appointment-grid { grid-template-columns: 0.8fr 1.2fr; } }
.field { margin-bottom: 14px; }
.field-row { display: flex; gap: 12px; }
.field-row .field { flex: 1; }
label { display: block; font-weight: 500; margin-bottom: 6px; font-size: .9rem; }
input, select, textarea { width: 100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(15,118,110,0.25); background: var(--bg); color: var(--text); font-family: inherit; }
input:focus, select:focus, textarea:focus { outline: 2px solid var(--teal); border-color: var(--teal); }
.form-errors { color: #b91c1c; margin: 8px 0; }
:root[data-theme="dark"] .form-errors { color: #fca5a5; }
```

- [ ] **Step 8: Verify** — submit empty form → inline errors; valid submit → opens `wa.me` with pre-filled message containing all fields. (Manual.)

- [ ] **Step 9: Commit**

```bash
git add assets/js/lib/form.js test/form.test.js index.html assets/js/main.js assets/css/styles.css
git commit -m "feat: appointment booking form with validation and whatsapp submit"
```

---

## Task 13: Contact & Map

**Files:**
- Modify: `index.html` (add `#contact` before footer placeholder)
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add `#contact` to `index.html` `<main>`**

```html
<section id="contact">
  <div class="container contact-grid">
    <div data-reveal>
      <h2>Visit Us</h2>
      <p class="muted">Smile Care Dental Hospital<br>Plot No. 12, Road No. 5, Banjara Hills, Hyderabad, Telangana – 500034</p>
      <p class="muted">📞 <a href="tel:+919876543210">+91 98765 43210</a> · ✉️ <a href="mailto:info@smilecaredental.com">info@smilecaredental.com</a></p>
      <p class="muted">🕒 Mon–Sat: 9:00 AM – 8:00 PM · Sun: 10:00 AM – 2:00 PM</p>
      <a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&destination=Banjara+Hills+Hyderabad" target="_blank" rel="noopener">Get Directions</a>
    </div>
    <div class="map-wrap" data-reveal>
      <iframe title="Clinic location map" src="https://www.google.com/maps?q=Banjara+Hills+Hyderabad&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add CSS**

```css
.contact-grid { display: grid; gap: 32px; align-items: start; }
@media (min-width: 820px) { .contact-grid { grid-template-columns: 1fr 1.2fr; } }
.map-wrap { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
.map-wrap iframe { width: 100%; height: 320px; border: 0; display: block; }
```

- [ ] **Step 3: Verify** — contact details + clickable phone/email + map iframe + Get Directions. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: contact section with map embed"
```

---

## Task 14: Service pages (shared layout, 3 pages, MedicalProcedure JSON-LD)

**Files:**
- Create: `services/root-canal-treatment.html`, `services/tooth-extraction.html`, `services/dental-implants.html`
- Modify: `assets/js/components.js` (make nav/footer paths work from subfolder)
- Modify: `assets/js/lib/config.js` (relative base path)

**Interfaces:**
- Produces: three service pages that load shared chrome and a pre-selected booking form.

- [ ] **Step 1: Make shared assets resolve from a subfolder — add a `BASE` resolver to `config.js`**

```js
// Add at top of assets/js/lib/config.js
export const BASE = (function () {
  const depth = (location.pathname.replace(/\/$/, '').match(/\//g) || []).length - 0;
  // On root index.html depth handling: if pathname includes /services/ use ../
  return location.pathname.includes('/services/') || location.pathname.includes('/blog/') ? '../' : '';
})();
```

Update `loadConfig` to fetch `${BASE}assets/data/clinic.json`, and `components.js` to prefix all asset/`href` paths (`assets/img/logo.svg` → `${BASE}assets/img/logo.svg`, `index.html#...` → `${BASE}index.html#...`) and NAV_LINKS hrefs.

- [ ] **Step 2: Create `services/root-canal-treatment.html`** (template — repeat for the other two with swapped content)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Root Canal Treatment in Hyderabad | Smile Care Dental Hospital</title>
  <meta name="description" content="Painless single-visit root canal treatment in Hyderabad with rotary endodontics. Book at Smile Care Dental Hospital.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/css/service.css">
  <script type="application/ld+json">
  { "@context":"https://schema.org","@type":"MedicalProcedure","name":"Root Canal Treatment",
    "procedureType":"Endodontic","howPerformed":"Rotary endodontics under local anesthesia, single visit.",
    "url":"https://www.smilecaredental.com/services/root-canal-treatment.html" }
  </script>
</head>
<body>
  <div id="site-nav"></div>
  <main>
    <header class="hero service-hero"><div class="container">
      <h1>Root Canal Treatment in Hyderabad</h1>
      <p class="muted">Pain-free, single-visit RCT with rotary endodontics.</p>
      <a class="btn btn-primary" href="#appointment">Book Appointment</a>
    </div></header>
    <section><div class="container">
      <h2 data-reveal>What is a Root Canal?</h2>
      <p class="muted" data-reveal>A root canal removes infected pulp, cleans the canals, and seals the tooth to save it from extraction — virtually painless with modern rotary tools and anesthesia.</p>
      <h2 data-reveal>The Procedure</h2>
      <ol data-reveal><li>Diagnosis & digital X-Ray</li><li>Local anesthesia</li><li>Pulp removal & rotary cleaning</li><li>Sealing & crown placement</li></ol>
      <h2 data-reveal>Your Specialist</h2>
      <div id="doctor-cards" class="grid cols-3" data-reveal></div>
    </div></section>
    <section id="appointment" class="alt"><div class="container appointment-grid">
      <div><h2>Book Your Root Canal</h2><p class="muted">We'll confirm your appointment via WhatsApp.</p></div>
      <form id="appointmentForm" novalidate>
        <div class="field"><label for="name">Name</label><input id="name" name="name" required></div>
        <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" required></div>
        <div class="field"><label for="service">Service</label><select id="service" name="service" required></select></div>
        <div class="field-row"><div class="field"><label for="date">Preferred Date</label><input id="date" name="date" type="date" required></div>
        <div class="field"><label for="time">Preferred Time</label><input id="time" name="time" type="time" required></div></div>
        <ul id="formErrors" class="form-errors" role="alert" hidden></ul>
        <button type="submit" class="btn btn-primary">Send on WhatsApp</button>
      </form>
    </div></section>
  </main>
  <div id="site-footer"></div>
  <script type="module" src="../assets/js/components.js"></script>
  <script type="module" src="../assets/js/service.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `services/tooth-extraction.html` and `services/dental-implants.html`** using the same template, swapping: title/description, H1 ("Tooth Extraction in Hyderabad" / "Dental Implants in Hyderabad"), the what-it-is and procedure copy, and JSON-LD `name`. Keep `#doctor-cards` so the matching specialist renders.

- [ ] **Step 4: Create `assets/js/service.js`** (service-page bootstrap — renders only this service's doctors + pre-selects form)

```js
import { loadConfig } from './lib/config.js';
import { renderDoctors } from './lib/render.js';
import { initBookingForm } from './lib/form.js';
import { initScrollReveal } from './lib/reveal.js';

const PAGE = {
  'root-canal-treatment.html': 'root-canal-treatment',
  'tooth-extraction.html': 'tooth-extraction',
  'dental-implants.html': 'dental-implants'
};
const sid = PAGE[location.pathname.split('/').pop()] || 'root-canal-treatment';

async function init() {
  initScrollReveal();
  const clinic = await loadConfig();
  const doctors = { ...clinic, doctors: clinic.doctors.filter(d => d.services.includes(sid)) };
  renderDoctors(doctors);
  const svc = clinic.services.find(s => s.id === sid);
  initBookingForm(clinic, svc ? svc.name : '');
}
init();
```

- [ ] **Step 5: Create `assets/css/service.css`** (minimal — extra only)

```css
.service-hero { padding: clamp(48px,8vw,96px) 0; background: linear-gradient(135deg, rgba(94,234,212,0.12), rgba(15,118,110,0.06)); }
.service-hero ol { line-height: 2; }
```

- [ ] **Step 6: Verify** — each service page renders nav/footer, the correct specialist doctor, and the booking form with the service pre-selected; submit opens WhatsApp. (Manual.)

- [ ] **Step 7: Commit**

```bash
git add services/ assets/js/service.js assets/css/service.css assets/js/lib/config.js assets/js/components.js
git commit -m "feat: three service pages with shared layout and medicalprocedure json-ld"
```

---

## Task 15: SEO meta, JSON-LD Dentist, robots.txt, sitemap.xml

**Files:**
- Modify: `index.html` (add full head meta + Dentist JSON-LD)
- Create: `robots.txt`, `sitemap.xml`

- [ ] **Step 1: Replace `index.html` `<head>` meta block with the brief's full SEO meta (title, description, keywords, OG, Twitter, geo, theme-color, favicon, canonical) plus the `Dentist` JSON-LD from `dental-hospital-website-brief.md` §9.**

Add to `<head>`:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smile Care Dental Hospital | Root Canal, Extraction & Implants in Hyderabad</title>
<meta name="description" content="Smile Care Dental Hospital, Hyderabad — expert root canal treatment, painless tooth extraction & dental implants. Book your appointment on WhatsApp today.">
<meta name="keywords" content="dental hospital hyderabad, root canal treatment, tooth extraction, dental implants, painless dentist, best dentist near me, dental clinic banjara hills">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.smilecaredental.com/">
<link rel="icon" type="image/svg+xml" href="assets/img/logo.svg">
<meta name="theme-color" content="#0F766E">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Smile Care Dental Hospital">
<meta property="og:title" content="Smile Care Dental Hospital | Root Canal, Extraction & Implants">
<meta property="og:description" content="Expert dental care in Hyderabad specializing in root canal, extraction & implants. Book on WhatsApp.">
<meta property="og:url" content="https://www.smilecaredental.com/">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="IN-TG">
<meta name="geo.placename" content="Hyderabad">
<meta name="geo.position" content="17.4126;78.4478">
<meta name="ICBM" content="17.4126, 78.4478">
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"Dentist","name":"Smile Care Dental Hospital",
  "url":"https://www.smilecaredental.com/","telephone":"+91-9876543210","priceRange":"₹₹",
  "address":{"@type":"PostalAddress","streetAddress":"Plot No. 12, Road No. 5, Banjara Hills","addressLocality":"Hyderabad","addressRegion":"TG","postalCode":"500034","addressCountry":"IN"},
  "geo":{"@type":"GeoCoordinates","latitude":17.4126,"longitude":78.4478},
  "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"14:00"}],
  "medicalSpecialty":["Endodontics","Oral Surgery","Dental Implants"],
  "sameAs":["https://www.facebook.com/smilecaredental","https://www.instagram.com/smilecaredental"] }
</script>
```

- [ ] **Step 2: Create `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://www.smilecaredental.com/sitemap.xml
```

- [ ] **Step 3: Create `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.smilecaredental.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.smilecaredental.com/services/root-canal-treatment.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.smilecaredental.com/services/tooth-extraction.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.smilecaredental.com/services/dental-implants.html</loc><priority>0.8</priority></url>
</urlset>
```

- [ ] **Step 4: Verify** — view source confirms meta + JSON-LD present; `robots.txt` and `sitemap.xml` reachable. (Manual.)

- [ ] **Step 5: Commit**

```bash
git add index.html robots.txt sitemap.xml
git commit -m "feat: seo meta, dentist json-ld, robots and sitemap"
```

---

## Task 16: PWA manifest & service worker

**Files:**
- Create: `manifest.json`, `sw.js`
- Modify: `index.html` and service pages (register SW, link manifest)

- [ ] **Step 1: Create `manifest.json`**

```json
{
  "name": "Smile Care Dental Hospital",
  "short_name": "Smile Care",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8FAFA",
  "theme_color": "#0F766E",
  "icons": [
    { "src": "assets/img/logo.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

- [ ] **Step 2: Create `sw.js` (cache-first static, network-first HTML)**

```js
const CACHE = 'dental-v1';
const STATIC = ['./', './index.html', './assets/css/styles.css', './assets/js/components.js', './assets/js/main.js', './assets/data/clinic.json', './manifest.json'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || net;
    })
  );
});
```

- [ ] **Step 3: Link manifest + register SW in `index.html` and each service page `<head>`**

```html
<link rel="manifest" href="manifest.json">
```
And before `</body>` in `index.html` (root only; service pages use `../manifest.json` and `../sw.js`):
```html
<script>
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
</script>
```

- [ ] **Step 4: Verify** — DevTools → Application → manifest shows installability; Application → Service Workers registered; toggle Offline → site still loads. (Manual.)

- [ ] **Step 5: Commit**

```bash
git add manifest.json sw.js index.html services/
git commit -m "feat: pwa manifest and offline service worker"
```

---

## Task 17: Phase 1 integration verification

**Files:** none (verification only)

- [ ] **Step 1: Full manual pass** — `npm run serve`, walk the landing page top to bottom: nav scroll, hero CTAs, services → service pages, doctors, technology, testimonials rotation, booking form WhatsApp submit, contact map, footer links, WhatsApp float. Open each service page; confirm correct doctor + pre-selected form. (Manual.)

- [ ] **Step 2: Responsive check** — DevTools at 360 / 768 / 1024 / 1440px: nav collapses, grids stack, no horizontal scroll. (Manual.)

- [ ] **Step 3: Run Lighthouse** — Performance/SEO/Accessibility ≥ 90. Fix any flag the report raises (alt text, contrast, missing labels) inline. (Manual.)

- [ ] **Step 4: Run tests** — `npm test` — all green.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "chore: phase 1 integration fixes"
```

---

# Phase 2 — Section 10 Extras

## Task 18: Dark mode toggle

**Files:**
- Modify: `assets/js/components.js` (add `ThemeToggle` in navbar)
- Modify: `assets/js/lib/config.js` (add `getTheme/setTheme`)
- Modify: `assets/css/styles.css` (toggle button)

**Interfaces:**
- Produces: `initTheme()` applying persisted theme on load; `ThemeToggle` button.

- [ ] **Step 1: Add theme helpers to `config.js`**

```js
export function getTheme() { return localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
export function setTheme(t) {
  localStorage.setItem('theme', t);
  document.documentElement.setAttribute('data-theme', t);
}
export function initTheme() { setTheme(getTheme()); }
```

- [ ] **Step 2: Add a theme toggle button in `renderNavbar` (after Book Now)**

```js
el('button', { class: 'theme-toggle', 'aria-label': 'Toggle dark mode', onclick: () => setTheme(getTheme() === 'dark' ? 'light' : 'dark') }, '🌗')
```

- [ ] **Step 3: Add an inline early theme script in `index.html` and service pages `<head>` (prevents flash)**

```html
<script>document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));</script>
```

- [ ] **Step 4: Add CSS**

```css
.theme-toggle { background: none; border: 0; font-size: 1.2rem; cursor: pointer; color: var(--text); }
```

- [ ] **Step 5: Verify** — toggle switches theme, persists across reload and across pages. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add assets/js/components.js assets/js/lib/config.js assets/css/styles.css index.html services/
git commit -m "feat: dark mode toggle with persistence"
```

---

## Task 19: Multi-language toggle (EN/HI/TE) — TDD

**Files:**
- Create: `assets/js/lib/i18n.js`, `assets/js/i18n/en.json`, `assets/js/i18n/hi.json`, `assets/js/i18n/te.json`, `test/i18n.test.js`
- Modify: `assets/js/components.js` (add `LangToggle`), `assets/js/main.js`, `index.html` (`data-i18n` attrs)

**Interfaces:**
- Produces: `t(key, dict, lang)` → string; `applyI18n(root, dict, lang)`; `initI18n(clinic)`.

- [ ] **Step 1: Write failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t, applyI18n } from '../assets/js/lib/i18n.js';

const dict = { en: { 'hero.title': 'Your Smile' }, hi: { 'hero.title': 'आपकी मुस्कान' } };

test('t returns the key string for the language', () => {
  assert.equal(t('hero.title', dict, 'en'), 'Your Smile');
  assert.equal(t('hero.title', dict, 'hi'), 'आपकी मुस्कान');
});

test('t falls back to the key when missing', () => {
  assert.equal(t('missing', dict, 'en'), 'missing');
});

test('applyI18n sets textContent on data-i18n elements', () => {
  const root = { querySelectorAll: () => [ { dataset: { i18n: 'hero.title' }, set textContent(v){ this._t = v; } } ] };
  applyI18n(root, dict, 'hi');
  assert.equal(root.querySelectorAll()[0]._t, 'आपकी मुस्कान');
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Create `assets/js/lib/i18n.js`**

```js
export function t(key, dict, lang) {
  return (dict[lang] && dict[lang][key]) || key;
}
export function applyI18n(root, dict, lang) {
  root.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n, dict, lang);
  });
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Create dictionaries** — `en.json`, `hi.json`, `te.json` each with the same keys: `nav.home`, `nav.services`, `nav.doctors`, `nav.gallery`, `nav.technology`, `nav.contact`, `cta.book`, `hero.title`, `hero.subtitle`, `cta.call`. Fill `en.json` with current English copy; provide translated values in `hi.json` (Hindi) and `te.json` (Telugu). Example `en.json`:

```json
{ "nav.home":"Home","nav.services":"Services","nav.doctors":"Doctors","nav.gallery":"Gallery","nav.technology":"Technology","nav.contact":"Contact","cta.book":"Book Now","hero.title":"Your Smile, Our Specialty","hero.subtitle":"Painless root canal, extraction & dental implants in Hyderabad.","cta.call":"Call Now" }
```

- [ ] **Step 6: Add `data-i18n` attributes** to the corresponding elements in `index.html` (hero h1/p, nav links). Update `NAV_LINKS` in `components.js` to carry a `data-i18n` key instead of a hard label.

- [ ] **Step 7: Add `initI18n` in `i18n.js` + wire in `main.js`**

```js
import { applyI18n, t } from './i18n.js';
import { el } from './config.js';
const DICT = {};
async function loadDict(lang) { if (!DICT[lang]) DICT[lang] = await (await fetch(`${BASE}assets/js/i18n/${lang}.json`)).json(); return DICT; }
export async function initI18n(clinic, root = document) {
  const lang = localStorage.getItem('lang') || 'en';
  await loadDict(lang);
  applyI18n(root, DICT, lang);
  return lang;
}
```

In `main.js` after config load: `await initI18n(clinic);`

- [ ] **Step 8: Add `LangToggle` to navbar in `components.js`** — a `<select>` with EN/HI/TE that on change sets `localStorage.lang`, reloads (simplest consistent approach), defaulting to stored value.

- [ ] **Step 9: Verify** — switching language updates hero + nav text; persists on reload. (Manual.)

- [ ] **Step 10: Commit**

```bash
git add assets/js/lib/i18n.js assets/js/i18n/ test/i18n.test.js assets/js/components.js assets/js/main.js index.html
git commit -m "feat: multi-language toggle (en/hi/te)"
```

---

## Task 20: Before/After drag slider

**Files:**
- Create: `assets/js/lib/slider.js`
- Modify: `index.html` (add `#gallery`), `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `initBeforeAfter(selector)`.

- [ ] **Step 1: Add `#gallery` to `index.html` (after doctors, before testimonials)**

```html
<section id="gallery" class="alt">
  <div class="container">
    <h2 data-reveal>Before & After</h2>
    <p class="muted" data-reveal>Drag to compare real implant & smile-makeover cases.</p>
    <div class="ba-grid" data-reveal>
      <div class="ba-slider" data-ba>
        <img class="ba-after" src="assets/img/before-after-1-after.svg" alt="After implant treatment">
        <img class="ba-before" src="assets/img/before-after-1-before.svg" alt="Before implant treatment">
        <input type="range" min="0" max="100" value="50" aria-label="Before/after comparison slider">
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create placeholder before/after SVGs** — `assets/img/before-after-1-before.svg` and `-after.svg` (two labeled placeholder rectangles; after uses mint fill, before uses muted gray). Keep them the same dimensions (600×400).

- [ ] **Step 3: Create `assets/js/lib/slider.js`**

```js
export function initBeforeAfter(selector = '[data-ba]') {
  document.querySelectorAll(selector).forEach(slider => {
    const before = slider.querySelector('.ba-before');
    const range = slider.querySelector('input[type=range]');
    if (!before || !range) return;
    const update = () => { before.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`; };
    range.addEventListener('input', update);
    update();
  });
}
```

- [ ] **Step 4: Call `initBeforeAfter()` in `main.js` init.**

- [ ] **Step 5: Add CSS**

```css
.ba-grid { display: grid; gap: 24px; }
@media (min-width:700px){ .ba-grid { grid-template-columns: repeat(2,1fr); } }
.ba-slider { position: relative; border-radius: var(--radius); overflow: hidden; aspect-ratio: 3/2; user-select: none; }
.ba-slider img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ba-after { z-index: 1; }
.ba-before { z-index: 2; }
.ba-slider input[type=range] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; z-index: 3; margin: 0; }
.ba-slider::after { content: '◀ ▶'; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: #fff; pointer-events: none; }
```

- [ ] **Step 6: Verify** — drag reveals before/after; keyboard arrow keys on the range input also move it. (Manual.)

- [ ] **Step 7: Commit**

```bash
git add assets/js/lib/slider.js index.html assets/js/main.js assets/css/styles.css assets/img/before-after-*.svg
git commit -m "feat: before/after drag slider gallery"
```

---

## Task 21: FAQ accordion

**Files:**
- Modify: `index.html` (add `#faq`), `assets/js/lib/render.js` (add `renderFAQ`), `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `renderFAQ(clinic, selector)`.

- [ ] **Step 1: Add `#faq` to `index.html` (after gallery)**

```html
<section id="faq">
  <div class="container">
    <h2 data-reveal>Frequently Asked Questions</h2>
    <div id="faq-list" data-reveal></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderFAQ` to `render.js`**

```js
export function renderFAQ(clinic, selector = '#faq-list') {
  const host = document.querySelector(selector);
  if (!host) return;
  host.replaceChildren(...clinic.faqs.map(f =>
    el('details', { class: 'faq' },
      el('summary', {}, f.q),
      el('p', { class: 'muted' }, f.a)
    )
  ));
}
```

- [ ] **Step 3: Call `renderFAQ(clinic)` in `main.js` init.**

- [ ] **Step 4: Add CSS**

```css
.faq { background: var(--surface); border-radius: var(--radius-sm); box-shadow: var(--shadow); margin-bottom: 12px; padding: 0 20px; }
.faq summary { padding: 18px 0; cursor: pointer; font-weight: 600; list-style: none; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: '+'; float: right; color: var(--teal); }
.faq[open] summary::after { content: '−'; }
.faq p { padding-bottom: 18px; margin: 0; }
```

- [ ] **Step 5: Verify** — accordions expand/collapse; keyboard-operable. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/lib/render.js assets/js/main.js assets/css/styles.css
git commit -m "feat: accessible faq accordion"
```

---

## Task 22: Cost estimator (TDD)

**Files:**
- Create: `assets/js/lib/estimator.js`, `test/estimator.test.js`
- Modify: `index.html` (add `#estimator`), `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `estimateCost(serviceId, complexity, pricing)` → `{min, max, currency, label}`; `initEstimator(clinic)`.

- [ ] **Step 1: Write failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateCost } from '../assets/js/lib/estimator.js';

const pricing = {
  'root-canal-treatment': { min: 3500, max: 8000, currency: '₹' },
  'dental-implants': { min: 20000, max: 45000, currency: '₹' }
};

test('low complexity returns min end', () => {
  const r = estimateCost('root-canal-treatment', 'low', pricing);
  assert.equal(r.min, 3500);
  assert.ok(r.max <= 5750); // nearer min
});

test('high complexity returns max end', () => {
  const r = estimateCost('dental-implants', 'high', pricing);
  assert.ok(r.min >= 32500); // nearer max
  assert.equal(r.max, 45000);
});

test('unknown service returns null', () => {
  assert.equal(estimateCost('nope', 'low', pricing), null);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Create `assets/js/lib/estimator.js`**

```js
export function estimateCost(serviceId, complexity, pricing) {
  const p = pricing[serviceId];
  if (!p) return null;
  const span = p.max - p.min;
  const frac = { low: 0.25, medium: 0.5, high: 0.75 }[complexity] ?? 0.5;
  const mid = p.min + span * frac;
  return {
    min: Math.round(p.min + (mid - p.min) * 0.5),
    max: Math.round(mid + (p.max - mid) * 0.5),
    currency: p.currency,
    label: `${p.currency}${Math.round(p.min + (mid - p.min) * 0.5).toLocaleString()} – ${p.currency}${Math.round(mid + (p.max - mid) * 0.5).toLocaleString()}`
  };
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Add `#estimator` UI to `index.html` and `initEstimator` to `estimator.js`**

```html
<section id="estimator" class="alt">
  <div class="container estimator-grid">
    <div><h2 data-reveal>Approximate Cost Estimator</h2><p class="muted" data-reveal>Indicative ranges only — confirmed on consultation.</p></div>
    <div data-reveal>
      <div class="field"><label for="est-service">Service</label><select id="est-service"></select></div>
      <div class="field"><label for="est-complexity">Complexity</label><select id="est-complexity"><option value="low">Simple</option><option value="medium" selected>Moderate</option><option value="high">Complex</option></select></div>
      <p id="est-result" class="est-result" aria-live="polite">Select a service.</p>
      <p id="est-factors" class="muted"></p>
    </div>
  </div>
</section>
```

```js
import { estimateCost } from './estimator.js';
export function initEstimator(clinic) {
  const svcSel = document.getElementById('est-service');
  const cmpSel = document.getElementById('est-complexity');
  const result = document.getElementById('est-result');
  const factors = document.getElementById('est-factors');
  if (!svcSel || !result) return;
  clinic.services.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; svcSel.append(o); });
  function update() {
    const r = estimateCost(svcSel.value, cmpSel.value, clinic.pricing);
    if (!r) { result.textContent = 'Select a service.'; factors.textContent = ''; return; }
    result.textContent = `Approx. ${r.label}`;
    factors.textContent = 'Factors: ' + (clinic.pricing[svcSel.value].factors || []).join(', ');
  }
  svcSel.addEventListener('change', update);
  cmpSel.addEventListener('change', update);
  update();
}
```

Call `initEstimator(clinic)` in `main.js` init.

- [ ] **Step 6: Add CSS**

```css
.estimator-grid { display: grid; gap: 32px; }
@media (min-width:820px){ .estimator-grid { grid-template-columns: 0.8fr 1.2fr; } }
.est-result { font-family: var(--font-head); font-size: 1.4rem; color: var(--teal); }
```

- [ ] **Step 7: Verify** — changing service/complexity updates the range and factors. (Manual.)

- [ ] **Step 8: Commit**

```bash
git add assets/js/lib/estimator.js test/estimator.test.js index.html assets/js/main.js assets/css/styles.css
git commit -m "feat: treatment cost estimator with tests"
```

---

## Task 23: Emergency banner

**Files:**
- Modify: `assets/js/components.js` (add `renderEmergencyBanner`), `assets/css/styles.css`

**Interfaces:**
- Produces: `renderEmergencyBanner(clinic)` (no-op if `flags.emergencyBanner` false).

- [ ] **Step 1: Add to `components.js` and call in `boot` (only if `clinic.flags.emergencyBanner`)**

```js
export function renderEmergencyBanner(clinic) {
  if (!clinic.flags.emergencyBanner) return;
  const banner = el('div', { class: 'emergency-banner', role: 'alert' },
    '🚑 Emergency Dental Care — 24/7 helpline: ',
    el('a', { href: `tel:${clinic.clinic.phone}` }, clinic.clinic.phoneDisplay)
  );
  document.body.prepend(banner);
}
```

- [ ] **Step 2: Add CSS**

```css
.emergency-banner { background: var(--coral); color: #fff; text-align: center; padding: 10px; font-weight: 600; }
.emergency-banner a { color: #fff; text-decoration: underline; }
```

- [ ] **Step 3: Verify** — banner shows at top with tappable helpline; disabling the flag in `clinic.json` hides it. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add assets/js/components.js assets/css/styles.css
git commit -m "feat: emergency dental care banner"
```

---

## Task 24: Sticky mobile CTA bar

**Files:**
- Modify: `assets/js/components.js` (add `renderMobileCTA`), `assets/css/styles.css`

**Interfaces:**
- Produces: `renderMobileCTA(clinic)` (mobile only).

- [ ] **Step 1: Add to `components.js`, call in `boot`**

```js
export function renderMobileCTA(clinic) {
  if (document.getElementById('mobile-cta')) return;
  const bar = el('div', { class: 'mobile-cta', id: 'mobile-cta' },
    el('a', { href: `tel:${clinic.clinic.phone}`, class: 'btn btn-outline' }, 'Call'),
    el('a', { href: 'index.html#appointment', class: 'btn btn-primary' }, 'Book Now')
  );
  document.body.append(bar);
}
```

- [ ] **Step 2: Add CSS (mobile only, above WhatsApp float)**

```css
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; gap: 12px; padding: 12px; background: var(--surface); box-shadow: 0 -6px 20px rgba(0,0,0,0.12); z-index: 998; }
.mobile-cta .btn { flex: 1; justify-content: center; }
@media (max-width: 760px) { .mobile-cta { display: flex; } .whatsapp-float { bottom: 80px; } body { padding-bottom: 64px; } }
```

- [ ] **Step 3: Verify** — on mobile width, sticky Call/Book bar appears above the float. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add assets/js/components.js assets/css/styles.css
git commit -m "feat: sticky mobile cta bar"
```

---

## Task 25: Blog (index + sample posts + Article JSON-LD)

**Files:**
- Create: `blog/index.html`, `blog/posts/brushing-tips.html`, `blog/posts/after-implant-care.html`
- Modify: `index.html` (add blog teaser), `assets/js/main.js` optional, `sitemap.xml`

- [ ] **Step 1: Create `blog/index.html`** (uses `${BASE}` relative `../` assets, shared nav/footer via `../assets/js/components.js`, lists posts)

```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Oral Health Tips Blog | Smile Care Dental Hospital</title>
<meta name="description" content="Dental health tips from Smile Care Dental Hospital, Hyderabad.">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/styles.css">
<link rel="stylesheet" href="../assets/css/service.css">
</head><body>
<div id="site-nav"></div>
<main><section><div class="container">
<h1>Oral Health Tips</h1>
<a class="card" href="posts/brushing-tips.html" style="display:block"><h3>5 Brushing Mistakes to Avoid</h3><p class="muted">Simple fixes for a healthier smile.</p></a>
<a class="card" href="posts/after-implant-care.html" style="display:block"><h3>Caring for Your Dental Implant</h3><p class="muted">What to expect after placement.</p></a>
</div></section></main>
<div id="site-footer"></div>
<script type="module" src="../assets/js/components.js"></script>
</body></html>
```

- [ ] **Step 2: Create each post** (`blog/posts/brushing-tips.html` and `blog/posts/after-implant-care.html`) with: a title/H1, 3–4 short paragraphs of genuine oral-health content, `Article` JSON-LD, and a back-link to `../index.html`. Use the same asset paths (`../../assets/...`) and load `../../assets/js/components.js`.

Example `Article` JSON-LD in a post `<head>`:
```html
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"Article","headline":"5 Brushing Mistakes to Avoid",
  "author":{"@type":"Organization","name":"Smile Care Dental Hospital"},
  "publisher":{"@type":"Organization","name":"Smile Care Dental Hospital"},
  "url":"https://www.smilecaredental.com/blog/posts/brushing-tips.html" }
</script>
```

- [ ] **Step 3: Add a blog teaser to `index.html`** (after FAQ, before appointment) linking the 2 posts.

- [ ] **Step 4: Add blog URLs to `sitemap.xml`.**

- [ ] **Step 5: Verify** — teaser links work; blog index + posts render with shared chrome. (Manual.)

- [ ] **Step 6: Commit**

```bash
git add blog/ index.html sitemap.xml
git commit -m "feat: blog with article json-ld"
```

---

## Task 26: Newsletter signup (demo toast)

**Files:**
- Modify: `index.html` (add `#newsletter` after appointment), `assets/js/lib/newsletter.js`, `assets/js/main.js`, `assets/css/styles.css`

**Interfaces:**
- Produces: `initNewsletter()` (demo, no backend).

- [ ] **Step 1: Add `#newsletter` to `index.html`**

```html
<section id="newsletter" class="alt">
  <div class="container newsletter">
    <h2 data-reveal>Get Dental Health Tips</h2>
    <form id="newsletterForm" data-reveal>
      <input type="email" id="nl-email" placeholder="you@example.com" aria-label="Email address" required>
      <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
    <p id="nl-toast" class="nl-toast" role="status" hidden>Thanks! Demo signup — no email sent.</p>
  </div>
</section>
```

- [ ] **Step 2: Create `assets/js/lib/newsletter.js`**

```js
export function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const toast = document.getElementById('nl-toast');
    if (toast) { toast.hidden = false; }
    form.reset();
  });
}
```

- [ ] **Step 3: Call `initNewsletter()` in `main.js` init. Add CSS:**

```css
.newsletter { text-align: center; }
.newsletter form { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; max-width: 480px; margin: 0 auto; }
.newsletter input { flex: 1; min-width: 200px; }
.nl-toast { color: var(--teal); font-weight: 600; margin-top: 16px; }
```

- [ ] **Step 4: Verify** — submit shows toast, clears field. (Manual.)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/lib/newsletter.js assets/js/main.js assets/css/styles.css
git commit -m "feat: newsletter signup demo toast"
```

---

## Task 27: Live chat (Tawk.to placeholder, config flag)

**Files:**
- Modify: `assets/js/components.js` (add `renderLiveChat`)

**Interfaces:**
- Produces: `renderLiveChat(clinic)` (injects snippet only if `flags.liveChat`).

- [ ] **Step 1: Add to `components.js`, call in `boot` only if flag set**

```js
export function renderLiveChat(clinic) {
  if (!clinic.flags.liveChat || !clinic.flags.tawkId) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://embed.tawk.to/${clinic.flags.tawkId}/default`;
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  document.body.append(s);
}
```

(Add a `"tawkId": ""` field to `clinic.json.flags`.)

- [ ] **Step 2: Verify** — flag false → no script; set flag true + a dummy id → script tag injected (won't load a real widget without a valid id, which is the intended placeholder behavior). (Manual.)

- [ ] **Step 3: Commit**

```bash
git add assets/js/components.js assets/data/clinic.json
git commit -m "feat: live chat placeholder (config flag)"
```

---

## Task 28: Video testimonials / meet-the-doctor

**Files:**
- Modify: `index.html` (add video inside `#testimonials`)

- [ ] **Step 1: Add a video block to `#testimonials` in `index.html`**

```html
<div class="video-block" data-reveal>
  <h3>Meet Dr. Priya Sharma</h3>
  <video controls preload="none" poster="assets/img/doctors/dr-priya-sharma.svg" width="480">
    <source src="assets/video/meet-the-doctor.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
  <p class="muted">Placeholder video — replace `assets/video/meet-the-doctor.mp4` with a real intro before launch.</p>
</div>
```

- [ ] **Step 2: Add CSS**

```css
.video-block { text-align: center; margin-top: 40px; }
.video-block video { max-width: 480px; width: 100%; border-radius: var(--radius); box-shadow: var(--shadow); }
```

- [ ] **Step 3: Create `assets/video/.gitkeep`** (video file added at deploy) and note in README that the path is a placeholder.

- [ ] **Step 4: Verify** — video element renders with poster; controls present (no real file yet, expected). (Manual.)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/styles.css assets/video/.gitkeep
git commit -m "feat: video testimonials / meet-the-doctor placeholder"
```

---

## Task 29: Analytics (GA4 placeholder, config flag)

**Files:**
- Modify: `assets/js/components.js` (add `renderAnalytics`), `index.html` + service pages (or load globally)

**Interfaces:**
- Produces: `renderAnalytics(clinic)`.

- [ ] **Step 1: Add to `components.js`, call in `boot` only if `flags.analytics.enabled`**

```js
export function renderAnalytics(clinic) {
  const a = clinic.flags.analytics;
  if (!a || !a.enabled || !a.ga4Id) return;
  const s1 = document.createElement('script');
  s1.async = true; s1.src = `https://www.googletagmanager.com/gtag/js?id=${a.ga4Id}`;
  const s2 = document.createElement('script');
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${a.ga4Id}');`;
  document.head.append(s1, s2);
}
```

- [ ] **Step 2: Verify** — flag false → no GA scripts; enable + set `ga4Id` → gtag scripts injected. (Manual.)

- [ ] **Step 3: Commit**

```bash
git add assets/js/components.js
git commit -m "feat: analytics ga4 placeholder (config flag)"
```

---

## Task 30: Google Reviews widget placeholder (config flag)

**Files:**
- Modify: `index.html` (add `#reviews` slot), `assets/js/components.js` (add `renderReviews`)

**Interfaces:**
- Produces: `renderReviews(clinic)` (injects third-party widget script if `flags.reviews`).

- [ ] **Step 1: Add `#reviews` slot to `index.html` trust area (after trust bar)**

```html
<section id="reviews"><div class="container"><div id="reviews-widget" data-reveal></div></div></section>
```

- [ ] **Step 2: Add `renderReviews` to `components.js`, call in `boot` only if flag set**

```js
export function renderReviews(clinic) {
  if (!clinic.flags.reviews) return;
  const host = document.getElementById('reviews-widget');
  if (!host) return;
  host.innerHTML = '<p class="muted" style="text-align:center">Google Reviews widget — paste your provider embed here.</p>';
  // When ready, inject the third-party review widget script here.
}
```

- [ ] **Step 3: Verify** — flag false → empty section; flag true → placeholder copy. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add index.html assets/js/components.js
git commit -m "feat: google reviews widget placeholder (config flag)"
```

---

## Task 31: Care PDF download on service pages

**Files:**
- Create: `assets/docs/pre-treatment-care.pdf` placeholder, `assets/docs/.gitkeep`
- Modify: service pages (add download link), `assets/css/service.css`

- [ ] **Step 1: Add a download link to each service page (after the procedure section)**

```html
<p class="muted"><a href="../assets/docs/pre-treatment-care.pdf" download>⬇ Download pre-treatment care guide (PDF)</a></p>
```

- [ ] **Step 2: Create `assets/docs/.gitkeep` and note in README that `pre-treatment-care.pdf` is a placeholder to add before launch.**

- [ ] **Step 3: Verify** — link present and points to the (placeholder) file. (Manual.)

- [ ] **Step 4: Commit**

```bash
git add services/ assets/docs/.gitkeep
git commit -m "feat: care pdf download on service pages"
```

---

## Task 32: Final integration verification & deploy-readiness

**Files:** none (verification + a `README.md`)

- [ ] **Step 1: Full site walk** — every section present and functional; nav/footer/chrome consistent across `index.html`, 3 service pages, blog index, and 2 blog posts. (Manual.)

- [ ] **Step 2: Extras checklist** — dark mode persists; language toggle persists; before/after slider; FAQ accordion; cost estimator; emergency banner; mobile CTA; newsletter toast; video poster; flags correctly gate live chat/analytics/reviews. (Manual.)

- [ ] **Step 3: Responsive + a11y** — 360/768/1024/1440px; keyboard through nav, carousel, slider, accordion, form; contrast in both themes. (Manual.)

- [ ] **Step 4: PWA** — manifest installable; offline loads via service worker. (Manual.)

- [ ] **Step 5: Lighthouse** — Performance/SEO/Accessibility ≥ 90 on landing + a service page; fix flagged issues inline. (Manual.)

- [ ] **Step 6: Tests** — `npm test` all green.

- [ ] **Step 7: Create `README.md`** — document: zero-build run (`npm run serve`), test run (`npm test`), single-file config swap (`assets/data/clinic.json`), placeholder-replacement checklist (doctors, equipment, video, PDF, GA4/Tawk IDs), and deploy steps for static hosts.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: final integration verification and readme"
```

---

## Spec Coverage Notes

- Spec §3 file structure → Tasks 1–2, 14, 25. `clinic.json` single source → Task 1.
- Spec §4 doctor data model → Task 10 (cards) + Task 1 (config) + Task 14 (per-service).
- Spec §5 components & data flow → Tasks 4–6, 8–13, 18–19 (components.js + lib/*).
- Spec §6 landing order → Tasks 7–13, 18, 20–21, 22, 25, 26, 30, 23 (extras). Service pages → Task 14. Blog → Task 25.
- Spec §7 theming (incl. dark mode) → Task 2 (tokens) + Task 18 (toggle).
- Spec §8 accessibility → applied across tasks; verified Task 17/32.
- Spec §9 SEO → Tasks 14 (MedicalProcedure), 15 (Dentist/meta/robots/sitemap), 25 (Article).
- Spec §10 PWA → Task 16.
- Spec §11 testing → `node --test` per pure-fn tasks (3, 12, 19, 22) + Lighthouse/manual in 17, 32.
- Extras table (§6) → Tasks 18–31 inclusive.