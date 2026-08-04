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