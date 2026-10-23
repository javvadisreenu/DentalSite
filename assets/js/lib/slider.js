export function initBeforeAfter(selector = '[data-ba]') {
  document.querySelectorAll(selector).forEach(slider => {
    const before = slider.querySelector('.ba-before');
    const range = slider.querySelector('input[type=range]');
    if (!before || !range) return;
    const update = () => {
      before.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`;
      slider.style.setProperty('--pos', `${range.value}%`);
    };
    range.addEventListener('input', update);
    update();
  });
}