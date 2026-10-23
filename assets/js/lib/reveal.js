export function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('reveal-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        io.unobserve(entry.target);
      }
    }
  // threshold 0 (not a percentage): very tall blocks such as the 12-card
  // equipment grid on phones can never be 15% visible, so they stayed hidden.
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  els.forEach(e => { e.classList.add('reveal'); io.observe(e); });
}