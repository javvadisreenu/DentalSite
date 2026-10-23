# Smile Care Dental Hospital — Static Website

A modern, responsive, **zero-build** static website for a dental hospital
specializing in **Root Canal Treatment**, **Tooth Extraction**, and
**Dental Implants**. Built with plain **HTML5 + CSS3 + vanilla JavaScript
(ES modules)** — no framework, no build step, no jQuery, no bundler.

> Brand details (name, phone, address, photos) are **placeholders** that
> read from a single config file. Swap them for your real clinic before
> launch — see [Pre-deploy checklist](#pre-deploy-placeholder-checklist).

## Structure

Hybrid: a rich landing page + three dedicated service pages + a blog.

```
.
├── index.html                      # Landing page (all sections)
├── services/
│   ├── root-canal-treatment.html   # Service page (MedicalProcedure JSON-LD)
│   ├── tooth-extraction.html
│   └── dental-implants.html
├── blog/
│   ├── index.html                  # Blog index
│   └── posts/
│       ├── brushing-tips.html      # Article JSON-LD
│       ├── after-implant-care.html
│       ├── root-canal-vs-extraction.html
│       └── wisdom-tooth-pain.html
├── assets/
│   ├── css/   styles.css, service.css
│   ├── js/    components.js (shared chrome + boot), main.js, service.js,
│   │          lib/{config,render,whatsapp,form,i18n,estimator,slider,
│   │          carousel,reveal,newsletter}.js, i18n/{en,hi,te}.json
│   ├── img/   real .jpg/.png clinic photos (doctors, equipment,
│   │          before/after, logos) + hero-tooth.svg, whatsapp.svg
│   ├── data/  clinic.json          # single source of truth
│   ├── docs/  .gitkeep (PDF placeholder)
│   └── video/ .gitkeep (video placeholder)
├── test/      whatsapp, form, i18n, estimator, sanity (node --test)
├── manifest.json  robots.txt  sitemap.xml  sw.js
└── package.json
```

## Quick start (zero-build)

No install required to view the site.

```bash
# Option 1 — local static server (recommended):
npm run serve          # runs: npx --yes serve .

# Note: opening index.html directly (file://) does NOT work — browsers
# block ES modules and fetch() there, so always use a local server.
```

## Tests

```bash
npm test               # runs: node --test
```

Runs pure-function tests across `whatsapp`, `form`, `i18n`, `estimator`,
`base`, and `sanity` (config/asset integrity). Requires **Node 18+**.
All tests are side-effect-free and run without a browser.

## Single-source config swap

Edit **`assets/data/clinic.json`** to change everything the site displays:

- Clinic name, phone, email, address, geo, hours, social links, canonical URL
- `openingHours` (structured, 0 = Sunday) + `timezone` — drive the live
  "Open now / Closed" badge and the booking form's time slots
- `consultationFee`, `slotMinutes`
- Services: `core: true` = the 3 main specializations (large cards);
  `core: false` = "Also available" treatments
- Doctors (name, photo, qualifications, specialization, bio, languages, rating)
- Services (name, blurb, page link)
- Equipment (name, benefit, image)
- Testimonials, FAQs, pricing ranges
- **Config flags** that gate optional features:

| Flag | Field | Effect when off |
|------|-------|-----------------|
| `flags.liveChat` | `flags.tawkId` | Tawk.to embed script is not injected |
| `flags.analytics` | `{ enabled, ga4Id }` | GA4 gtag scripts are not injected |
| `flags.reviews` | — | `#reviews-widget` stays empty (no widget) |
| `flags.emergencyBanner` | — | No 24/7 emergency banner prepended |
| `flags.video` | — | "Meet the Doctor" video block stays hidden |
| `flags.carePdf` | — | Care-guide PDF links on service pages stay hidden |

Components and pages fetch this file at runtime via `loadConfig()`.

## Pre-deploy placeholder checklist

Replace these **before launch** — they are deploy placeholders, not bugs:

- [ ] **`assets/video/meet-the-doctor.mp4`** — real "Meet the Doctor" intro
      video, then set `flags.video: true` in `clinic.json`.
- [ ] **`assets/docs/pre-treatment-care.pdf`** — real pre-treatment care PDF.
      Then set `flags.carePdf: true` in `clinic.json` to show the links.
- [ ] **`clinic.json.flags.analytics.ga4Id`** — real GA4 measurement ID
      (set `enabled: true`).
- [ ] **`clinic.json.flags.tawkId`** — real Tawk.to property ID
      (set `liveChat: true`).
- [ ] **`clinic.json.flags.reviews`** — set `true` and paste a Google Reviews
      widget embed into `renderReviews` in `assets/js/components.js`.
- [ ] **`og:image` / social graph image** — site-wide gap. Add a real
      `assets/og-cover.jpg` and reference it. `index.html` already points at
      `assets/og-cover.jpg`; service and blog pages have **no** `og:image`
      tag at all — add one to each for full social-card coverage.
- [ ] **Prices & fee** — confirm every range in `clinic.json → pricing`
      and `clinic.consultationFee` (currently placeholders). The cost guide,
      estimator and service pages all read from there.
- [ ] **Opening hours** — `clinic.openingHours` must match the hours text
      shown in the contact section and JSON-LD.
- [ ] **Clinic details** in `clinic.json` — replace the placeholder
      "Smile Care Dental Hospital" name, phone, address, hours, and social
      URLs with your real clinic info (also update JSON-LD + sitemap +
      robots `https://www.smilecaredental.com/` URLs to your domain).
- [ ] **Photos** — doctor / equipment / before-after photos are already
      **real** `.jpg`/`.png` assets. Swap for your own clinic's photos if
      desired (keep the same filenames or update `clinic.json` paths).
- [ ] **Orphaned SVGs** — `assets/img/doctors/dr-*.svg`,
      `assets/img/before-after-1-*.svg`, `assets/img/logo.svg` are no longer
      referenced (replaced by the real photos). Safe to delete in cleanup.

## Deploy

The folder deploys **as-is** to any static host — no build step.

- **Netlify / Vercel / Cloudflare Pages**: point at the repo root, publish
  directory = `/`, build command = none.
- **GitHub Pages**: push to a `gh-pages` branch or enable Pages on `master`.

Before deploying, complete the [Pre-deploy checklist](#pre-deploy-placeholder-checklist)
and update `clinic.json` flags + sitemap/robots canonical URLs to your
domain.

## Features

- **Dark mode** toggle (persists in `localStorage`; respects OS preference)
- **i18n-ready** — text is keyed via `data-i18n` and `assets/js/i18n/*.json`
  (Hindi/Telugu files kept); the site currently runs English-only with no
  language selector.
- **Before/After** drag-to-compare slider
- **FAQ** accordion (`<details>`)
- **Cost estimator** — indicative price ranges per service & complexity
- **Emergency banner** — 24/7 helpline (flag-gated)
- **Sticky mobile CTA** — Call + Book Now bar
- **Newsletter** demo signup (toast confirmation, no email sent)
- **Video testimonials** block ("Meet the Doctor" poster + video)
- **WhatsApp** booking — form composes a pre-filled WhatsApp message
- **PWA** — installable `manifest.json` + offline service worker (`sw.js`)
- **SEO** — `robots.txt`, `sitemap.xml`, per-page meta, JSON-LD
  (`Dentist` on landing, `MedicalProcedure` + `FAQPage` on service pages,
  `Article` on blog posts)
- **Flag-gated placeholders** — analytics (GA4), live chat (Tawk.to), and
  Google Reviews widget inject only when enabled in `clinic.json`

## Manual verification checklist (deferred deploy-time)

The following checks require a real browser and were **not** run headlessly
during development. Run them on the deployed (or locally-served) site before
launch:

- [ ] **Full site walk** — every section present and functional; nav/footer
      chrome consistent across `index.html`, 3 service pages, blog index,
      2 blog posts.
- [ ] **Extras checklist** — dark mode persists;
      before/after slider; FAQ accordion; cost estimator; emergency banner;
      mobile CTA; newsletter toast; video poster; flags correctly gate live
      chat / analytics / reviews.
- [ ] **Responsive + a11y** — test at 360 / 768 / 1024 / 1440 px; keyboard
      through nav, carousel, slider, accordion, form; contrast in both
      light and dark themes.
- [ ] **PWA** — manifest installable; offline loads via service worker.
- [ ] **Lighthouse** — Performance / SEO / Accessibility ≥ 90 on the landing
      page and at least one service page; fix any flagged issues inline.

## Analytics events

When GA4 is enabled (`flags.analytics`), the site sends: `click_call`,
`click_whatsapp`, `click_directions` (with the section they were clicked
in) and `booking_submit` (with the chosen treatment). Mark
`booking_submit` and `click_call` as key events in GA4 to see which pages
bring in patients.

## Images

Photos are pre-compressed for the web (equipment ≤ 800px, doctors ≤ 640px,
progressive JPEG). When adding new photos, resize them before committing,
e.g. `convert in.jpg -resize '800x800>' -strip -quality 78 out.jpg`.

## Service worker updates

`sw.js` fetches pages, scripts and data from the network first, so deploys
show up immediately. Images are cached; if you replace an image but keep
its filename, bump `CACHE` in `sw.js` (e.g. `dental-v3`) so returning
visitors get the new file.

## Known minor issues

Honest, low-severity items deferred from the build (none block deploy):

- Orphaned SVGs (`logo.svg`, `dr-*.svg`, `before-after-1-*.svg`) now
  unreferenced — repo weight only.
- `.tech-dot` branch in `render.js` is dead (all equipment now have images).
- Empty `<section id="reviews">` remains in DOM when `flags.reviews` is off
  (may leave a small vertical gap).
- `og:image` site-wide gap — no `og:image` on service/blog pages; landing
  references an `assets/og-cover.jpg` that does not yet exist.
- No trailing newline on some source files (repo convention).

## License

Placeholder project — replace with your own license before launch.