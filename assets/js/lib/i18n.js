export function t(key, dict, lang) {
  return (dict[lang] && dict[lang][key]) || key;
}

export function applyI18n(root, dict, lang) {
  root.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n, dict, lang);
  });
}

const DICT = {};

export async function loadDict(lang) {
  if (!DICT[lang]) {
    const { BASE } = await import('./config.js');
    const res = await fetch(`${BASE}assets/js/i18n/${lang}.json`);
    DICT[lang] = await res.json();
  }
  return DICT;
}

export function getLoadedDict() {
  return DICT;
}

export async function initI18n(root = document) {
  const lang = localStorage.getItem('lang') || 'en';
  await loadDict(lang);
  applyI18n(root, DICT, lang);
  return lang;
}