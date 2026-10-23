import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openStatus, timeSlots, format12, zonedNow } from '../assets/js/lib/hours.js';

const TZ = 'Asia/Kolkata';
const HOURS = [
  { days: [1, 2, 3, 4, 5, 6], open: '09:00', close: '20:00' },
  { days: [0], open: '10:00', close: '14:00' }
];
// Helper: an instant given as IST wall-clock time
const ist = (s) => new Date(`${s}+05:30`);

test('format12 converts 24h to 12h', () => {
  assert.equal(format12('09:00'), '9:00 AM');
  assert.equal(format12('20:00'), '8:00 PM');
  assert.equal(format12('12:30'), '12:30 PM');
  assert.equal(format12('00:15'), '12:15 AM');
});

test('zonedNow uses the clinic timezone', () => {
  const z = zonedNow(new Date('2026-10-22T20:00:00Z'), TZ); // 01:30 IST next day
  assert.equal(z.ymd, '2026-10-23');
  assert.equal(z.minutes, 90);
});

test('open during weekday hours', () => {
  const s = openStatus(ist('2026-10-22T11:00:00'), HOURS, TZ); // Thursday
  assert.equal(s.open, true);
  assert.match(s.label, /closes 8:00 PM/);
});

test('closed before opening says opens today', () => {
  const s = openStatus(ist('2026-10-22T07:30:00'), HOURS, TZ);
  assert.equal(s.open, false);
  assert.match(s.label, /opens 9:00 AM today/);
});

test('Saturday night shows Sunday hours as tomorrow', () => {
  const s = openStatus(ist('2026-10-24T21:00:00'), HOURS, TZ); // Saturday
  assert.equal(s.open, false);
  assert.match(s.label, /opens 10:00 AM tomorrow/);
});

test('slots respect opening hours and slot length', () => {
  const sun = timeSlots('2026-10-25', HOURS, 30, ist('2026-10-20T10:00:00'), TZ);
  assert.equal(sun[0], '10:00');
  assert.equal(sun.at(-1), '13:30');
  assert.equal(sun.length, 8);
});

test('slots for today skip past times (30 min notice)', () => {
  const slots = timeSlots('2026-10-22', HOURS, 30, ist('2026-10-22T15:10:00'), TZ);
  assert.equal(slots[0], '16:00');
  assert.equal(slots.at(-1), '19:30');
});

test('no slots for past dates', () => {
  assert.deepEqual(timeSlots('2026-10-01', HOURS, 30, ist('2026-10-22T10:00:00'), TZ), []);
});
