# Dental Hospital Website — Design Spec

**Date:** 2026-08-04
**Source brief:** `dental-hospital-website-brief.md`
**Stack:** HTML5 + CSS3 + Vanilla JavaScript (no framework, no build step)
**Approach:** A — Zero-build, vanilla-JS component includes

## 1. Overview

A modern, responsive dental hospital website for a clinic specializing in **Root Canal Treatment**, **Tooth Extraction**, and **Dental Implants**. Hybrid structure: one smooth-scroll landing page plus dedicated keyword-rich service pages and a blog. v1 ships with placeholder "Smile Care Dental Hospital" content, structured so real details are a single-file edit later.

All optional extras from the brief's Section 10 are included in v1. The implementation plan will phase them: core site first, then extras layered on.

## 2. Decisions

| Decision | Choice |
|---|---|
| Content | Placeholder/demo ("Smile Care Dental Hospital") |
| Structure | Hybrid — landing page + 3 service pages + blog |
| Appointment form submit | WhatsApp click-to-chat only (no backend) |
| Tooling | Zero-build, vanilla JS component includes (Approach A) |
| Extras scope | Full Section 10 set (see §6) |

## 3. Architecture & File Structure

Zero-build static site. Vanilla-JS components render shared chrome into placeholder elements so navbar/footer/floats live in one file. CSS variables drive theming (incl. dark mode); a JSON i18n dictionary drives the language toggle; IntersectionObserver drives scroll reveals. Each page is standalone HTML that pulls in shared CSS/JS.

```
dental-site/
├─ index.html                # landing page (all sections, smooth-scroll nav)
├─ services/
│  ├─ root-canal-treatment.html
│  ├─ tooth-extraction.html
│  └─ dental-implants.html    # keyword-rich URLs per brief's SEO tips
├─ blog/
│  ├─ index.html             # blog listing
│  └─ posts/*.html           # 2–3 sample oral-health posts (static)
├─ assets/
│  ├─ css/styles.css         # single stylesheet, CSS-var theme + dark mode
│  ├─ css/service.css        # page-specific overrides only
│  ├─ js/components.js       # renders navbar, footer, whatsapp float, mobile CTA
│  ├─ js/main.js             # init: observers, carousel, sliders, accordion, estimator
│  ├─ js/i18n.js             # language toggle + dictionary loader
│  ├─ js/i18n/en.json | hi.json | te.json
│  ├─ js/estimator.js        # treatment cost calculator
│  ├─ icons/                 # inline SVG equipment/service icons
│  ├─ img/                   # clinic/doctor/before-after placeholders
│  └─ data/clinic.json       # single source: name, phone, address, hours, doctors, services
├─ manifest.json             # PWA manifest
├─ sw.js                     # service worker (cache-first static assets)
├─ robots.txt
└─ sitemap.xml
```

**Single source of truth:** `assets/data/clinic.json` holds all placeholder clinic content — name, phone, address, hours, doctors, services, equipment, testimonials, FAQs, pricing ranges, and config flags for optional embeds. Components and pages read it at runtime, so swapping real details later is a single-file edit.

## 4. Data Model — Doctors

Doctors are a first-class structured array in `clinic.json`. Specialization is a dedicated field (not buried in bio) so it can drive rendering, filtering, and per-service doctor assignment. v1 uses clearly-labeled placeholder portraits; per the brief's warning, no AI/fake photos are presented as real clinic staff — placeholders are marked so they're swapped for real doctor photos before launch. The `photo` field is the single swap point.

```jsonc
// assets/data/clinic.json → "doctors" array
"doctors": [
  {
    "id": "dr-priya-sharma",
    "name": "Dr. Priya Sharma",
    "photo": "assets/img/doctors/dr-priya-sharma.jpg",   // placeholder portrait
    "qualifications": "BDS, MDS (Endodontics)",
    "specialization": "Root Canal Specialist",
    "experienceYears": 12,
    "bio": "Single-visit rotary endodontics & pain-free RCT.",
    "languages": ["English", "Hindi", "Telugu"],
    "rating": 4.9
  }
  // …more doctors
]
```

Rendered as a card by `components.js`:

```html
<article class="doctor-card reveal" data-doctor="dr-priya-sharma">
  <img src="…" alt="Dr. Priya Sharma, Root Canal Specialist" loading="lazy">
  <span class="badge">${experienceYears}+ yrs</span>
  <h3>${name}</h3>
  <p class="spec">${specialization}</p>
  <p class="qual">${qualifications}</p>
</article>
```

## 5. Components & Data Flow

Shared chrome is rendered by `components.js` into placeholder elements on every page; page-specific content lives in HTML or is generated from `clinic.json` at runtime.

**Shared components (`components.js`):**

| Component | Renders into | Notes |
|---|---|---|
| Navbar | `#site-nav` | Logo, links (Home/Services/Doctors/Gallery/Technology/Contact), "Book Now", glassmorphism-on-scroll, mobile hamburger |
| Footer | `#site-footer` | Quick links, social icons, address, hours, copyright |
| WhatsAppFloat | `#whatsapp-float` | Pulsing button, `wa.me` link pre-filled from `clinic.json` phone |
| MobileCTA | `#mobile-cta` | Sticky bottom bar (Call / Book) on mobile only |
| EmergencyBanner | `#emergency-banner` | Helpline number banner |
| LiveChat | `#live-chat` | Tawk.to snippet placeholder (toggle via config flag) |
| ThemeToggle | `#theme-toggle` | Dark mode switch, persisted in `localStorage` |
| LangToggle | `#lang-toggle` | EN/HI/TE switch, persisted in `localStorage` |

**Page-specific modules (`main.js` + friends), initialized on `DOMContentLoaded` only if their target exists:**

- **ScrollReveal** — IntersectionObserver adds `.reveal-in` to `[data-reveal]` elements.
- **TestimonialCarousel** — auto-rotating + swipe, from `clinic.json.testimonials`.
- **BeforeAfterSlider** — drag-comparison on `.ba-slider` pairs (gallery/implant cases).
- **FAQAccordion** — accessible `<details>`-based, from `clinic.json.faqs`.
- **CostEstimator** — picks service + options → shows approximate range from `clinic.json.pricing`.
- **BookingForm** — validates inline, then builds `wa.me` URL (`encodeURIComponent`) and opens it.
- **NewsletterForm** — demo toast on submit (no backend).
- **GoogleReviewsWidget** — third-party embed placeholder, toggled by config flag.

**Data flow (one direction, no framework state):**

```
clinic.json ──load──▶ components.js renders shared chrome + service/doctor/tech/FAQ/testimonial cards
            └─▶ i18n.js applies [data-i18n] strings from en/hi/te.json
            └─▶ user interaction (form/theme/lang) ──▶ localStorage + wa.me / toast
```

Rules: components are idempotent (re-render safe), read config once on load, and each module no-ops if its DOM target is absent — so the same `main.js` runs safely on landing, service, and blog pages without per-page branching.

## 6. Content Layout & Extras Wiring

### Landing page (`index.html`) section order

1. Navbar (sticky, glassmorphism-on-scroll)
2. Hero — headline, dual CTA (Book Appointment / Call Now), 3D tooth SVG illustration
3. Trust Bar — years, patients treated, certifications, rating
4. Emergency Banner — helpline callout *(extra)*
5. Services (Specializations) — 3 cards → link to each service page
6. Why Choose Us — modern equipment, sterilization, painless, EMI/insurance
7. Our Technology — equipment grid from `clinic.json.equipment` (12 cards per brief)
8. Doctors — cards from `clinic.json.doctors` (specialization, photo, experience badge)
9. Before/After Gallery — drag-slider + clinic interior photos *(extra: before/after slider)*
10. Cost Estimator — interactive approximate-range calculator *(extra)*
11. Testimonials — auto-rotating carousel
12. FAQ Accordion — RCT/extraction/implants questions *(extra)*
13. Blog Teaser — 3 latest posts → `/blog/` *(extra)*
14. Appointment Booking Form — WhatsApp submit
15. Newsletter Signup — demo toast *(extra)*
16. Contact & Map — address, phone, hours, Google Maps iframe, Get Directions
17. Footer

### Service pages (`/services/*.html`)

Shared layout: hero (keyword H1, e.g. "Root Canal Treatment in Hyderabad"), what-it-is, procedure steps, why-choose-us-for-this, the specific doctor(s) for this treatment, before/after slider if relevant, FAQ subset, and the booking form (service pre-selected). Each carries its own SEO meta + JSON-LD `MedicalProcedure`.

### Blog (`/blog/`)

Listing index + 2–3 static sample posts (oral-health tips), each with its own meta for SEO.

### Extras → location & implementation

| Extra | Location | Implementation |
|---|---|---|
| Before/after slider | Gallery + service pages | vanilla drag-compare component |
| Emergency banner | Landing (top of content) | config-driven banner |
| Insurance/EMI | Why Choose Us | sub-cards in that section |
| Dark mode | Global toggle | CSS vars + `localStorage` |
| Sticky mobile CTA | Global (mobile only) | `MobileCTA` component |
| Cost estimator | Landing (own section) | `estimator.js` + `clinic.json.pricing` |
| Multi-language (EN/HI/TE) | Global toggle | `i18n.js` + JSON dictionaries |
| Blog | `/blog/` | static HTML posts |
| Newsletter | Landing (post-form) | demo toast |
| Live chat | Global | Tawk.to embed (flag) |
| Video testimonials | Testimonials section | embedded `<video>`/YouTube placeholder + "Meet the Doctor" |
| PWA | Global | `manifest.json` + `sw.js` |
| Analytics | Global | GA4 tag (config-flag, ID in `clinic.json`) |
| Care PDF | Service pages | downloadable placeholder PDF link |
| Google Reviews widget | Trust Bar / Testimonials | third-party embed placeholder (flag) |

### Labor & honesty notes

- Most labor-intensive extras: i18n dictionaries (3 languages) and the blog (hand-written static posts).
- Flagged config extras (analytics, live chat, reviews, video) ship as wired placeholders — the snippet/ID slot is ready, swap in real IDs at deploy.
- All AI/placeholder imagery is clearly labeled, per the brief's warning; not presented as real clinic/doctors/equipment.

## 7. Theming

CSS custom properties in `:root` mapped 1:1 to the brief's palette: `--teal #0F766E`, `--mint #5EEAD4`, `--coral #FF6B5B`, `--bg #F8FAFA`, `--surface #FFFFFF`, `--text #1E293B`, `--muted #64748B`, `--whatsapp #25D366`. Fonts: Sora (headings) + Inter (body) via Google Fonts. Dark mode overrides those variables under `[data-theme="dark"]`, toggled by `ThemeToggle` and persisted in `localStorage`. Soft gradients (teal→mint), 16–24px radii, layered teal-tinted shadows (`0 10px 30px rgba(15,118,110,0.08)`), 8pt spacing grid — all token-driven so nothing is hard-coded.

## 8. Accessibility (WCAG AA)

Semantic landmarks (`header/nav/main/section/footer`), `alt` on every image, ARIA labels on float/toggles/carousel/slider, keyboard-operable accordion & before/after slider, focus-visible styles, color-contrast checked against both light and dark themes, `prefers-reduced-motion` disables pulse/scroll-reveal animations.

## 9. SEO

Every page: unique `<title>`/description, Open Graph + Twitter cards, geo tags, canonical. `index.html` carries the `Dentist` JSON-LD from the brief; service pages add `MedicalProcedure` JSON-LD; blog posts add `Article` JSON-LD. `robots.txt` + `sitemap.xml` listing all pages. Descriptive `alt` text, keyword H1s on service pages.

## 10. PWA

`manifest.json` (name, icons, theme color `#0F766E`, display standalone, start URL) + `sw.js` cache-first for static assets (CSS/JS/images), network-first for HTML, offline fallback page. Installable, offline-friendly per the brief.

## 11. Testing & Verification

No test framework (vanilla JS). Verification approach:

- **Lighthouse** pass target: 90+ on Performance/SEO/Accessibility (brief's goal), run against a local static server.
- **Cross-browser smoke:** Chrome, Edge, Firefox, Safari; responsive at 360 / 768 / 1024 / 1440px.
- **Manual checklist:** all nav anchors scroll correctly; every form validates inline then opens WhatsApp with correct pre-filled text; theme/lang toggles persist across pages and reload; before/after slider & carousel work with keyboard and touch; service pages load with the right service pre-selected in the form; service worker caches and the site loads offline.
- **Build/deploy:** none — deploy the folder as-is to any static host (Netlify/Vercel/GitHub Pages). No `npm install` required to view the site.