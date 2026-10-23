import { buildWhatsAppUrl, buildBookingMessage } from './whatsapp.js';
import { timeSlots, todayInZone, format12, hoursForDay, dayOfWeek } from './hours.js';
import { track } from './track.js';

// Accepts 10-digit Indian mobiles (starting 6–9), with optional +91 / 91 / 0 prefix.
export function isValidIndianMobile(phone) {
  const digits = String(phone || '').replace(/[\s\-()]/g, '');
  return /^(?:\+?91|0)?[6-9]\d{9}$/.test(digits);
}

export function validateBookingForm(d) {
  const errors = [];
  if (!d.name || d.name.trim().length < 2) errors.push('Name is required.');
  if (!isValidIndianMobile(d.phone)) errors.push('Please enter a valid 10-digit mobile phone number.');
  if (!d.service) errors.push('Please select a service.');
  if (!d.date) errors.push('Preferred date is required.');
  else {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${d.date}T00:00`); // local midnight, not UTC
    if (chosen < today) errors.push('Preferred date cannot be in the past.');
  }
  if (!d.time) errors.push('Preferred time is required.');
  return { valid: errors.length === 0, errors };
}

export function initBookingForm(clinic, presetService) {
  const form = document.getElementById('appointmentForm');
  if (!form) return;
  const f = (n) => form.elements.namedItem(n);
  const c = clinic.clinic;
  const tz = c.timezone || 'Asia/Kolkata';
  const hours = c.openingHours || [];

  const sel = f('service');
  clinic.services.forEach(s => sel.append(new Option(s.name, s.name)));
  if (presetService) sel.value = presetService;

  // Doctor list follows the chosen treatment (falls back to everyone).
  const docSel = f('doctor');
  function fillDoctors() {
    if (!docSel) return;
    const svc = clinic.services.find(s => s.name === sel.value);
    const list = clinic.doctors.filter(d => !svc || d.services.includes(svc.id));
    const keep = docSel.value;
    docSel.replaceChildren(new Option('Any available doctor', ''), ...(list.length ? list : clinic.doctors).map(d => new Option(`${d.name} — ${d.specialization}`, d.name)));
    if ([...docSel.options].some(o => o.value === keep)) docSel.value = keep;
  }
  sel.addEventListener('change', fillDoctors);
  fillDoctors();

  // Time slots follow the chosen date and the clinic's opening hours.
  const dateInput = f('date');
  const timeSel = f('time');
  const hint = document.getElementById('slotHint');
  const today = todayInZone(new Date(), tz);
  dateInput.min = today;
  const max = new Date(`${today}T12:00:00Z`); max.setUTCDate(max.getUTCDate() + 60);
  dateInput.max = max.toISOString().slice(0, 10);
  function fillSlots() {
    if (timeSel.tagName !== 'SELECT') return;
    const ymd = dateInput.value;
    if (!ymd) { timeSel.disabled = true; timeSel.replaceChildren(new Option('Pick a date first', '')); if (hint) hint.textContent = ''; return; }
    const slots = timeSlots(ymd, hours, c.slotMinutes || 30, new Date(), tz);
    const prev = timeSel.value;
    if (!slots.length) {
      timeSel.disabled = true;
      timeSel.replaceChildren(new Option('No slots available', ''));
      const h = hoursForDay(dayOfWeek(ymd), hours);
      if (hint) hint.textContent = !h ? 'The clinic is closed on this day — please pick another date.' : 'No more slots today — please pick another date.';
      return;
    }
    timeSel.disabled = false;
    timeSel.replaceChildren(new Option('Select a time', ''), ...slots.map(t => new Option(format12(t), format12(t))));
    if (slots.map(format12).includes(prev)) timeSel.value = prev;
    if (hint) hint.textContent = '';
  }
  dateInput.addEventListener('change', fillSlots);
  fillSlots();

  const errBox = document.getElementById('formErrors');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: f('name').value, phone: f('phone').value, service: sel.value,
      date: dateInput.value, time: timeSel.value,
      patientType: f('patientType') ? f('patientType').value : '',
      doctor: docSel ? docSel.value : '',
      message: f('message') ? f('message').value : ''
    };
    const { valid, errors } = validateBookingForm(data);
    if (!valid) {
      errBox.hidden = false;
      errBox.replaceChildren(...errors.map(m => {
        const li = document.createElement('li'); li.textContent = m; return li;
      }));
      return;
    }
    errBox.hidden = true;
    track('booking_submit', { service: data.service });
    window.open(buildWhatsAppUrl(c.phone, buildBookingMessage(data)), '_blank');
  });
}
