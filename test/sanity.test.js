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