export function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const toast = document.getElementById('nl-toast');
    if (toast) { toast.hidden = false; }
    form.reset();
  });
}