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