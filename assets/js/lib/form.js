import { buildWhatsAppUrl, buildBookingMessage } from './whatsapp.js';

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
  const sel = document.getElementById('service');
  clinic.services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name; opt.textContent = s.name;
    sel.append(opt);
  });
  if (presetService) sel.value = presetService;
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const now = new Date();
    dateInput.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  const errBox = document.getElementById('formErrors');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value, phone: form.phone.value, service: form.service.value,
      date: form.date.value, time: form.time.value,
      message: form.message ? form.message.value : ''
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
    window.open(buildWhatsAppUrl(clinic.clinic.phone, buildBookingMessage(data)), '_blank');
  });
}