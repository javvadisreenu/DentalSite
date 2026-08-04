export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildBookingMessage(f) {
  return [
    "Hello, I'd like to book an appointment.",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Service: ${f.service}`,
    `Preferred Date: ${f.date}`,
    `Preferred Time: ${f.time}`
  ].join('\n');
}