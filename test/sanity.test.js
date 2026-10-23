import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

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

test('every equipment item has an image path configured', () => {
  assert.ok(data.equipment.length >= 12, 'should have 12 equipment items');
  for (const eq of data.equipment) {
    assert.ok(eq.image, `${eq.id} missing image property`);
  }
});
test('every sitemap URL maps to an existing page', () => {
  const xml = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const paths = [...xml.matchAll(/<loc>https:\/\/[^/]+\/([^<]*)<\/loc>/g)].map(m => m[1] || 'index.html');
  assert.ok(paths.length >= 9);
  for (const p of paths) assert.ok(existsSync(new URL('../' + p, import.meta.url)), `missing ${p}`);
});

test('service pages have valid FAQPage JSON-LD', () => {
  for (const s of data.services) {
    const html = readFileSync(new URL('../' + s.page, import.meta.url), 'utf8');
    const m = html.match(/<script type="application\/ld\+json" data-faq>([\s\S]*?)<\/script>/);
    assert.ok(m, `${s.page} missing FAQ JSON-LD`);
    const ld = JSON.parse(m[1]);
    assert.equal(ld['@type'], 'FAQPage');
    assert.ok(ld.mainEntity.length >= 3);
  }
});

test('before/after slider has an explicit width (else it collapses to 0×0)', () => {
  const css = readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
  const rule = css.match(/\.ba-slider \{([^}]*)\}/);
  assert.ok(rule, 'missing .ba-slider rule');
  assert.match(rule[1], /width:\s*100%/);
  assert.match(rule[1], /aspect-ratio/);
});
