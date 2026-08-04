export const BASE = (location.pathname.includes('/services/') || location.pathname.includes('/blog/')) ? '../' : '';

let cache = null;
export async function loadConfig() {
  if (cache) return cache;
  const res = await fetch(`${BASE}assets/data/clinic.json`);
  cache = await res.json();
  return cache;
}
export function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    n.append(c.nodeType ? c : document.createTextNode(c));
  }
  return n;
}