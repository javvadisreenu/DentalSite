// Sends an event to Google Analytics (GA4) when it is enabled in
// clinic.json; does nothing otherwise.
export function track(event, params = {}) {
  try { if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', event, params); } catch {}
}

// Count taps on call / WhatsApp links anywhere on the page.
export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const where = a.closest('[id]')?.id || 'page';
    if (href.startsWith('tel:')) track('click_call', { location: where });
    else if (href.includes('wa.me/')) track('click_whatsapp', { location: where });
    else if (href.includes('google.com/maps')) track('click_directions', { location: where });
  });
}
