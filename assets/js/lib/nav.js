// Smooth-scroll to a section, leaving room for the sticky navbar.
export function scrollToSection(id, smooth = true) {
  const target = id && document.getElementById(id);
  if (!target) return false;
  const nav = document.getElementById('site-nav');
  const offset = (nav ? nav.offsetHeight : 0) + 8;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? 'smooth' : 'auto' });
  return true;
}

// Returns the section id if the link points to a section on the current page.
export function samePageHash(href) {
  try {
    const url = new URL(href, location.href);
    const here = location.pathname.replace(/index\.html$/, '');
    const there = url.pathname.replace(/index\.html$/, '');
    return url.origin === location.origin && here === there && url.hash ? decodeURIComponent(url.hash.slice(1)) : null;
  } catch { return null; }
}
