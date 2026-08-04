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
  const node = { dataset: { i18n: 'hero.title' }, set textContent(v){ this._t = v; } };
  const root = { querySelectorAll: () => [ node ] };
  applyI18n(root, dict, 'hi');
  assert.equal(root.querySelectorAll()[0]._t, 'आपकी मुस्कान');
});