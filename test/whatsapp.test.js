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
test('buildBookingMessage includes the optional message when given', () => {
  const msg = buildBookingMessage({ name: 'Rahul', phone: '9876543210', service: 'RCT', date: '2026-09-01', time: '10:00', message: '  Tooth pain since Monday ' });
  assert.match(msg, /Message: Tooth pain since Monday$/);
});

test('buildBookingMessage omits the message line when empty', () => {
  const msg = buildBookingMessage({ name: 'Rahul', phone: '9876543210', service: 'RCT', date: '2026-09-01', time: '10:00', message: '  ' });
  assert.doesNotMatch(msg, /Message:/);
});
