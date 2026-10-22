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
test('phone accepts Indian mobile formats', async () => {
  const { isValidIndianMobile } = await import('../assets/js/lib/form.js');
  for (const p of ['9876543210', '+91 98765 43210', '919876543210', '09876543210', '98765-43210']) {
    assert.ok(isValidIndianMobile(p), p);
  }
});

test('phone rejects too-long, too-short and non-mobile numbers', async () => {
  const { isValidIndianMobile } = await import('../assets/js/lib/form.js');
  for (const p of ['12345678901234', '123', '1234567890', '', 'abcdefghij']) {
    assert.ok(!isValidIndianMobile(p), p);
  }
});

test('today is not treated as a past date', () => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const r = validateBookingForm({ name: 'Rahul', phone: '9876543210', service: 'x', date: today, time: '10:00' });
  assert.ok(r.valid, r.errors.join());
});
