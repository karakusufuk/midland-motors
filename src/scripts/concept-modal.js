/* Concept modal: one instance, event delegation. Nothing is sent anywhere. */
const BODY = {
  reserve: 'this would take a refundable €200 deposit through a secure payment provider and hold the car for you.',
  testdrive: "this would book the test drive into the dealership's calendar and text you a confirmation.",
  tradein: "your car's details would go to our workshop team for a callback.",
  finance: 'this would send your finance application to our lender partners and show you the options by email.',
  enquiry: 'this message would reach the sales team, who would reply within the working day.',
  phone: "this would ring the dealership's sales desk.",
  email: 'this would open a message to the sales team.',
  address: 'this would open directions to the showroom.',
  other: 'this would go straight to the dealership team.',
};
const $ = s => document.querySelector(s);
let root, state = null;

function focusables(){ return [...root.querySelectorAll('a[href],button:not([disabled])')]; }

function open(kind, opts = {}){
  root ??= $('#cm'); if (!root || state) return;
  state = { from: opts.from || document.activeElement, onClose: opts.onClose };
  $('#cm-body').textContent = 'In a live build, ' + (BODY[kind] || BODY.other);
  root.hidden = false;
  void root.offsetWidth; root.classList.add('on'); $('#cm-title').focus();
}

function close(){
  if (!state) return;
  const { from, onClose } = state; state = null;
  root.classList.remove('on');
  if (onClose) onClose();
  setTimeout(() => {
    if (from && from.isConnected && !from.closest('[hidden]')) from.focus();
    else { const h = document.querySelector('#panel.on h2'); if (h) h.focus(); }
  }, 0);
}

const kindOf = el => el.closest('[data-concept]')?.dataset.concept;

document.addEventListener('click', e => {
  if (state){ if (e.target.closest('[data-cm-close]')) close(); return; }
  const t = e.target.closest('[data-concept], a[href^="tel:"], a[href^="mailto:"], a[href*="google.com/maps"]');
  if (!t) return;
  let k = t.dataset.concept;
  if (!k) k = t.getAttribute('href').startsWith('tel:') ? 'phone' : t.getAttribute('href').startsWith('mailto:') ? 'email' : 'address';
  e.preventDefault(); e.stopPropagation();
  open(k, { from: t });
}, true);

document.addEventListener('keydown', e => {
  if (!state) return;
  if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(); return; }
  if (e.key !== 'Tab') return;
  e.stopPropagation();
  const f = focusables(); if (!f.length) return;
  const a = document.activeElement, first = f[0], last = f[f.length - 1];
  if (!root.contains(a)){ e.preventDefault(); first.focus(); }
  else if (e.shiftKey && (a === first || a.id === 'cm-title')){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && a === last){ e.preventDefault(); first.focus(); }
}, true);

window.ConceptModal = { open, close };
