export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildBookingMessage(f) {
  return [
    "Hello, I'd like to book an appointment.",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    f.patientType ? `Patient: ${f.patientType}` : null,
    `Service: ${f.service}`,
    f.doctor ? `Doctor: ${f.doctor}` : null,
    `Preferred Date: ${f.date}`,
    `Preferred Time: ${f.time}`,
    f.message && f.message.trim() ? `Message: ${f.message.trim()}` : null
  ].filter(Boolean).join('\n');
}