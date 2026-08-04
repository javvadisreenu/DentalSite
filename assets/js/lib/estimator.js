export function estimateCost(serviceId, complexity, pricing) {
  const p = pricing[serviceId];
  if (!p) return null;
  const span = p.max - p.min;
  const frac = { low: 0.25, medium: 0.5, high: 0.75 }[complexity] ?? 0.5;
  const mid = p.min + span * frac;
  let min, max;
  if (complexity === 'low') {
    // Anchor at the floor; upper bound mirrors distance to mid.
    min = p.min;
    max = Math.round(2 * mid - p.min);
  } else if (complexity === 'high') {
    // Anchor at the ceiling; lower bound mirrors distance to mid.
    min = Math.round(2 * mid - p.max);
    max = p.max;
  } else {
    // Moderate: symmetric window around mid.
    min = Math.round(mid - span * 0.25);
    max = Math.round(mid + span * 0.25);
  }
  return {
    min,
    max,
    currency: p.currency,
    label: `${p.currency}${min.toLocaleString()} – ${p.currency}${max.toLocaleString()}`
  };
}

export function initEstimator(clinic) {
  const svcSel = document.getElementById('est-service');
  const cmpSel = document.getElementById('est-complexity');
  const result = document.getElementById('est-result');
  const factors = document.getElementById('est-factors');
  if (!svcSel || !result) return;
  clinic.services.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = s.name;
    svcSel.append(o);
  });
  function update() {
    const r = estimateCost(svcSel.value, cmpSel.value, clinic.pricing);
    if (!r) { result.textContent = 'Select a service.'; factors.textContent = ''; return; }
    result.textContent = `Approx. ${r.label}`;
    factors.textContent = 'Factors: ' + (clinic.pricing[svcSel.value].factors || []).join(', ');
  }
  svcSel.addEventListener('change', update);
  cmpSel.addEventListener('change', update);
  update();
}