(function(){
'use strict';
const D = window.MM, CARS = D.cars, SITE = D.site;
CARS.forEach(c => { c.photos = c.photos.map(p => p.startsWith('/') ? p : '/' + p); });
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const eur = (n, d=0) => '€' + Number(n).toLocaleString('en-IE', {minimumFractionDigits:d, maximumFractionDigits:d});
const km = n => Number(n).toLocaleString('en-IE');
const RATE = Math.pow(1 + SITE.finance.apr/100, 1/12) - 1;
const monthly = (credit, n) => credit <= 0 ? 0 : credit * RATE / (1 - Math.pow(1 + RATE, -n));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bySlug = s => CARS.find(c => c.slug === s);
const nm = c => c.make + ' ' + c.model;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ym = s => { const [y,m] = s.split('-'); return MONTHS[+m-1] + ' ' + y; };

/* ---------- logo ---------- */
const L = window.MMLOGO;
const LOCK_W = Math.ceil(96 + L.tw + 4);
// Mark: a ring with a dot at its centre. Athlone sits at the centre of Ireland; "Midland" means the middle.
const ringParts = (cx, cy, R, col) => { const sw = R*.26; return `<circle class="mk-ring" cx="${cx}" cy="${cy}" r="${(R-sw/2).toFixed(2)}" fill="none" stroke="${col}" stroke-width="${sw.toFixed(2)}"/><circle class="mk-dot" cx="${cx}" cy="${cy}" r="${(R*.24).toFixed(2)}" fill="${col}"/>`; };
function markSVG(color, size, label='Midland Motors'){ return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}>${ringParts(50,50,48,color)}</svg>`; }
function logoSVG(color, text){
  const h = 30, w = Math.round(LOCK_W*h/80);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${LOCK_W} 80" role="img" aria-label="Midland Motors">${ringParts(36,40,32,color)}<path transform="translate(96,55)" d="${L.text}" fill="${text}"/></svg>`;
}
const CHEV = `<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW = `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><path d="M1 7H16M10 1L16 7L10 13" fill="none" stroke="#1C1E21" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- shared chrome ---------- */
function navLinks(){
  return `<a href="/stock/" data-nav="stock">Stock</a><a href="/certified/" data-nav="certified">Midland Certified</a><a href="/finance/" data-nav="finance">Finance</a><a href="#" data-panel="tradein">Value your car</a><a href="#" data-goto="visit">Visit</a>`;
}
function chrome(){
  $('#hdr').innerHTML = `<div class="wrap hdr-in"><a class="logo" href="/" aria-label="Midland Motors home">${logoSVG('#F2EEE8','#F2EEE8')}</a><nav class="nav" aria-label="Main">${navLinks()}</nav><a class="phone" href="tel:+35312345187" data-concept="phone">01 234 5187</a><button class="btn btn-bone" data-panel="testdrive">Book a test drive</button><button type="button" class="menu-btn" data-menu aria-label="Open menu" aria-expanded="false"><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 1.5H17M1 10.5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Menu</span></button></div>`;
  $('#bar').innerHTML = `<div class="wrap hdr-in"><a class="logo" href="/" aria-label="Midland Motors home">${logoSVG('#8C2B3C','#1C1E21')}</a><nav class="nav" aria-label="Main">${navLinks()}</nav><a class="phone" href="tel:+35312345187" data-concept="phone">01 234 5187</a><button class="btn btn-wine" data-panel="testdrive">Book a test drive</button><button type="button" class="menu-btn" data-menu aria-label="Open menu" aria-expanded="false"><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 1.5H17M1 10.5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Menu</span></button></div>`;
  if (!$('#mnav')){ const m = document.createElement('div'); m.id = 'mnav'; m.className = 'mnav stage'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','Menu'); m.hidden = true;
    m.innerHTML = `<div class="wrap mnav-top"><a class="logo" href="/" data-menu-close aria-label="Midland Motors home">${logoSVG('#F2EEE8','#F2EEE8')}</a><button type="button" class="menu-btn" data-menu-close aria-label="Close menu"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Close</span></button></div>
      <nav class="wrap mnav-links" aria-label="Main"><a href="/" data-menu-close>Home</a><a href="/stock/" data-menu-close>Stock</a><a href="/certified/" data-menu-close>Midland Certified</a><a href="/finance/" data-menu-close>Finance</a><a href="#" data-menu-close data-panel="tradein">Value your car</a><a href="#" data-menu-close data-goto="visit">Visit</a></nav>
      <div class="wrap mnav-foot"><button class="btn btn-wine btn-lg" data-menu-close data-panel="testdrive">Book a test drive</button><span class="muted"><a href="tel:+35312345187" data-concept="phone" style="color:inherit">Call 01 234 5187</a> · <a href="#" data-concept="address" style="color:inherit">Dublin Road, Athlone</a></span></div>`;
    document.body.appendChild(m);
    // backdrop behind the menu sheet (the sheet is a side drawer on tablets, full screen on phones); tapping it closes the menu
    const bd = document.createElement('div'); bd.className = 'mnav-backdrop'; bd.setAttribute('data-menu-close', ''); bd.hidden = true; document.body.insertBefore(bd, m); }
}
// The menu only exists below 1100px (the menu button is hidden on desktop), so none of this runs on desktop.
let menuFrom = null;
function setMenu(open){
  const m = $('#mnav'); if (!m || m.hidden === !open) return;
  if (open) menuFrom = document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-menu]');
  m.hidden = !open; const bd = $('.mnav-backdrop'); if (bd) bd.hidden = !open;
  document.documentElement.classList.toggle('menu-open', open); $$('[data-menu]').forEach(b => b.setAttribute('aria-expanded', open));
  if (open) setTimeout(()=>m.querySelector('.mnav-links a').focus(), 30);
  else { const back = (menuFrom && menuFrom.isConnected && !menuFrom.closest('[hidden]')) ? menuFrom : menuBtn(); if (back) back.focus({preventScroll:true}); menuFrom = null; }
}
// the menu button the visitor can see: the fixed bar's once it has slid in, otherwise the home header's
function menuBtn(){ const bar = $('#bar'), hdr = $('#hdr'); return (bar && (bar.classList.contains('show') || !hdr || hdr.hidden)) ? $('#bar [data-menu]') : $('#hdr [data-menu]'); }
document.addEventListener('click', e => { if (e.target.closest('[data-menu]')) setMenu(true); else if (e.target.closest('[data-menu-close]')) setMenu(false); });
document.addEventListener('keydown', e => {
  const m = $('#mnav'); if (!m || m.hidden) return;
  if (e.key==='Escape'){ setMenu(false); return; }
  if (e.key!=='Tab') return;
  const f = $$('a[href],button', m).filter(x => x.offsetParent); if (!f.length) return;
  const first = f[0], last = f[f.length-1], a = document.activeElement;
  if (!m.contains(a)){ e.preventDefault(); first.focus(); }
  else if (e.shiftKey && a===first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && a===last){ e.preventDefault(); first.focus(); }
});
matchMedia('(min-width:1101px)').addEventListener('change', q => { if (q.matches) setMenu(false); });
function footerHTML(){
  return `<footer class="foot stage" id="visit-${Math.random().toString(36).slice(2,7)}" data-visit>
  <div class="wrap">
    <div class="foot-grid">
      <div style="display:flex;flex-direction:column;gap:26px;align-items:flex-start">
        <h2 class="d" style="font-size:clamp(44px,5.4vw,80px)">Visit us in Athlone.</h2>
        <p style="margin:0;font-size:18px"><a href="#" data-concept="address" style="color:inherit;text-decoration:none">Dublin Road, Athlone, Co. Westmeath N37</a><br><span class="muted">Five minutes from junction 9 on the M6.</span></p>
        <span class="open-now" data-open><i></i><span>Open now</span></span>
        <div class="hours"><span class="muted">Monday to Friday</span><span>9am – 6pm</span><span class="muted">Saturday</span><span>9.30am – 5pm</span><span class="muted">Sunday</span><span>Closed</span></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-wine foot-td" data-panel="testdrive">Book a test drive</button><a class="btn btn-line" href="tel:+35312345187">Call the workshop · 01 234 5187</a></div>
      </div>
      <div>
        <a href="#" data-concept="address" class="map-link" aria-label="Open directions to the showroom"><div class="map">${mapSVG()}</div></a>
        <a class="link" style="display:inline-block;margin-top:16px" href="#" data-concept="address">Get directions</a>
      </div>
    </div>
    <div class="foot-bottom">${logoSVG('#F2EEE8','#F2EEE8')}<span>© 2026 Midland Motors</span><a href="/privacy/" style="color:inherit">Privacy</a></div>
  </div></footer>`;
}
function mapSVG(){
  return `<svg viewBox="0 0 520 380" role="img" aria-label="Map: Midland Motors on Dublin Road, east of Athlone town centre, near junction 9 of the M6" style="width:100%;height:auto;display:block">
  <rect width="520" height="380" fill="#2E3237"/>
  <path d="M120 0 C140 70 110 120 150 180 C185 235 160 300 190 380" fill="none" stroke="#3E4D59" stroke-width="20" stroke-linecap="round"/>
  <text x="70" y="352" fill="#73858F" style="font:600 11px 'IBM Plex Sans',sans-serif;letter-spacing:.12em">RIVER SHANNON</text>
  <path d="M0 300 C120 290 260 300 520 250" fill="none" stroke="#5B6067" stroke-width="9" stroke-linecap="round"/><path d="M0 300 C120 290 260 300 520 250" fill="none" stroke="#2E3237" stroke-width="3"/>
  <text x="430" y="240" fill="#B9BBBD" style="font:600 12px 'IBM Plex Sans',sans-serif">M6</text>
  <path d="M150 170 C230 160 300 150 520 120" fill="none" stroke="#4C5157" stroke-width="4" stroke-linecap="round"/>
  <text x="420" y="160" fill="#B9BBBD" style="font:500 12px 'IBM Plex Sans',sans-serif">Dublin Road</text>
  <path d="M360 146 L372 286" fill="none" stroke="#4C5157" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round"/>
  <circle cx="372" cy="288" r="6" fill="#B9BBBD"/><text x="386" y="308" fill="#B9BBBD" style="font:500 12px 'IBM Plex Sans',sans-serif">Junction 9</text>
  <circle cx="160" cy="176" r="6" fill="#B9BBBD"/><text x="172" y="202" fill="#B9BBBD" style="font:500 12px 'IBM Plex Sans',sans-serif">Athlone town</text>
  <circle cx="360" cy="146" r="22" fill="#8C2B3C" opacity=".25"/><circle cx="360" cy="146" r="11" fill="#8C2B3C" stroke="#F2EEE8" stroke-width="3"/>
  <rect x="268" y="84" width="184" height="34" rx="17" fill="#F2EEE8"/><text x="360" y="106" text-anchor="middle" fill="#1C1E21" style="font:800 12px Archivo,sans-serif;font-stretch:125%;letter-spacing:.06em">MIDLAND MOTORS</text>
  </svg>`;
}
function liveOpen(){
  const now = new Date(new Date().toLocaleString('en-US', {timeZone:'Europe/Dublin'}));
  const d = now.getDay(), h = now.getHours() + now.getMinutes()/60;
  const hrs = d===0 ? null : d===6 ? [9.5,17] : [9,18];
  let txt, open = false;
  if (hrs && h>=hrs[0] && h<hrs[1]) { open = true; txt = 'Open now, until ' + (d===6?'5pm':'6pm'); }
  else { const nextMon = d===6 && h>=17 || d===0; txt = 'Closed now · opens ' + (nextMon ? 'Monday at 9am' : (h<(hrs?hrs[0]:9) ? 'today at ' + (d===6?'9.30am':'9am') : (d===5?'Saturday at 9.30am':'tomorrow at 9am'))); }
  $$('[data-open]').forEach(el => { el.querySelector('span').textContent = txt; el.style.opacity = open ? 1 : .85; el.querySelector('i').style.background = open ? 'var(--pass)' : '#B9BBBD'; });
}

/* ---------- combobox (single list, or stepped: make → model, from → to) ---------- */
let cbId = 0; const CBM = {};
const BACK = `<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M15 6H2M6 1L1 6L6 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function cbHTML(id, cls=''){
  const m = CBM[id];
  return `<div class="cb ${cls}" data-cb="${id}"><button type="button" class="cb-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-l">${m.label!==''?`<span class="cb-txt"><span class="cb-lab">${m.label}</span><span class="cb-val">${m.display()}</span></span>`:`<span class="cb-txt"><span class="cb-val">${m.display()}</span></span>`}<span class="cb-ch">${CHEV}</span></button><div class="cb-list" id="${id}-l" role="listbox" tabindex="-1" aria-label="${m.label || 'Options'}"></div></div>`;
}
function combo(label, options, value, cls='', onChange){
  const id = 'cb' + (++cbId); let cur = value;
  CBM[id] = { label, display:()=>cur, view:()=>({items:options.map(o=>({v:o,label:o,sel:o===cur}))}), pick:v=>{ cur=v; onChange && onChange(v); } };
  return cbHTML(id, cls);
}
function renderList(cb){
  const id = cb.dataset.cb, m = CBM[id], v = m.view(), L = cb.querySelector('.cb-list');
  L.innerHTML = (v.title ? `<div class="cb-step">${v.back?`<button type="button" class="cb-back" data-back aria-label="Back">${BACK}</button>`:''}<span>${v.title}</span></div>` : '')
    + `<ul>${v.items.map((it,i)=>`<li role="option" id="${id}-o${i}" data-v="${it.v}" aria-selected="${!!it.sel}">${it.label}${it.n!=null?`<span class="cb-n">${it.n}</span>`:''}</li>`).join('')}</ul>`;
  setAct(cb, cb.querySelector('li[aria-selected=true]') || cb.querySelector('li'));
}
function refreshCb(){ $$('.cb').forEach(cb => { const m = CBM[cb.dataset.cb]; if (!m) return; cb.querySelector('.cb-val').textContent = m.display(); const l = cb.querySelector('.cb-lab'); if (l) l.textContent = m.label; }); }
function closeAllCb(except){ $$('.cb.open').forEach(c => { if (c!==except){ c.classList.remove('open'); c.querySelector('.cb-btn').setAttribute('aria-expanded','false'); const m = CBM[c.dataset.cb]; m && m.reset && m.reset(); } }); }
function openCb(cb){ closeAllCb(cb); const m = CBM[cb.dataset.cb]; m.reset && m.reset(); renderList(cb); const r = cb.getBoundingClientRect(); cb.classList.toggle('up', innerHeight - r.bottom < 340 && r.top > 380); cb.classList.add('open'); cb.querySelector('.cb-btn').setAttribute('aria-expanded','true'); }
document.addEventListener('click', e => {
  const inList = e.target.closest('.cb-list');
  if (inList){ const cb = inList.closest('.cb');
    if (e.target.closest('[data-back]')){ CBM[cb.dataset.cb].back(); renderList(cb); return; }
    const li = e.target.closest('li'); if (li) pick(cb, li); return; }
  const btn = e.target.closest('.cb-btn');
  if (btn){ const cb = btn.closest('.cb'); if (cb.classList.contains('open')) closeAllCb(); else openCb(cb); return; }
  closeAllCb();
});
function setAct(cb, li){ cb.querySelectorAll('li').forEach(x=>x.classList.toggle('act', x===li)); if (li){ li.scrollIntoView({block:'nearest'}); cb.querySelector('.cb-btn').setAttribute('aria-activedescendant', li.id); } }
function pick(cb, li){
  const m = CBM[cb.dataset.cb]; const keep = m.pick(li.dataset.v) === 'keep';
  refreshCb();
  if (keep){ renderList(cb); return; }
  cb.classList.remove('open'); const b = cb.querySelector('.cb-btn'); b.setAttribute('aria-expanded','false'); b.blur();
}
document.addEventListener('keydown', e => {
  const cb = e.target.closest && e.target.closest('.cb'); if (!cb) { if (e.key==='Escape') { closeAllCb(); closePanel(); } return; }
  const lis = $$('li', cb); const act = cb.querySelector('li.act'); let i = lis.indexOf(act);
  const open = cb.classList.contains('open');
  if (['ArrowDown','ArrowUp'].includes(e.key)){ e.preventDefault(); if (!open){ openCb(cb); return; } i = Math.max(0, Math.min(lis.length-1, i + (e.key==='ArrowDown'?1:-1))); setAct(cb, lis[i]); }
  else if (e.key==='Enter' || e.key===' '){ if (open && act){ e.preventDefault(); pick(cb, act); cb.querySelector('.cb-btn').focus(); } }
  else if (e.key==='Backspace' && open && cb.querySelector('[data-back]')){ e.preventDefault(); CBM[cb.dataset.cb].back(); renderList(cb); }
  else if (e.key==='Escape'){ closeAllCb(); cb.querySelector('.cb-btn').focus(); }
});

/* ---------- finder: the shared search (home + stock) ---------- */
const MAKES = [...new Set(CARS.map(c=>c.make))].sort();
const KM_OPTS = [10000,20000,30000,40000,50000,75000,100000];
const PRICE_OPTS = [15000,20000,25000,30000,35000,40000,45000,50000];
const MON_OPTS = [300,400,500,600,700,800,900];
const YEAR_OPTS = [2019,2020,2021,2022,2023];
function makeModelCombo(){
  const id = 'cb' + (++cbId); let step = 'make', tmp = null;
  const F = () => STATE.f;
  CBM[id] = { label:'Make & model',
    display:()=> !F().make ? 'Any make' : F().model ? `${F().make} ${F().model}` : `${F().make}, any model`,
    view:()=>{
      if (step==='make') return { items:[{v:'',label:'Any make',sel:!F().make}, ...MAKES.map(m=>({v:m,label:m,sel:F().make===m,n:CARS.filter(c=>c.make===m).length}))] };
      const models = [...new Set(CARS.filter(c=>c.make===tmp).map(c=>c.model))].sort();
      return { title:tmp, back:true, items:[{v:'',label:`Any ${tmp} model`,sel:!F().model}, ...models.map(m=>({v:m,label:m,sel:F().model===m,n:CARS.filter(c=>c.make===tmp&&c.model===m).length}))] };
    },
    pick:v=>{
      if (step==='make'){ if (!v){ F().make=''; F().model=''; onFilter(); return; } tmp=v; F().make=v; F().model=''; step='model'; onFilter(); return 'keep'; }
      F().model=v; step='make'; onFilter();
    },
    back:()=>{ step='make'; }, reset:()=>{ step='make'; } };
  return cbHTML(id, 'f-make');
}
function rangeCombo(label, kF, kT, opts, fmt, unit, cls=''){
  const id = 'cb' + (++cbId); let step = 'from';
  const F = () => STATE.f, O = () => typeof opts==='function' ? opts() : opts, L = () => typeof label==='function' ? label() : label;
  const u = () => typeof unit==='function' ? unit() : unit;
  CBM[id] = { get label(){ return L(); },
    display:()=>{ const a=F()[kF], b=F()[kT];
      if (a!=null && b!=null) return `${fmt(a)} – ${fmt(b)}${u()}`; if (a!=null) return `From ${fmt(a)}${u()}`; if (b!=null) return `Up to ${fmt(b)}${u()}`; return 'Any'; },
    view:()=> step==='from'
      ? { title:'From', items:[{v:'',label:'Any',sel:F()[kF]==null}, ...O().map(o=>({v:o,label:fmt(o)+u(),sel:F()[kF]===o}))] }
      : { title:'To', back:true, items:[{v:'',label:'Any',sel:F()[kT]==null}, ...O().filter(o=>F()[kF]==null||o>F()[kF]).map(o=>({v:o,label:fmt(o)+u(),sel:F()[kT]===o}))] },
    pick:v=>{ if (step==='from'){ F()[kF] = v==='' ? null : +v; if (F()[kT]!=null && F()[kF]!=null && F()[kT]<=F()[kF]) F()[kT]=null; step='to'; onFilter(); return 'keep'; }
      F()[kT] = v==='' ? null : +v; step='from'; onFilter(); },
    back:()=>{ step='from'; }, reset:()=>{ step='from'; } };
  return cbHTML(id, cls);
}
const fmtNum = n => Number(n).toLocaleString('en-IE');
const SLIDERS = `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M1 3.5H15M1 10.5H15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="5" cy="3.5" r="2.2" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/><circle cx="11" cy="10.5" r="2.2" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/></svg>`;
const TICK = `<svg class="tk" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.2 9.3L7.8 11.8L12.8 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const togHTML = (k, label, tone='') => `<button type="button" class="rec ${tone} ${STATE.f[k]?'on':''}" data-tog="${k}" aria-pressed="${STATE.f[k]}">${TICK}<span>${label}</span></button>`;
function syncFinder(){
  $$('[data-pills]').forEach(g => { const k = g.dataset.pills; $$('.pill', g).forEach(p => { const on = STATE.f[k]===p.dataset.v; p.classList.toggle('on', on); p.setAttribute('aria-pressed', on); }); });
  $$('[data-tog]').forEach(t => { const on = !!STATE.f[t.dataset.tog]; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on); });
  $$('[data-mode]').forEach(x => x.classList.toggle('on', (x.dataset.mode==='monthly') === STATE.f.monthly));
  const f = STATE.f, n = [f.make, f.kmF!=null||f.kmT!=null, f.pF!=null||f.pT!=null, f.yF!=null||f.yT!=null, f.fuel!=='All', f.gear!=='All', f.body!=='All', f.colour!=='All', f.eng!=='All', f.one, f.fsh, f.irish, f.nct].filter(Boolean).length;
  $$('[data-active-n]').forEach(el => { el.textContent = n || ''; el.hidden = !n; });
}
function finderHTML(where){
  const f = STATE.f;
  const pills = (k, list) => `<div class="pills" data-pills="${k}" data-free>${list.map(b=>`<button type="button" class="pill ${f[k]===b?'on':''}" data-v="${b}" aria-pressed="${f[k]===b}">${b}</button>`).join('')}</div>`;
  const grp = (lab, inner) => `<div class="f-grp"><span class="f-lab">${lab}</span>${inner}</div>`;
  return `<div class="finder" data-finder="${where}">
    <div class="f-row1">
      ${makeModelCombo()}
      ${rangeCombo('Kilometres','kmF','kmT',KM_OPTS,fmtNum,' km')}
      ${rangeCombo(()=>STATE.f.monthly?'Monthly budget':'Budget','pF','pT',()=>STATE.f.monthly?MON_OPTS:PRICE_OPTS,n=>'€'+fmtNum(n),()=>STATE.f.monthly?' a month':'', 'f-budget')}
      ${rangeCombo('Year','yF','yT',YEAR_OPTS,n=>String(n),'')}
      <span class="f-vr" aria-hidden="true"></span>
      <button type="button" class="btn btn-line f-all" data-more aria-expanded="false">${SLIDERS}<span class="f-all-t">All filters</span><span class="f-n" data-active-n hidden></span></button>
    </div>
    <div class="f-row f-row2">
      ${grp('Fuel', pills('fuel',['Petrol','Diesel','Hybrid']))}
      ${grp('Gearbox', pills('gear',['Manual','Automatic']))}
      <div class="f-grp f-rec" role="group" aria-label="From our records">${togHTML('one','1 owner','r-owner')}${togHTML('fsh','Service history','r-svc')}</div>
    </div>
    <div class="f-more"><div class="f-more-in">
      <div class="f-row f-row3">${grp('Body type', pills('body',['Hatchback','Saloon','Estate','SUV']))}${grp('Engine', pills('eng',['Up to 1.2 L','1.3 – 1.6 L','1.8 L and above']))}</div>
      <div class="f-row f-row4">${grp('Colour', pills('colour',['Grey','White','Black']))}${grp('Prices', `<div class="seg" role="group" aria-label="Show prices as"><button type="button" data-mode="price" class="${f.monthly?'':'on'}">Full price</button><button type="button" data-mode="monthly" class="${f.monthly?'on':''}">Monthly</button></div>`)}<div class="f-grp f-rec" role="group" aria-label="More from our records">${togHTML('irish','Irish supplied','r-irish')}${togHTML('nct','NCT to 2027+','r-nct')}</div></div>
    </div></div>
    <div class="f-foot">${where==='stock' ? `<button type="button" class="btn btn-line" data-clear>Clear all</button>` : ''}<button type="button" class="btn btn-wine btn-lg f-go" data-go><span data-count-label>Show cars</span></button></div>
  </div>`;
}
function setMore(open){
  const fd = $('.finder'); if (!fd) return;
  fd.classList.toggle('expanded', open); fd.parentElement.classList.toggle('f-lift', open);
  $$('[data-more]').forEach(b => { b.setAttribute('aria-expanded', open); b.querySelector('.f-all-t').textContent = open ? 'Fewer filters' : 'All filters'; });
  let s = $('#fscrim'); if (!s){ s = document.createElement('div'); s.id = 'fscrim'; s.className = 'f-scrim'; document.body.appendChild(s); s.addEventListener('click', () => setMore(false)); }
  s.classList.toggle('on', open);
  if (open){ const top = fd.getBoundingClientRect().top; if (top < 90 || top > innerHeight*0.45) window.scrollTo({top: top + scrollY - 100, behavior: reduce?'auto':'smooth'}); }
}
document.addEventListener('keydown', e => { if (e.key==='Escape' && $('.finder.expanded')) setMore(false); });
function onFilter(){
  const n = filtered().length;
  $$('[data-count-label]').forEach(el => el.textContent = n===0 ? 'No matches' : `Show ${n} ${n===1?'car':'cars'}`);
  $$('[data-go]').forEach(b => { b.disabled = n===0; });
  if (STATE.page==='stock') renderCards();
  refreshCb(); stripSummary(); syncFinder();
}
function stripSummary(){
  const s = $('#fstripTxt'); if (!s) return; const f = STATE.f, parts = [];
  if (f.make) parts.push(f.model ? f.make+' '+f.model : f.make);
  const cbv = $$('.finder .cb').map(cb => CBM[cb.dataset.cb]).filter(m => m.label!=='Make & model').map(m => m.display()).filter(v => v!=='Any');
  parts.push(...cbv);
  if (f.fuel!=='All') parts.push(f.fuel); if (f.gear!=='All') parts.push(f.gear); if (f.body!=='All') parts.push(f.body); if (f.colour!=='All') parts.push(f.colour); if (f.eng!=='All') parts.push(f.eng); if (f.one) parts.push('1 owner'); if (f.fsh) parts.push('Full service history'); if (f.irish) parts.push('Irish supplied'); if (f.nct) parts.push('NCT to 2027+');
  s.textContent = parts.length ? parts.join(' · ') : 'All cars';
}

/* ---------- photo scrubber ---------- */
function scrub(car, cls=''){
  const tg = [car.owners===1?'1 owner':'', car.fullServiceHistory?'Full service history':''].filter(Boolean).join(' · ');
  const tags = cls==='tags' && tg ? `<span class="tags"><span>${tg}</span></span>` : '';
  return `<div class="scrub" data-scrub="${car.slug}"><img src="${small(car.photos[0])}" alt="${nm(car)} ${car.variant}" loading="lazy">${tags}</div>`;
}
const small = p => p.replace('.webp','-640.webp'), mid = p => p.replace('.webp','-960.webp');
const preloaded = new Set();
document.addEventListener('pointermove', e => {
  const s = e.target.closest && e.target.closest('[data-scrub]'); if (!s || e.pointerType==='touch') return;
  const car = bySlug(s.dataset.scrub);
  if (!preloaded.has(car.slug)){ preloaded.add(car.slug); car.photos.forEach(p=>{ const im=new Image(); im.src=small(p); }); }
  const r = s.getBoundingClientRect(), n = car.photos.length; const i = Math.max(0, Math.min(n-1, Math.floor((e.clientX - r.left) / r.width * n)));
  setScrub(s, car, i);
});
document.addEventListener('pointerout', e => { const s = e.target.closest && e.target.closest('[data-scrub]'); if (s && !s.contains(e.relatedTarget)) setScrub(s, bySlug(s.dataset.scrub), 0); });
function setScrub(s, car, i){ if (s.dataset.i == i) return; s.dataset.i = i; s.querySelector('img').src = small(car.photos[i]); }
let touchX = null;
document.addEventListener('touchstart', e => { const s = e.target.closest && e.target.closest('[data-scrub]'); if (s){ touchX = e.touches[0].clientX; s.classList.add('touched'); } }, {passive:true});
document.addEventListener('touchend', e => { const s = e.target.closest && e.target.closest('[data-scrub]'); if (!s || touchX===null) return; const dx = e.changedTouches[0].clientX - touchX; touchX = null; if (Math.abs(dx) < 30) return; const car = bySlug(s.dataset.scrub); const i = Math.max(0, Math.min(car.photos.length-1, (+s.dataset.i||0) + (dx<0?1:-1))); setScrub(s, car, i); }, {passive:true});

/* ---------- pages ---------- */
function passportLine(c){
  const nct = c.year>=2023 ? 'first NCT ' + c.nctValidTo : 'NCT to ' + c.nctValidTo;
  return `${c.owners} ${c.owners===1?'owner':'owners'} · ${nct}${c.fullServiceHistory?' · full service history':''}`;
}
// phones (760px and under) get the still frame instead of the 2 MB intro video
const PHONE_HERO = () => matchMedia('(max-width:760px)').matches;
function homeHTML(){
  const phoneHero = PHONE_HERO();
  const feat = CARS.filter(c=>c.featured).sort((a,b)=>a.featOrder-b.featOrder);
  const glc = bySlug('2022-mercedes-benz-glc-amg');
  const minM = Math.min(...CARS.map(c=>c.monthlyFrom));
  return `
  <section class="hero" id="hero" aria-label="Intro">
    ${phoneHero ? '<img class="poster" id="heroPoster" src="/media/hero-poster.webp" alt="" fetchpriority="high">' : '<video id="heroVid" muted playsinline preload="auto" src="/media/hero.mp4"></video><video id="heroLoop" muted playsinline loop preload="auto" src="/media/hero-loop.mp4" style="opacity:0"></video>'}
    <div class="dots"></div><div class="topfade"></div>
    <div class="copy"><div class="wrap"><h1 class="d hero-h" aria-label="Know where it's been."><span class="w" style="--i:0" aria-hidden="true">Know</span> <span class="w" style="--i:1" aria-hidden="true">where</span> <span class="w" style="--i:2" aria-hidden="true">it's</span> <span class="w" style="--i:3" aria-hidden="true">been.</span></h1></div></div>
    <div class="loader" id="loader" hidden><svg width="96" height="96" viewBox="0 0 132 132" role="img" aria-label="Loading"><circle cx="66" cy="66" r="54" fill="none" stroke="#3D4248" stroke-width="5"/><circle class="arc" cx="66" cy="66" r="54" fill="none" stroke="#E08A99" stroke-width="5" stroke-linecap="round" stroke-dasharray="339.3" stroke-dashoffset="339.3" transform="rotate(-90 66 66)"/><text x="66" y="74" text-anchor="middle" fill="#F2EEE8" style="font:600 24px 'IBM Plex Sans',sans-serif" id="loaderN">0</text></svg></div>
  </section>
  <section class="search wrap" aria-label="Search our stock">${finderHTML('home')}</section>

  <section class="drive stage" id="drive" style="margin-top:72px;border-radius:40px 40px 0 0" aria-labelledby="dh">
    <div class="wrap drive-head"><h2 class="d h2" id="dh">Every car comes with its passport.</h2></div>
    <div class="road-wrap" id="roadWrap">
      <div class="road" id="road"></div>
      <div class="stops" id="stops"></div>
      <div class="car" id="car"><div class="shadow"></div><div class="wheel" style="left:10.92%"><img src="/img/car-wheel.webp" alt="" class="wh"></div><div class="wheel" style="left:74.04%"><img src="/img/car-wheel.webp" alt="" class="wh"></div><div class="bob" id="bob"><img class="body" src="/img/car-body.webp" alt="Illustration of the Mercedes-Benz GLC from the film"><div class="tint" id="tint"></div></div></div>
      <div class="brand" id="brand">${markSVG('#F2EEE8',64,'')}<span>Midland Motors</span></div>
    </div>
    <div class="drive-cta" id="driveCta"><a class="btn btn-bone btn-lg" href="/cars/${glc.slug}/">See this car's full passport</a><button class="btn btn-line" data-replay>Replay</button></div>
  </section>

  <section class="sec" aria-labelledby="ws" style="padding-top:120px">
    <div class="wrap">
      <div class="sec-head"><h2 class="d h2" id="ws">This week's stock</h2><p class="muted" style="margin:0">Move across a photo to see the car from every side.</p></div>
      <div class="rows">${feat.map(c=>`
        <a class="row" href="/cars/${c.slug}/">${scrub(c)}
          <div class="meta"><div class="name">${nm(c)}</div><div class="muted">${c.variant} · ${c.colour}</div>
            <div class="chips"><span class="chip">${c.year}</span><span class="chip">${km(c.km)} km</span><span class="chip">${c.fuel}</span><span class="chip">${c.transmission}</span></div>
            <div class="small muted">${passportLine(c)}</div></div>
          <div class="price"><b>${eur(c.price)}</b><span class="muted">or ${eur(c.monthlyFrom)} a month</span><span class="go">${ARROW}</span></div>
        </a>`).join('')}</div>
      <div class="center"><a class="btn btn-ink btn-lg" href="/stock/">See all cars</a></div>
    </div>
  </section>

  <section class="sec" aria-labelledby="wk" style="padding-top:40px">
    <div class="wrap work">
      <div class="parallax" data-parallax><img src="/img/workshop.webp" alt="One of our mechanics checking the brakes of a car on the lift"></div>
      <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start">
        <span class="chip" style="color:var(--wine);border-color:transparent;background:var(--wine-tint)">Since 1987, Athlone</span>
        <h2 class="d h2" id="wk">We started as a repair garage.</h2>
        <p style="margin:0;max-width:460px">Fixing cars came first; selling them came later. Every car on our forecourt has been on our lift, and our mechanics sign off each one before it goes on sale.</p>
        <div class="figs" style="width:100%"><div class="fig"><b>112</b><span class="small muted">checks on every car</span></div><div class="fig"><b>39</b><span class="small muted">years on Dublin Road</span></div><div class="fig"><b>1</b><span class="small muted">family, the Kennys</span></div></div>
        <a class="btn btn-line" href="/certified/">See what we check</a>
      </div>
    </div>
  </section>

  <section class="wrap" aria-label="Finance and trade-in" style="padding-bottom:40px">
    <div class="band">
      <div><h2>Finance from <em>${eur(minM)}</em> a month.</h2><p class="muted" style="margin:0">Hire purchase over 60 months with a 10% deposit, APR 7.9%. See the cost before you talk to anyone.</p><a class="btn btn-wine" href="/finance/">Work out your payment</a></div>
      <div><h2>Value your car in <em>2</em> minutes.</h2><p class="muted" style="margin:0">Tell us the reg and the kilometres. We give you an estimate now and call within 2 hours with a firm offer.</p><button class="btn btn-wine" data-panel="tradein">Value your car</button></div>
    </div>
  </section>
  ${footerHTML()}`;
}

function stockHTML(){
  return `
  <div class="wrap pg-top"><h1 class="d h1">Every one inspected.</h1></div>
  <div class="wrap">${finderHTML('stock')}</div>
  <div class="fstrip" id="fstrip" aria-hidden="true"><div class="wrap fstrip-in"><span class="small muted">Filters</span><span id="fstripTxt" class="fstrip-txt"></span><button type="button" class="btn btn-line" data-edit-filters>Edit filters</button></div></div>
  <div class="wrap res-bar"><p class="muted" style="margin:0" id="count" aria-live="polite"></p><div style="width:260px">${combo('Sort by', ['Newest arrivals','Price, low to high','Price, high to low','Kilometres, lowest','Year, newest'], STATE.f.sort, 'white', v=>{STATE.f.sort=v;renderCards();})}</div></div>
  <section class="wrap" aria-label="Results" style="padding-bottom:120px"><div class="cards" id="cards"></div></section>
  ${footerHTML()}`;
}
const colourGroup = c => /white/i.test(c.colour) ? 'White' : /black/i.test(c.colour) ? 'Black' : 'Grey';
const engL = c => parseFloat(c.engine);
const engGroup = c => engL(c) <= 1.2 ? 'Up to 1.2 L' : engL(c) <= 1.6 ? '1.3 – 1.6 L' : '1.8 L and above';
function filtered(){
  const f = STATE.f;
  let list = CARS.filter(c => (!f.one || c.owners===1) && (!f.fsh || c.fullServiceHistory)
    && (!f.make || c.make===f.make) && (!f.model || c.model===f.model)
    && (f.fuel==='All' || c.fuel===f.fuel) && (f.gear==='All' || c.transmission===f.gear)
    && (f.kmF==null || c.km>=f.kmF) && (f.kmT==null || c.km<=f.kmT)
    && (f.yF==null || c.year>=f.yF) && (f.yT==null || c.year<=f.yT)
    && (f.body==='All' || c.body===f.body) && (f.colour==='All' || colourGroup(c)===f.colour) && (f.eng==='All' || engGroup(c)===f.eng)
    && (!f.irish || c.origin==='Irish supplied') && (!f.nct || +c.nctValidTo >= 2027));
  const val = c => f.monthly ? c.monthlyFrom : c.price;
  if (f.pF!=null) list = list.filter(c => val(c) >= f.pF);
  if (f.pT!=null) list = list.filter(c => val(c) <= f.pT);
  const s = f.sort;
  list.sort((a,b)=> s.startsWith('Price, low') ? a.price-b.price : s.startsWith('Price, high') ? b.price-a.price : s.startsWith('Kilo') ? a.km-b.km : s.startsWith('Year') ? b.year-a.year : (b.year*1e6-b.km) - (a.year*1e6-a.km));
  return list;
}
function cardHTML(c){
  const main = STATE.f.monthly ? eur(c.monthlyFrom)+'<span style="font-size:15px;font-weight:500"> a month</span>' : eur(c.price);
  const sec = STATE.f.monthly ? 'or ' + eur(c.price) : 'or ' + eur(c.monthlyFrom) + ' a month';
  return `<a class="card fade-in" href="/cars/${c.slug}/">${scrub(c,'tags')}<div class="cb-body"><div class="nm">${nm(c)}</div><div class="small muted">${c.variant}</div><div class="small muted">${c.year} · ${km(c.km)} km · ${c.fuel} · ${c.transmission}</div><div class="pr"><b>${main}</b><span class="small muted">${sec}</span></div></div></a>`;
}
function renderCards(){
  const list = filtered(); const el = $('#cards'); if (!el) return;
  el.innerHTML = list.length ? list.map(cardHTML).join('') : `<div class="empty"><h3 class="q" style="font-size:26px">No cars match those filters.</h3><p class="muted" style="margin:0">Try a wider budget or fewer options.</p><button class="btn btn-wine" data-clear>Clear all</button></div>`;
  $('#count').textContent = list.length === CARS.length ? "All cars" : `${list.length} ${list.length===1?'car matches':'cars match'}`;
}

function carHTML(c){
  const reps = c.inspection.zones.filter(z=>z.status==='repaired');
  const sim = CARS.filter(x=>x.slug!==c.slug && (x.body===c.body || Math.abs(x.price-c.price)<5000)).slice(0,3);
  const pass = c.passport;
  const counts = {owners:c.owners, services:pass.filter(p=>p.type==='service').length, ncts:pass.filter(p=>p.type==='nct').length, repairs:pass.filter(p=>p.type==='repair').length};
  return `
  <div class="wrap crumb"><a href="/stock/">Stock</a> / ${nm(c)}</div>
  <div class="wrap car-top">
    <div><div class="gal-main" data-zoom><img id="galMain" data-i="0" src="${mid(c.photos[0])}" fetchpriority="high" alt="${nm(c)}, front three-quarter view"></div>
      <div class="thumbs">${c.photos.map((p,i)=>`<button class="${i?'':'on'}" data-thumb="${i}" aria-label="Photo ${i+1} of ${c.photos.length}"><img src="${small(p)}" alt="" loading="lazy"></button>`).join('')}</div></div>
    <aside class="buybox">
      <div><h1 class="d" style="font-size:40px">${nm(c)}</h1><div class="muted" style="margin-top:6px">${c.variant} · ${c.colour} · ${c.body}</div></div>
      <div><div style="font:600 44px/1.1 var(--body)">${eur(c.price)}</div><div class="small muted">or ${eur(c.monthlyFrom)} a month over 60 months, 10% deposit</div></div>
      <button class="btn btn-wine btn-lg" data-panel="testdrive">Book a test drive</button>
      <button class="btn btn-line btn-lg" data-concept="reserve">Reserve for €200</button>
      <div class="small muted" style="margin-top:-6px;text-align:center">Refundable. We hold the car for you for 7 days.</div>
      <div class="kv"><span class="muted">Registration</span><span>${c.registration}</span><span class="muted">Owners</span><span>${c.owners}, ${c.owners===1?'verified':'both verified'}</span><span class="muted">Origin</span><span>${c.origin}</span><span class="muted">NCT</span><span>Valid to ${c.nctValidTo}</span><span class="muted">Inspection</span><span style="color:var(--wine);font-weight:600">112 of 112 passed</span></div>
    </aside>
  </div>
  <div class="wrap facts">${[['Year',c.year],['Kilometres',km(c.km)],['Fuel',c.fuel],['Gearbox',c.transmission],['Engine',c.engine],['Motor tax',eur(c.motorTax)+'/yr']].map(([k,v])=>`<div><span class="small muted">${k}</span><b>${v}</b></div>`).join('')}</div>

  <section class="insp stage" aria-labelledby="insp" style="border-radius:40px">
    <div class="wrap">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap">
        <div style="display:flex;flex-direction:column;gap:12px;max-width:620px"><h2 class="d h2" id="insp">What our workshop found.</h2><p class="muted" style="margin:0">Our mechanics checked this car in October 2026. Touch any part of the car to see what we found. Anything repaired or replaced is marked in light stone, and it still passed.</p></div>
        <div style="display:flex;align-items:center;gap:18px"><svg width="128" height="128" viewBox="0 0 132 132" role="img" aria-label="112 of 112 checks passed"><circle cx="66" cy="66" r="54" fill="none" stroke="#3D4248" stroke-width="7"/><circle class="dial-arc" id="dial" cx="66" cy="66" r="54" fill="none" stroke="#86A57F" stroke-width="7" stroke-linecap="round" stroke-dasharray="339.3" stroke-dashoffset="339.3" transform="rotate(-90 66 66)"/><text x="66" y="70" text-anchor="middle" fill="#F2EEE8" style="font:600 30px 'IBM Plex Sans',sans-serif">112</text><text x="66" y="90" text-anchor="middle" fill="#B9BBBD" style="font:500 11px 'IBM Plex Sans',sans-serif">of 112 passed</text></svg>
          <div class="small muted" style="max-width:150px">${reps.length ? reps.length + ' item' + (reps.length>1?'s':'') + ' repaired or replaced, all passed' : 'Nothing needed repairing'}</div></div>
      </div>
      <div class="insp-grid">
        <div class="iso-box">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div class="legend"><span><i class="dot" style="background:var(--pass)"></i>Passed</span><span><i class="dot" style="background:var(--rep)"></i>Repaired or replaced, passed</span></div><button class="btn btn-line" style="--h:42px;padding:0 18px;font-size:14px" data-flip>Show right side</button></div>
          <div class="iso-flip" id="isoFlip"><svg class="iso" id="iso" viewBox="-20 -40 1423 610" role="img" aria-label="Inspection diagram of the car" style="width:100%;height:auto;overflow:visible"></svg></div>
          <div class="small muted" style="text-align:center" id="sideNote"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="zone-card" aria-live="polite" id="zoneCard"></div>
          <div class="zgrid" id="zgrid"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="wrap" aria-labelledby="pass" data-stack style="padding-block:120px 0;display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:56px">
    <div style="display:flex;flex-direction:column;gap:16px"><h2 class="d h2" id="pass">The full passport.</h2><p class="muted" style="margin:0">Everything on record for ${c.registration}, from its first registration to our inspection. We check owners against the national vehicle file and services against stamps and invoices.</p>
      <div class="chips"><span class="chip">${pass.length} entries</span><span class="chip">${counts.owners} ${counts.owners===1?'owner':'owners'}</span><span class="chip">${counts.services} services</span><span class="chip">${counts.ncts} NCT${counts.ncts===1?'':'s'}</span><span class="chip">${counts.repairs} repair${counts.repairs===1?'':'s'}</span></div></div>
    <div class="pp">${pass.map((e,i)=>`<div class="small" style="font-weight:600;color:var(--wine);padding:3px 0 24px">${ym(e.date)}</div><div class="ln"><span class="nd ${e.type==='repair'?'rep':''} ${i===pass.length-1?'fin':''}"></span></div><div style="padding-bottom:24px"><div style="font-weight:600">${e.title}</div><div class="small muted">${e.detail}</div></div>`).join('')}</div>
  </section>

  <section class="wrap" style="padding-top:100px" aria-labelledby="fin">
    <div class="calc">
      <div style="display:flex;flex-direction:column;gap:26px"><h2 class="d" style="font-size:40px" id="fin">Pay for this car monthly.</h2>
        <div><label for="dep" style="display:flex;justify-content:space-between;font-weight:600"><span>Deposit</span><span id="depL"></span></label><input id="dep" type="range" min="0" max="${Math.round(c.price*0.5/500)*500}" step="500" value="${Math.round(c.price*0.1/100)*100}"></div>
        <div><span style="font-weight:600">Months</span><div class="pills" style="margin-top:10px" id="terms">${[24,36,48,60].map(n=>`<button class="pill ${n===60?'on':''}" data-n="${n}">${n}</button>`).join('')}</div></div></div>
      <div style="display:flex;flex-direction:column;gap:8px;justify-content:center"><span style="font-weight:600">Monthly payment</span><div style="font:600 76px/1 var(--body)" id="mon"></div><div class="muted" id="monNote"></div><div class="small muted" style="margin-top:10px">Hire purchase, APR 7.9%. Subject to status. Midland Motors is a credit intermediary. Concept site, not a real offer.</div></div>
    </div>
  </section>

  <section class="wrap" style="padding-block:110px 40px" aria-labelledby="sim"><h2 class="d" style="font-size:36px;margin-bottom:28px" id="sim">Similar cars on our forecourt</h2><div class="cards">${sim.map(cardHTML).join('')}</div></section>
  ${footerHTML()}`;
}

function certifiedHTML(){
  const R = SITE.rejected.reasons; const mx = Math.max(...R.map(r=>r[1]));
  return `
  <div class="wrap" data-stack style="padding-block:150px 80px;display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr);gap:40px;align-items:center">
    <div style="display:flex;flex-direction:column;gap:26px"><h1 class="d" style="font-size:clamp(44px,5.4vw,80px)">If our workshop wouldn't pass it, we don't sell it.</h1><p style="margin:0;max-width:600px;font-size:19px">Every car on our forecourt goes through the same 112 checks on our own lift, by the mechanics who service cars for half of Athlone. If a part needs replacing, we replace it and write it down. If a car fails, it goes back to auction.</p></div>
    <div style="display:grid;place-items:center"><div style="width:260px;height:260px;border-radius:50%;background:var(--surface);display:grid;place-items:center;box-shadow:0 20px 60px rgba(20,20,22,.08)">${markSVG('#8C2B3C',150,'Midland Certified')}</div></div>
  </div>
  <section class="wrap" data-stack style="display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:40px;padding-bottom:110px"><span class="chip" style="color:var(--wine);border-color:transparent;background:var(--wine-tint);align-self:start;justify-self:start">Since 1987, Athlone</span>
    <div style="display:flex;flex-direction:column;gap:18px"><h2 class="d h2">A repair garage first.</h2><p style="margin:0;max-width:680px">Tom Kenny opened the garage on Dublin Road in 1987 to fix cars, not to sell them. His daughter Aoife started selling the cars customers traded in, and she kept the rule he gave her: nothing leaves the forecourt that hasn't been on the lift. Today the workshop still services more cars than we sell, and the people who check our stock are the same people who fix it.</p></div></section>
  <section class="wrap" aria-labelledby="chk" style="padding-bottom:110px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:28px"><h2 class="d h2" id="chk">The 112 checks.</h2><p class="muted" style="margin:0;max-width:420px">Grouped the way our mechanics work through a car. Every car's results are on its own page, part by part.</p></div>
    ${D.checklist.map((g,i)=>`<div class="acc ${i===0?'open':''}"><button class="acc-h" aria-expanded="${i===0}" data-acc><span class="n">${g.items.length}</span><span class="t">${g.group}</span><span class="pm"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1V13M1 7H13" stroke="#1C1E21" stroke-width="1.8" stroke-linecap="round"/></svg></span></button><div class="acc-b"><div><ul>${g.items.map(it=>`<li>${it}</li>`).join('')}</ul></div></div></div>`).join('')}
  </section>
  <section class="wrap" aria-labelledby="rej" data-stack style="display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:56px;padding-bottom:110px">
    <div style="display:flex;flex-direction:column;gap:18px"><h2 class="d h2" id="rej">What we turn down.</h2><p style="margin:0">In 2025 we looked at <b>${SITE.rejected.looked}</b> cars to buy for the forecourt and said no to <b style="color:var(--wine)">${SITE.rejected.turnedDown}</b> of them. These were the reasons.</p></div>
    <div style="display:flex;flex-direction:column;gap:22px" id="bars">${R.map(r=>`<div class="bar-row"><span>${r[0]}</span><span style="font:600 22px var(--body);text-align:right">${r[1]}</span><div class="tr"><i data-w="${(r[1]/mx*100).toFixed(1)}%"></i></div></div>`).join('')}<div class="small muted">Some cars had more than one reason; each is counted once, under the main one.</div></div>
  </section>
  <section class="wrap" aria-labelledby="war" style="padding-bottom:60px"><h2 class="d h2" id="war" style="margin-bottom:28px">What comes with every car.</h2>
    <div class="warranty"><div><b>12</b><div style="font-weight:600">months warranty</div><div class="small muted">Parts and labour, in our own workshop.</div></div><div><b>12</b><div style="font-weight:600">months breakdown cover</div><div class="small muted">Anywhere in Ireland.</div></div><div><b>14</b><div style="font-weight:600">day exchange</div><div class="small muted">If the car isn't right for you.</div></div><div><b>1,000</b><div style="font-weight:600">km check-up</div><div class="small muted">Free, in our workshop.</div></div></div>
    <div style="display:flex;gap:12px;margin-top:32px;flex-wrap:wrap"><a class="btn btn-wine btn-lg" href="/stock/">See our stock</a><button class="btn btn-line btn-lg" data-panel="testdrive">Book a test drive</button></div></section>
  ${footerHTML()}`;
}

function financeHTML(){
  return `
  <div class="wrap" style="padding-block:150px 40px"><div style="display:flex;flex-direction:column;gap:18px;max-width:900px"><h1 class="d h1">Know the monthly cost before you visit.</h1><p class="muted" style="margin:0">Hire purchase through our lending partner. Move the sliders; the numbers are worked out the same way the lender does it.</p></div></div>
  <section class="wrap"><div class="calc" id="fcalc">
    <div style="display:flex;flex-direction:column;gap:28px">
      <div><label for="fp" style="display:flex;justify-content:space-between;font-weight:600"><span>Car price</span><span id="fpL"></span></label><input id="fp" type="range" min="15000" max="50000" step="500" value="24995"></div>
      <div><label for="fd" style="display:flex;justify-content:space-between;font-weight:600"><span>Deposit</span><span id="fdL"></span></label><input id="fd" type="range" min="0" max="15000" step="250" value="2500"><div class="small muted" style="margin-top:6px">A trade-in counts towards your deposit.</div></div>
      <div><span style="font-weight:600">Months</span><div class="pills" style="margin-top:10px" id="fterms">${[24,36,48,60].map(n=>`<button class="pill ${n===60?'on':''}" data-n="${n}">${n}</button>`).join('')}</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;justify-content:center">
      <span style="font-weight:600">You would pay</span><div style="font:600 84px/1 var(--body)" id="fm"></div><div id="fmn"></div>
      <div style="display:grid;grid-template-columns:1fr auto;gap:4px 16px;font-size:15px;border-top:1px solid rgba(242,238,232,.25);padding-top:14px;margin-top:8px" id="fbreak"></div>
      <a class="btn btn-bone" style="margin-top:14px;align-self:flex-start" href="/stock/" data-monthly-go id="fgo"></a>
    </div></div>
    <p class="small muted" style="max-width:900px;margin:22px 0 0">${SITE.finance.representative}</p>
    <div data-stack style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:56px 0 40px">${[['What you need','Driving licence, proof of address and three months of bank statements.'],['How long it takes','Most decisions come back the same day. You can drive away once the paperwork is signed.'],['Paying it off early','You can settle at any time. You only pay interest up to the day you settle.']].map(([t,p])=>`<div style="background:var(--surface);border-radius:26px;padding:26px"><h2 style="font:600 20px var(--body);margin:0 0 8px">${t}</h2><p class="small muted" style="margin:0">${p}</p></div>`).join('')}</div>
  </section>${footerHTML()}`;
}

/* ---------- state + router ---------- */
const STATE = { f:{monthly:false,fsh:false,one:false,irish:false,nct:false,make:'',model:'',kmF:null,kmT:null,pF:null,pT:null,yF:null,yT:null,fuel:'All',gear:'All',body:'All',colour:'All',eng:'All',sort:'Newest arrivals'}, page:null, car:null };
function route(){
  const p = location.pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  let page = 'home', slug = null;
  if (p.startsWith('cars/')){ slug = p.slice(5); page = bySlug(slug) ? 'car' : 'notfound'; }
  else if (['stock','certified','finance','privacy'].includes(p)) page = p;
  else if (p !== '') page = 'notfound';
  render(page, slug);
}
function navigate(url){ history.pushState({}, '', url); route(); }
function privacyHTML(){
  return `<section class="wrap" style="padding:150px 0 90px;max-width:760px"><h1 class="d" style="font-size:clamp(40px,5vw,64px)">Privacy.</h1>
  <p class="muted" style="font-size:18px;margin-top:24px">Midland Motors is a concept site. Nothing you type into a form leaves your browser, and we set no cookies and run no analytics. The cars, prices and people are fictional.</p>
  <p style="margin-top:32px"><a class="btn btn-ink" href="/">Back to home</a></p></section>${footerHTML()}`;
}
function notFoundHTML(){
  return `<section class="wrap" style="padding:170px 0 110px"><h1 class="d" style="font-size:clamp(40px,5vw,72px)">This page isn't in our stock.</h1>
  <p class="muted" style="font-size:18px;margin-top:20px">Try one of these instead.</p>
  <div style="display:flex;gap:12px;margin-top:32px;flex-wrap:wrap"><a class="btn btn-wine btn-lg" href="/stock/">See our stock</a><a class="btn btn-line btn-lg" href="/">Home</a></div></section>${footerHTML()}`;
}
function render(page, slug){
  const sc = $('#fscrim'); if (sc) sc.classList.remove('on');
  closeAllCb(); stopDrive();
  const root = $('#root');
  root.innerHTML = page==='home' ? homeHTML() : page==='stock' ? stockHTML() : page==='car' ? carHTML(bySlug(slug)) : page==='certified' ? certifiedHTML() : page==='privacy' ? privacyHTML() : page==='notfound' ? notFoundHTML() : financeHTML();
  STATE.page = page; STATE.car = slug;
  document.title = page==='car' ? nm(bySlug(slug)) + ' · Midland Motors' : 'Midland Motors · ' + ({home:"Know where it's been.",stock:'Stock',certified:'Midland Certified',finance:'Finance',privacy:'Privacy',notfound:'Page not found'})[page];
  $('#hdr').hidden = page!=='home';
  $$('.bar .nav a').forEach(a=>a.classList.toggle('cur', a.dataset.nav===page));
  window.scrollTo({top:0, behavior:'instant'});
  onScroll();
  liveOpen();
  if (page==='home') initHome();
  if (page==='stock' || page==='home') onFilter();
  if (page==='car') initCar(bySlug(slug));
  if (page==='certified') initCertified();
  if (page==='finance') initFinance();
  observeFooter();
}
window.addEventListener('popstate', route);
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="/"]'); if (!a || a.target || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault(); if (typeof setMenu === 'function' && $('#mnav') && !$('#mnav').hidden) setMenu(false);
  if (a.pathname === location.pathname && !a.search) { window.scrollTo({top:0, behavior: reduce?'auto':'smooth'}); return; }
  navigate(a.pathname);
});

/* ---------- scroll: bar, sticky button, parallax ---------- */
function onScroll(){
  const y = window.scrollY;
  const heroH = STATE.page==='home' ? ($('#hero')?.offsetHeight || 600) - 90 : -1;
  $('#bar').classList.toggle('show', y > heroH);
  const par = $('[data-parallax] img');
  if (par){ const r = par.parentElement.getBoundingClientRect(); const p = (r.top + r.height/2 - innerHeight/2) / innerHeight; const rg = r.height*0.18; par.style.transform = `translateY(${Math.max(-rg,Math.min(rg,-p/0.7*rg)).toFixed(1)}px)`; }
  const fs = $('#fstrip'), fd = $('.finder'); if (fs && fd){ const on = fd.getBoundingClientRect().bottom < 80; fs.classList.toggle('show', on); fs.setAttribute('aria-hidden', !on); }
  const bars = $('#bars'); if (bars && !bars.dataset.done && bars.getBoundingClientRect().top < innerHeight*0.8){ bars.dataset.done=1; $$('i[data-w]', bars).forEach(i=>i.style.width=i.dataset.w); }
  const dial = $('#dial'); if (dial && !dial.dataset.done && dial.getBoundingClientRect().top < innerHeight*0.85){ dial.dataset.done=1; dial.style.strokeDashoffset = 0; }
  stickyTD();
}
window.addEventListener('scroll', onScroll, {passive:true});
let footVisible = false, footObs = null;
const TOUCH_UI = matchMedia('(max-width:1100px)');
function observeFooter(){
  if (footObs) footObs.disconnect();
  const f = $('[data-visit]'); if (!f) return;
  footObs = new IntersectionObserver(es => { footVisible = es[0].isIntersecting; stickyTD(); }, {rootMargin:'0px 0px -35% 0px'});
  footObs.observe(f);
}
function stickyTD(){
  const s = $('#stickyTD'); if (!s) return;
  let show = false;
  if (STATE.page==='home'){ const rows = $('.rows'); show = rows && rows.getBoundingClientRect().bottom < innerHeight*0.6; }
  else if (STATE.page==='car'){ const bb = $('.buybox'); show = bb ? bb.getBoundingClientRect().bottom < 0 : window.scrollY > 500; }
  else show = window.scrollY > 500;
  // Touch sizes: the button is a bottom bar there, and flying it onto the footer button lands in the wrong place while
  // momentum-scrolling, so it simply hides once the footer (with its own test-drive button) is on screen.
  if (footVisible && show && TOUCH_UI.matches){ s.classList.remove('show'); return; }
  if (footVisible && show){
    // morph into footer button
    const target = $('.foot-td'); const b = s.querySelector('.btn');
    if (target && !s.classList.contains('morphed')){
      const tr = target.getBoundingClientRect(), br = b.getBoundingClientRect();
      s.classList.add('morph','morphed');
      s.style.transform = `translate(${tr.left - br.left}px, ${tr.top - br.top}px)`;
      b.style.minWidth = tr.width + 'px';
      target.style.visibility = 'hidden';
      setTimeout(()=>{ if (s.classList.contains('morphed')){ target.style.visibility = ''; s.style.opacity = 0; } }, 560);
    }
    return;
  }
  if (s.classList.contains('morphed')){ s.classList.remove('morphed'); s.style.transform=''; s.style.opacity=''; s.querySelector('.btn').style.minWidth=''; setTimeout(()=>s.classList.remove('morph'), 600); const t=$('.foot-td'); if (t) t.style.visibility=''; }
  s.classList.toggle('show', !!show);
}

/* ---------- home: hero + drive ---------- */
const HEADLIGHTS = 2.8;
function initHome(){
  const v = $('#heroVid'), hero = $('#hero');
  if (!v){ // phone: still frame, title and scene start at once
    hero.classList.add('lit');
    const io0 = new IntersectionObserver(es => { if (es[0].isIntersecting){ io0.disconnect(); startDrive(); } }, {threshold:.45});
    io0.observe($('#drive'));
    return;
  }
  let first = true; try { first = !sessionStorage.getItem('mm-seen'); sessionStorage.setItem('mm-seen','1'); } catch(e){}
  // after the intro ends, a seamless still-camera loop (headlights on, ambient life) takes over
  const lv = $('#heroLoop');
  // the loop starts underneath the intro's last frame and is only revealed once it has painted a frame of its own: no jump, no black
  const toLoop = () => {
    if (!lv) return;
    lv.currentTime = 0;
    const show = () => { lv.style.opacity = '1'; };
    const go = () => { let done = false; const f = () => { if (!done){ done = true; show(); } }; if (lv.requestVideoFrameCallback) lv.requestVideoFrameCallback(f); setTimeout(f, 250); };
    lv.play().then(go).catch(show);
  };
  if (reduce){ v.removeAttribute('autoplay'); v.addEventListener('loadeddata', ()=>{ v.currentTime = v.duration ? v.duration - 0.05 : 8.9; }, {once:true}); hero.classList.add('lit'); return; }
  const loader = $('#loader');
  if (first){
    loader.hidden = false; const t0 = performance.now(); let n = 0;
    const arc = loader.querySelector('.arc'), num = $('#loaderN');
    const tick = () => {
      const ready = v.readyState >= 3; const el = performance.now() - t0;
      const target = ready ? 100 : Math.min(92, el/10);
      n += (target - n) * 0.25; if (ready && el > 450 && n > 98.5) n = 100;
      arc.style.strokeDashoffset = 339.3 * (1 - n/100); num.textContent = Math.round(n);
      if (n >= 100 || el > 1000){ arc.style.strokeDashoffset = 0; num.textContent = 100; loader.classList.add('gone'); setTimeout(()=>loader.hidden=true, 400); v.play().catch(()=>{}); }
      else setTimeout(tick, 16);
    }; tick();
  } else v.play().catch(()=>{});
  v.addEventListener('timeupdate', () => { if (v.currentTime >= HEADLIGHTS) hero.classList.add('lit'); });
  v.addEventListener('ended', () => { hero.classList.add('lit'); toLoop(); });
  setTimeout(()=>{ if (v.paused && v.currentTime===0) hero.classList.add('lit'); }, 4000);
  // drive starts when stage enters view
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); startDrive(); } }, {threshold:.45});
  io.observe($('#drive'));
}
const STOPS = () => { const c = bySlug('2022-mercedes-benz-glc-amg'), P = c.passport;
  const reg = P.find(p=>p.type==='registration'), svc = P.filter(p=>p.type==='service'), nct = P.find(p=>p.type==='nct');
  const allMain = svc.every(p=>/main dealer/i.test(p.detail||''));
  return [[ym(reg.date), 'First registered in Westmeath'],
    [reg.date.slice(0,4)+' – 2026', c.owners===1 ? '1 owner, verified' : c.owners+' owners, verified'],
    [svc[0].date.slice(0,4)+' – '+svc[svc.length-1].date.slice(0,4), `${svc.length} services${allMain?', all main dealer':', stamped and invoiced'}`],
    [ym(nct.date), 'First NCT passed'],
    ['Oct 2026', 'Midland inspection, 112 of 112']]; };
function gravelTile(){
  // Road surface above the kerb line: scattered gravel, smaller and fainter towards the far side (top).
  let s = 1987; const rnd = () => (s = (s*16807) % 2147483647) / 2147483647;
  let d = ''; for (let i=0;i<280;i++){ const depth = Math.pow(rnd(), .8), y = 3 + depth*47, x = rnd()*1600;
    const r = (.8 + depth*1.9) * (.7 + rnd()*.6), o = (.14 + depth*.38 + rnd()*.12).toFixed(2);
    d += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r*1.25).toFixed(2)}" ry="${r.toFixed(2)}" fill="#F2EEE8" fill-opacity="${o}"/>`; }
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='54'>${d}</svg>`)}")`;
}
let driveRAF = null, driveRun = 0;
function stopDrive(){ if (driveRAF) cancelAnimationFrame(driveRAF); driveRAF = null; }
function startDrive(){
  stopDrive();
  const wrap = $('#roadWrap'); if (!wrap) return;
  const car = $('#car'), bob = $('#bob'), wheels = $$('.wh', car), stopsEl = $('#stops'), tint = $('#tint'), brand = $('#brand'), cta = $('#driveCta'), road = $('#road');
  road.style.backgroundImage = gravelTile();
  const W = wrap.clientWidth, carW = car.clientWidth, wheelR = carW*0.182/2;
  const carX = Math.round((W < 760 ? 0.5 : 0.40)*W - carW/2), centreX = carX + carW/2;
  const ring = brand.querySelector('.mk-ring'); brand.style.setProperty('--len', ring.getTotalLength());
  brand.classList.remove('draw'); const narrow = W < 760; brand.classList.toggle('narrow', narrow); brand.style.left = narrow ? '50%' : (carX + carW + Math.max(36, W*0.035)) + 'px';
  tint.className = 'tint'; tint.style.cssText = ''; cta.classList.remove('show');
  const S = STOPS(), last = S.length-1;
  stopsEl.innerHTML = S.map((s,i)=>`<div class="stop ${i===last?'last':''}"><div class="node"></div></div>`).join('');
  const stopEls = $$('.stop', stopsEl);
  // Wide screens: the lower area is divided into equal columns, one per stage. The text of a stage fades in inside its own
  // column when the car reaches that stage's dot; only the dots travel.
  const run = ++driveRun;
  let cols = $('#cols'); if (cols) cols.remove();
  cols = document.createElement('div'); cols.id = 'cols'; cols.className = 'cols'; cols.style.setProperty('--n', S.length);
  cols.innerHTML = S.map((s,i)=>`<div class="col ${i===last?'last':''}"><span class="dt">${s[0]}</span><span class="tt">${s[1]}</span></div>`).join('');
  if (!narrow) wrap.appendChild(cols);
  const colEls = $$('.col', cols), shown = S.map(()=>false);
  // Phones (the scene's own "narrow" layout, under 760px): a stop label crossing a 390px screen at road speed is on
  // screen for under two seconds and can't be read, so the stops are listed under the road instead, all of them,
  // while the car still drives in and parks. Desktop and tablet keep the travelling stops.
  let list = $('#driveList');
  if (narrow){
    if (!list){ list = document.createElement('ol'); list.id = 'driveList'; list.className = 'drive-list'; wrap.after(list); }
    list.innerHTML = S.map((s,i)=>`<li class="${i===last?'last':''}" style="--i:${i}"><span class="dt">${s[0]}</span><span class="tt">${s[1]}</span></li>`).join('');
    list.classList.remove('run'); void list.offsetWidth; list.classList.add('run');
  } else if (list) list.remove();
  if (reduce){
    car.style.transform = `translateX(${carX}px)`; stopEls.forEach((e,i)=>{ e.style.transform = `translateX(${i===last?centreX:-600}px)`; e.style.opacity = i===last?1:0; });
    colEls.forEach(c => c.classList.add('on')); brand.classList.add('draw'); cta.classList.add('show'); return;
  }
  // One road: the gravel and the history stops travel together, at one speed, entering off the right edge and leaving off the left.
  const V = Math.max(300, W*0.25);                     // px/s: the car (gravel and wheels), unchanged
  const Vm = narrow ? V : V*1.3;                       // px/s: the dots run a little faster than the road
  const kRoad = V/Vm;
  const ENTER = 0.9, startX = W + 40, GAP = narrow ? W + 260 : Vm*2.8; // about 2.8 s between one dot reaching the car and the next
  const restX = centreX, DEC = 1.7;
  const spawnP = S.map((_,i)=> Vm*0.5 + i*GAP);         // dot position at which stop i appears at startX
  // narrow: no travelling stops, so a short drive (about a second at speed, then the same ease to a halt)
  const pStop = narrow ? V*(1 + DEC/2) : spawnP[last] + (startX - restX); // position where the last dot rests under the car
  const tDec = (pStop - Vm*DEC/2)/Vm, tStop = tDec + DEC; // constant speed, then ease to a halt landing exactly on pStop
  const posAt = t => t<=tDec ? Vm*t : t<=tStop ? Vm*tDec + Vm*((t-tDec) - (t-tDec)**2/(2*DEC)) : pStop;
  const vAt = t => t<tDec ? Vm : t<tStop ? Vm*(1-(t-tDec)/DEC) : 0;
  let t0 = null, rot = 0, lastT = 0, done = false;
  const step = now => {
    if (t0===null) t0 = now; const t = (now - t0)/1000, dt = Math.min(.05, t - lastT); lastT = t;
    const p = posAt(t), v = vAt(t);
    road.style.backgroundPosition = `${(-p*kRoad).toFixed(1)}px 0`;
    const k = Math.min(1, t/ENTER), e = 1 - Math.pow(1-k, 3);
    car.style.transform = `translateX(${(-carW - 60 + (carX + carW + 60)*e).toFixed(1)}px)`;
    rot += v * kRoad * dt / wheelR * 180/Math.PI;
    const bl = (v*kRoad/V*0.5).toFixed(2);                    // light motion blur on the spinning wheels hides the strobing highlight
    wheels.forEach(w => { w.style.transform = `rotate(${rot.toFixed(2)}deg)`; w.style.filter = v>2 ? `blur(${bl}px)` : 'none'; });
    bob.style.transform = `translateY(${(v>5 ? Math.sin(t*7.5)*0.8 + Math.sin(t*2.3)*0.5 : 0).toFixed(2)}px)`;
    stopEls.forEach((el,i) => {
      const x = startX - (p - spawnP[i]);
      el.style.opacity = (x > W + 140 || x < -160) ? 0 : 1;
      el.style.transform = `translateX(${x.toFixed(1)}px)`;
      if (!narrow && !shown[i] && x <= centreX + 16){ shown[i] = true; colEls[i].classList.add('on'); }
    });
    if (t > tStop + 0.1 && !done){ done = true; if (narrow) finish(); else {
      // everything shown: hold, let all the texts leave together, then the scan, the brand and the buttons as before
      setTimeout(()=>{ if (run !== driveRun) return; cols.classList.add('out'); setTimeout(()=>{ if (run === driveRun) finish(); }, 800); }, 2800);
    } }
    if (t < tStop + 0.4) driveRAF = requestAnimationFrame(step);
  };
  function finish(){
    tint.style.transition = 'background-position 1.6s cubic-bezier(.65,0,.35,1), opacity .3s';
    tint.style.opacity = 1; requestAnimationFrame(()=> tint.style.backgroundPosition = '-40% 0');
    setTimeout(()=>{ tint.style.transition = 'opacity .6s'; tint.style.opacity = 0; }, 1650);
    setTimeout(()=> brand.classList.add('draw'), 900);
    setTimeout(()=> cta.classList.add('show'), narrow ? 700 : 2300); // phones: the short run ends sooner, so the buttons follow sooner
  }
  driveRAF = requestAnimationFrame(step);
}

/* ---------- car page ---------- */
/* Inspection diagram: the same side-view illustration as the passport scene, split into the 12 inspected zones.
   The selected zone is cut out of the picture, tinted (green = passed, stone = repaired) and lifted off the body. */
const ZP = {rear:'M20 175 L40 120 L100 70 L150 40 L205 30 L172 132 L312 142 L318 175 L318 250 L345 290 L400 370 L400 433 L140 433 L20 400 L0 330 L5 230 Z',doorRL:'M318 142 L612 148 L622 240 L630 433 L400 433 L400 370 L345 290 L318 250 Z',doorFL:'M612 148 L905 160 L948 200 L955 433 L630 433 L622 240 Z',cabin:'M172 132 L205 38 L600 26 L765 36 L860 110 L905 160 L612 148 L318 142 Z',roof:'M150 40 L215 18 L400 6 L600 2 L760 12 L805 30 L765 36 L600 26 L205 38 Z',engine:'M905 160 L948 150 L1000 150 L1150 175 L1300 212 L1250 232 L1255 300 L1265 433 L955 433 L948 200 Z',front:'M1250 205 L1340 222 L1383 255 L1383 400 L1340 433 L1265 433 L1255 300 L1250 232 Z',windscreen:'M765 36 L805 30 L862 74 L932 138 L966 155 L948 163 L905 162 L860 110 Z',wheelsR:'M 151 398 a 126 126 0 1 0 252 0 a 126 126 0 1 0 -252 0 Z',wheelsF:'M 1017 398 a 126 126 0 1 0 252 0 a 126 126 0 1 0 -252 0 Z'};
const ZMK = {rear:[110,250],doorRL:[470,265],doorFL:[785,270],cabin:[470,92],roof:[480,16],windscreen:[880,108],engine:[1100,232],front:[1325,320],wheelsR:[277,398],wheelsF:[1143,398]};
const tintM = (r,g,b,k) => [r,g,b].map(c => `${(.2126*c*k).toFixed(3)} ${(.7152*c*k).toFixed(3)} ${(.0722*c*k).toFixed(3)} 0 0`).join(' ') + ' 0 0 0 1 0';
function initCar(c){
  let side = 'L', sel = null, hov = null;
  const zones = c.inspection.zones, byId = Object.fromEntries(zones.map(z=>[z.id,z]));
  sel = (zones.find(z=>z.status==='repaired') || byId.engine).id;
  if (sel==='doorFR'||sel==='doorRR') side='R';
  const svg = $('#iso');
  const toSrc = z => ({doorFR:'doorFL',doorRR:'doorRL'})[z] || z;                 // right-side ids reuse the left geometry, mirrored
  const visible = id => side==='L' ? !['doorFR','doorRR'].includes(id) : !['doorFL','doorRL'].includes(id);
  const ids = () => zones.map(z=>z.id).filter(visible);
  function draw(){
    const mir = side==='R' ? 'transform="translate(1383 0) scale(-1 1)"' : '';
    const reps = zones.filter(z=>z.status==='repaired' && visible(z.id));
    svg.innerHTML = `<defs>
        <g id="carImg"><image href="/img/car-body.webp" width="1383" height="433"/><image href="/img/car-wheel.webp" x="151" y="272" width="252" height="252"/><image href="/img/car-wheel.webp" x="1017" y="272" width="252" height="252"/></g>
        <filter id="fBase"><feColorMatrix type="matrix" values="${tintM(.86,.9,.95,.62)}"/></filter>
        <filter id="fPass" x="-5%" y="-5%" width="110%" height="125%"><feColorMatrix type="matrix" values="${tintM(.58,.78,.55,1.75)}"/></filter>
        <filter id="fRep" x="-5%" y="-5%" width="110%" height="125%"><feColorMatrix type="matrix" values="${tintM(.98,.9,.78,1.9)}"/></filter>
        <filter id="fRepSoft"><feColorMatrix type="matrix" values="${tintM(.98,.9,.78,1.2)}"/></filter>
        <filter id="fLift" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="9" flood-color="#000" flood-opacity=".55"/></filter>
        ${ids().map(id=>`<mask id="cp-${id}" maskUnits="userSpaceOnUse" x="-40" y="-60" width="1463" height="650"><path fill="#fff" d="${ZP[toSrc(id)]}"/>${/^wheels/.test(id)?'':`<path fill="#000" d="${ZP.wheelsR} ${ZP.wheelsF}"/>`}</mask>`).join('')}
      </defs>
      <ellipse cx="700" cy="528" rx="640" ry="22" fill="#000" opacity=".35"/>
      <g ${mir}>
        <use href="#carImg" filter="url(#fBase)"/>
        ${reps.map(z=>`<g mask="url(#cp-${z.id})" class="repsoft" data-rep="${z.id}"><use href="#carImg" filter="url(#fRepSoft)"/></g>`).join('')}
        <g id="isoSel"></g>
        ${ids().map(id=>`<path class="hit" data-z="${id}" d="${ZP[toSrc(id)]}"/>`).join('')}
        ${reps.map(z=>{ const m = ZMK[toSrc(z.id)]; return m ? `<circle class="mk" cx="${m[0]}" cy="${m[1]}" r="11"/>` : ''; }).join('')}
      </g>`;
    paint();
    const other = zones.filter(z=>z.status==='repaired' && !visible(z.id));
    $('#sideNote').textContent = (side==='L'?'Left side.':'Right side.') + (other.length ? ` ${other.length} more repair${other.length>1?'s':''} on the ${side==='L'?'right':'left'} side.` : '');
    $('[data-flip]').textContent = side==='L' ? 'Show right side' : 'Show left side';
  }
  function paint(){
    const act = hov || sel, z0 = byId[act];
    const g = $('#isoSel', svg);
    if (g && visible(act)){
      g.innerHTML = `<g class="lift" filter="url(#fLift)"><g mask="url(#cp-${act})"><use href="#carImg" filter="url(#${z0.status==='repaired'?'fRep':'fPass'})"/></g></g>`;
      $$('.repsoft', svg).forEach(r => r.style.opacity = r.dataset.rep===act ? 0 : 1);
    }
    const z = byId[act]; const rep = z.status==='repaired';
    $('#zoneCard').innerHTML = `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><div style="font:600 24px var(--body)">${z.name}</div><span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;padding:6px 14px;border-radius:999px;background:${rep?'rgba(230,217,198,.14)':'rgba(134,165,127,.16)'};color:${rep?'#E6D9C6':'#B7D2B1'}"><i class="dot" style="background:${rep?'var(--rep)':'var(--pass)'}"></i>${rep?'Repaired, passed':'Passed'}</span></div><p style="margin:0">${z.text}</p>`;
    $$('#zgrid .zb').forEach(b => b.classList.toggle('on', b.dataset.z===act));
  }
  $('#zgrid').innerHTML = zones.map(z=>`<button class="zb" data-z="${z.id}"><i class="dot" style="background:${z.status==='repaired'?'var(--rep)':'var(--pass)'}"></i>${z.name}</button>`).join('');
  svg.addEventListener('pointerover', e => { const p = e.target.closest('[data-z]'); if (p && e.pointerType!=='touch'){ hov = p.dataset.z; paint(); } });
  svg.addEventListener('pointerleave', () => { hov = null; paint(); });
  svg.addEventListener('click', e => { const p = e.target.closest('[data-z]'); if (p){ sel = p.dataset.z; hov = null; paint(); } });
  $('#zgrid').addEventListener('click', e => { const b = e.target.closest('.zb'); if (!b) return; const id = b.dataset.z; const need = ['doorFR','doorRR'].includes(id) ? 'R' : ['doorFL','doorRL'].includes(id) ? 'L' : side; sel = id; hov = null; if (need!==side){ flip(need); } else paint(); });
  $('#zgrid').addEventListener('pointerover', e => { const b = e.target.closest('.zb'); if (b && e.pointerType!=='touch'){ const id=b.dataset.z; const vis = side==='L' ? !['doorFR','doorRR'].includes(id) : !['doorFL','doorRL'].includes(id); if (vis){ hov = id; paint(); } } });
  $('#zgrid').addEventListener('pointerleave', () => { hov = null; paint(); });
  function flip(to){ const f = $('#isoFlip'); f.classList.add('mid'); setTimeout(()=>{ side = to || (side==='L'?'R':'L'); draw(); f.classList.remove('mid'); }, reduce?0:300); }
  $('[data-flip]').addEventListener('click', () => { hov = null; const next = side==='L'?'R':'L'; if (['doorFL','doorRL','doorFR','doorRR'].includes(sel)) sel = ({doorFL:'doorFR',doorRL:'doorRR',doorFR:'doorFL',doorRR:'doorRL'})[sel]; flip(next); });
  { const insp = $('.insp'); if ('IntersectionObserver' in window && insp){ const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); draw(); } }, {rootMargin:'700px 0px'}); io.observe(insp); } else draw(); }
  // gallery
  $$('[data-thumb]').forEach(b => b.addEventListener('click', () => { const i=+b.dataset.thumb; $('#galMain').src = mid(c.photos[i]); $('#galMain').dataset.i = i; $$('[data-thumb]').forEach(x=>x.classList.toggle('on', x===b)); }));
  $('[data-zoom]').addEventListener('click', () => { const lb = $('#lightbox'); lb.querySelector('img').src = c.photos[+$('#galMain').dataset.i || 0]; lb.classList.add('on'); });
  // calc
  let term = 60;
  const dep = $('#dep');
  const upd = () => { const d = +dep.value; const credit = c.price - d; const m = monthly(credit, term); $('#depL').textContent = eur(d); $('#mon').textContent = eur(Math.round(m)); $('#monNote').textContent = `${term} payments of ${eur(m,2)} after a ${eur(d)} deposit. Total payable ${eur(m*term + d, 2)}.`; };
  dep.addEventListener('input', upd);
  $('#terms').addEventListener('click', e => { const b = e.target.closest('.pill'); if (!b) return; term = +b.dataset.n; $$('#terms .pill').forEach(x=>x.classList.toggle('on', x===b)); upd(); });
  upd();
}
document.addEventListener('click', e => { if (e.target.closest('#lightbox')) $('#lightbox').classList.remove('on'); });
document.addEventListener('keydown', e => {
  const lb = $('#lightbox'); if (!lb || !lb.classList.contains('on')) return;
  if (e.key === 'Escape'){ lb.classList.remove('on'); return; }
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const c = bySlug(STATE.car); if (!c) return; const img = lb.querySelector('img');
  const cur = Math.max(0, c.photos.findIndex(p => img.src.endsWith(p))); const n = c.photos.length;
  img.src = c.photos[(cur + (e.key === 'ArrowRight' ? 1 : n - 1)) % n]; e.preventDefault();
});
// Touch: the arrow keys' photo stepping as a swipe (touch events only, so mouse use is unchanged). A tap still closes.
let lbX = null;
document.addEventListener('touchstart', e => { if (e.target.closest && e.target.closest('#lightbox.on') && e.touches.length===1) lbX = e.touches[0].clientX; }, {passive:true});
document.addEventListener('touchend', e => {
  if (lbX===null) return; const dx = e.changedTouches[0].clientX - lbX; lbX = null; if (Math.abs(dx) < 40) return;
  const c = bySlug(STATE.car), img = $('#lightbox img'); if (!c || !img) return;
  const n = c.photos.length, cur = Math.max(0, c.photos.findIndex(p => img.src.endsWith(p)));
  img.src = c.photos[(cur + (dx < 0 ? 1 : n - 1)) % n];
}, {passive:true});

/* ---------- certified / finance ---------- */
function initCertified(){
  $$('[data-acc]').forEach(b => b.addEventListener('click', () => { const a = b.closest('.acc'); const open = !a.classList.contains('open'); $$('.acc').forEach(x=>{ if (x!==a){ x.classList.remove('open'); x.querySelector('[data-acc]').setAttribute('aria-expanded','false'); } }); a.classList.toggle('open', open); b.setAttribute('aria-expanded', open); }));
}
function initFinance(){
  let term = 60;
  const fp = $('#fp'), fd = $('#fd');
  const upd = () => { const p = +fp.value, d = Math.min(+fd.value, p); const credit = p - d, m = monthly(credit, term);
    $('#fpL').textContent = eur(p); $('#fdL').textContent = eur(d); $('#fm').textContent = eur(Math.round(m)); $('#fmn').textContent = `a month for ${term} months`;
    $('#fbreak').innerHTML = `<span>Amount of credit</span><span>${eur(credit,2)}</span><span>Total cost of credit</span><span>${eur(m*term-credit,2)}</span><span>Total amount payable</span><span>${eur(m*term+d,2)}</span><span>APR</span><span>7.9%</span>`;
    const b = Math.ceil(m/100)*100; $('#fgo').textContent = `Show cars up to ${eur(b)} a month`; $('#fgo').dataset.budget = b; };
  fp.addEventListener('input', upd); fd.addEventListener('input', upd);
  $('#fterms').addEventListener('click', e => { const b = e.target.closest('.pill'); if (!b) return; term = +b.dataset.n; $$('#fterms .pill').forEach(x=>x.classList.toggle('on', x===b)); upd(); });
  upd();
}

/* ---------- global clicks ---------- */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-goto="visit"]'); if (g){ e.preventDefault(); const f = $('[data-visit]'); if (f) f.scrollIntoView({behavior: reduce?'auto':'smooth'}); }
  const p = e.target.closest('[data-panel]'); if (p){ e.preventDefault(); openPanel(p.dataset.panel, p); }
  if (e.target.closest('[data-replay]')) startDrive();
  if (e.target.closest('[data-more]')){ setMore(!$('.finder').classList.contains('expanded')); }
  if (e.target.closest('[data-go]')){ setMore(false); if (STATE.page!=='stock') navigate('/stock/'); else { const c = $('#cards'); if (c) window.scrollTo({top: c.getBoundingClientRect().top + scrollY - 150, behavior: reduce?'auto':'smooth'}); } }
  if (e.target.closest('[data-edit-filters]')){ const fd = $('.finder'); if (fd) window.scrollTo({top: fd.getBoundingClientRect().top + scrollY - 110, behavior: reduce?'auto':'smooth'}); }
  const tg = e.target.closest('[data-tog]'); if (tg){ const k = tg.dataset.tog; STATE.f[k] = !STATE.f[k]; syncFinder(); onFilter(); }
  const mg = e.target.closest('[data-monthly-go]'); if (mg){ const b = +mg.dataset.budget; STATE.f.monthly = true; STATE.f.pF = null; STATE.f.pT = MON_OPTS.find(o=>o>=b) || 900; }
  const m = e.target.closest('[data-mode]'); if (m){ const mon = m.dataset.mode==='monthly'; if (mon!==STATE.f.monthly){ STATE.f.monthly = mon; STATE.f.pF = null; STATE.f.pT = null; } $$('[data-mode]').forEach(x=>x.classList.toggle('on', x.dataset.mode===m.dataset.mode)); onFilter(); }
  const pl = e.target.closest('[data-pills] .pill'); if (pl && pl.closest('.finder')){ const k = pl.parentElement.dataset.pills; STATE.f[k] = (pl.parentElement.hasAttribute('data-free') && STATE.f[k]===pl.dataset.v) ? 'All' : pl.dataset.v; syncFinder(); onFilter(); }
  if (e.target.closest('[data-clear]')){ Object.assign(STATE.f, {monthly:false,fsh:false,one:false,irish:false,nct:false,make:'',model:'',kmF:null,kmT:null,pF:null,pT:null,yF:null,yT:null,fuel:'All',gear:'All',body:'All',colour:'All',eng:'All'}); syncFinder(); onFilter(); refreshCb(); }
});

/* ---------- panels ---------- */
let PANEL = null, opener = null;
function openPanel(kind, from){
  // opened from the mobile menu (which closes): hand focus back to the visible menu button afterwards
  if (from && from.closest && from.closest('#mnav')) from = menuBtn() || from;
  opener = from; PANEL = {kind, step:0, data:{}};
  if (kind==='testdrive'){ PANEL.car = STATE.page==='car' ? bySlug(STATE.car) : null; PANEL.step = PANEL.car ? 1 : 0; }
  $('#scrim').classList.add('on'); $('#panel').classList.add('on'); $('#panel').setAttribute('aria-hidden','false');
  drawPanel(); setTimeout(()=>{ const h = $('#panel h2'); if (h) h.focus(); }, 60);
}
function closePanel(){ if (!PANEL) return; PANEL = null; $('#scrim').classList.remove('on'); $('#panel').classList.remove('on'); $('#panel').setAttribute('aria-hidden','true'); if (opener) opener.focus(); }
$('#scrim')?.addEventListener('click', closePanel);
function drawPanel(){
  const P = PANEL, el = $('#panel');
  const title = {testdrive:'Book a test drive', tradein:'Value your car'}[P.kind];
  let body = '', foot = '';
  if (P.kind==='tradein') ({body, foot} = tradeIn(P));
  else ({body, foot} = testDrive(P));
  el.innerHTML = `<div class="panel-h"><h2 tabindex="-1" style="font:600 18px var(--body);margin:0">${title}</h2><button class="x" data-close aria-label="Close">${'<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1L13 13M13 1L1 13" stroke="#1C1E21" stroke-width="1.8" stroke-linecap="round"/></svg>'}</button></div><div class="panel-b fade-in">${body}</div><div class="panel-f">${foot}</div>`;
  $('[data-close]', el).addEventListener('click', closePanel);
  $$('[data-act]', el).forEach(b => b.addEventListener('click', () => ACTIONS[b.dataset.act](b)));
  const f = $('input', el); if (f && !f.dataset.nofocus) setTimeout(()=>f.focus(), 120);
}
const CARIMG = c => `<img src="${c.photos[0]}" alt="" style="width:92px;height:70px;object-fit:cover;border-radius:16px">`;
function testDrive(P){
  if (P.step===0) return { body:`<p class="q">Which car would you like to drive?</p><div style="display:flex;flex-direction:column;gap:8px">${CARS.slice(0,8).map(c=>`<button class="qrow" data-act="pickcar" data-slug="${c.slug}" style="flex-direction:row;align-items:center;border:0;cursor:pointer;text-align:left">${CARIMG(c)}<span><b style="display:block">${nm(c)}</b><span class="small muted">${c.year} · ${km(c.km)} km · ${eur(c.price)}</span></span></button>`).join('')}</div>`, foot:'' };
  const c = P.car;
  const days = tdDays(); const times = ['09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:30']; const taken = [1,5,8];
  if (P.step===1){ P.data.day ??= 1; P.data.time ??= 3;
    return { body:`<div class="qrow" style="flex-direction:row;align-items:center">${CARIMG(c)}<span><b style="display:block">${nm(c)} ${c.variant}</b><span class="small muted">${c.year} · ${km(c.km)} km · ${eur(c.price)}</span></span></div>
      <p class="q" style="font-size:28px">When suits you?</p><div class="days">${days.map((d,i)=>`<button class="pill ${i===P.data.day?'on':''}" data-act="day" data-i="${i}"><b>${d[0]}</b><span class="small">${d[1]}</span></button>`).join('')}</div>
      <div style="font-weight:600">Time · 45 minutes, about 30 on the road</div><div class="slots">${times.map((t,i)=>`<button class="pill ${i===P.data.time?'on':''}" data-act="time" data-i="${i}" ${taken.includes(i)?'disabled':''}>${t}</button>`).join('')}</div>
      <div class="fl"><label for="td-n">Name</label><input class="in" id="td-n" value="Siobhán Murphy" data-nofocus="1"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="fl"><label for="td-m">Mobile</label><input class="in" id="td-m" value="087 123 4567"></div><div class="fl"><label for="td-e">Email</label><input class="in" id="td-e" value="siobhan@example.ie"></div></div>`,
      foot:`<span class="small muted">${days[P.data.day][0]} ${days[P.data.day][1]} · ${times[P.data.time]}</span><button class="btn btn-wine" data-act="tdconfirm">Confirm test drive</button>` }; }
  const d = days[P.data.day];
  return { body:`<div class="found fade-in">${markSVG('#8C2B3C',56,'')}<p class="q">See you ${FULLDAY[d[0]]} ${d[1].replace('Oct','October')} at ${times[P.data.time]}.</p><p class="muted" style="margin:0">The ${c.make} will be washed, fuelled and waiting at the front of the forecourt. We've sent the details to your mobile.</p></div>
    <div class="qrow"><div style="display:grid;grid-template-columns:auto 1fr;gap:6px 18px"><span class="muted">Where</span><span>Dublin Road, Athlone</span><span class="muted">Bring</span><span>Your full driving licence</span><span class="muted">Change</span><span>Call 01 234 5187 or reply to the text</span></div></div>`,
    foot:`<button class="btn btn-line" data-act="back">Change the time</button><button class="btn btn-wine" data-act="done">Done</button>` };
}
const FULLDAY = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday'};
function tdDays(){ const out=[]; const d=new Date(); while(out.length<8){ d.setDate(d.getDate()+1); if (d.getDay()!==0) out.push([d.toLocaleDateString('en-IE',{weekday:'short'}).slice(0,3), d.getDate()+' '+d.toLocaleDateString('en-IE',{month:'short'}).slice(0,3)]); } return out; }
function tradeIn(P){
  const total = 6, pct = Math.min(100, (P.step)/total*100);
  const prog = `<div class="prog"><i style="width:${pct}%"></i></div>`;
  const s = P.step, d = P.data;
  if (s===0) return { body:`${prog}<p class="q">Let's value your car.<br>What's the reg?</p><div class="plate"><div class="eu"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">${Array.from({length:12},(_,i)=>{const a=i/12*2*Math.PI;return `<circle cx="${13+9*Math.cos(a)}" cy="${13+9*Math.sin(a)}" r="1.4" fill="#F4C430"/>`}).join('')}</svg><span>IRL</span></div><input id="reg" aria-label="Registration" placeholder="172-WH-1408" value="${d.reg||''}" autocomplete="off"></div><p class="small muted" style="margin:0">Any Irish reg works in this demo. We look it up on the national vehicle file.</p>`, foot:`<span></span><button class="btn btn-wine btn-lg" data-act="lookup">Find my car</button>` };
  if (s===1) return { body:`${prog}<div class="thinking"><i></i><i></i><i></i><span>Looking up ${d.reg}…</span></div>`, foot:'' };
  if (s===2) return { body:`${prog}<p class="q">Is this your car?</p><div class="found"><img src="/img/car-body.webp" alt="" style="filter:brightness(.35) saturate(0)"><b style="font-size:20px">2017 Volkswagen Tiguan</b><span class="muted">2.0 TDI Highline · Deep Black · ${d.reg}</span></div>`, foot:`<button class="btn btn-line" data-act="notmine">No, try again</button><button class="btn btn-wine btn-lg" data-act="next">Yes, that's it</button>` };
  if (s===3) return { body:`${prog}<p class="q">How many kilometres are on the clock?</p><div class="big-in"><input id="kmIn" inputmode="numeric" value="${d.km||'148,500'}" aria-label="Kilometres"><span>km</span></div>`, foot:`<button class="btn btn-line" data-act="back">Back</button><button class="btn btn-wine btn-lg" data-act="next">Next</button>` };
  if (s===4){ d.svc ??= 'Full'; d.dmg ??= 'No'; d.keys ??= '2 keys';
    const row = (k, q, opts) => `<div class="qrow"><b>${q}</b><div class="pills">${opts.map(o=>`<button class="pill ${d[k]===o?'on':''}" data-act="opt" data-k="${k}" data-v="${o}">${o}</button>`).join('')}</div></div>`;
    return { body:`${prog}<p class="q">A few quick questions.</p>${row('svc','Service history',['Full','Partial','None'])}${row('dmg','Any damage or warning lights?',['No','Small marks','Needs work'])}${row('keys','How many keys?',['2 keys','1 key'])}`, foot:`<button class="btn btn-line" data-act="back">Back</button><button class="btn btn-wine btn-lg" data-act="next">Next</button>` }; }
  if (s===5){ d.ph ??= [];
    const slots = [['Front','M10 30 L18 20 L46 20 L54 30 L54 38 L10 38 Z'],['Rear','M10 30 L18 20 L46 20 L54 30 L54 38 L10 38 Z'],['Side','M4 34 L8 26 L20 22 L30 16 L46 16 L56 24 L62 28 L62 36 L4 36 Z'],['Dashboard','M6 34 C10 18 54 18 58 34 M32 24 L32 30']];
    return { body:`${prog}<p class="q">Add photos for a firmer offer.</p><p class="muted" style="margin:0">Optional. Four phone photos are enough.</p><div class="photos">${slots.map(([n,p],i)=>`<button class="${d.ph.includes(i)?'done':''}" data-act="photo" data-i="${i}"><svg width="64" height="44" viewBox="0 0 64 44" aria-hidden="true"><path d="${p}" fill="none" stroke="${d.ph.includes(i)?'#86A57F':'#8C9096'}" stroke-width="2" stroke-linejoin="round"/></svg>${d.ph.includes(i)?n+' added':n}</button>`).join('')}</div>`, foot:`<button class="btn btn-line" data-act="next">Skip</button><button class="btn btn-wine btn-lg" data-act="next">Continue</button>` }; }
  if (s===6) return { body:`${prog}<p class="q">Where can we reach you?</p><div class="fl"><label for="ti-n">Name</label><input class="in" id="ti-n" value="${d.name||'Siobhán Murphy'}"></div><div class="fl"><label for="ti-m">Mobile</label><input class="in" id="ti-m" value="${d.mob||'087 123 4567'}"></div>`, foot:`<button class="btn btn-line" data-act="back">Back</button><button class="btn btn-wine btn-lg" data-act="value">Get my estimate</button>` };
  if (s===7) return { body:`${prog}<div class="thinking"><i></i><i></i><i></i><span>Working out your value…</span></div>`, foot:'' };
  const hr = new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Dublin'})).getHours();
  const CALLS = hr>=9 && hr<16 ? ['Today before 6pm','Tomorrow morning','Tomorrow afternoon'] : ['Tomorrow morning','Tomorrow afternoon','Tomorrow evening'];
  if (!CALLS.includes(d.call)) d.call = CALLS[0];
  return { body:`<div class="found fade-in"><span class="muted">Your Tiguan is worth around</span><div class="range">€13,600 – €14,700</div><span class="small muted">Final offer after a quick look in our workshop.</span></div>
    <div class="qrow"><div style="display:grid;grid-template-columns:auto 1fr;gap:6px 18px;font-size:15px"><span class="muted">Car</span><span>2017 Volkswagen Tiguan 2.0 TDI · ${d.reg}</span><span class="muted">Kilometres</span><span>${d.km||'148,500'} km</span><span class="muted">History</span><span>${d.svc} service history · ${d.dmg==='No'?'no damage':d.dmg.toLowerCase()} · ${d.keys}</span></div></div>
    <div class="qrow"><b>When should we call?</b><div class="pills">${CALLS.map(o=>`<button class="pill ${d.call===o?'on':''}" data-act="opt" data-k="call" data-v="${o}">${o}</button>`).join('')}</div></div>`, foot:`<span class="small muted">Aoife or one of the team will ring ${d.mob||'087 123 4567'}.</span><button class="btn btn-wine" data-act="done">Done</button>` };
}
function pickPill(b){ $$('.pill', b.parentElement).forEach(x=>x.classList.toggle('on', x===b)); }
function tdSummary(){ const s = $('#panel .panel-f .small'); if (!s) return; const days = tdDays(); const times = ['09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:30']; s.textContent = `${days[PANEL.data.day][0]} ${days[PANEL.data.day][1]} · ${times[PANEL.data.time]}`; }
const ACTIONS = {
  pickcar: b => { PANEL.car = bySlug(b.dataset.slug); PANEL.step = 1; drawPanel(); },
  day: b => { PANEL.data.day = +b.dataset.i; pickPill(b); tdSummary(); }, time: b => { PANEL.data.time = +b.dataset.i; pickPill(b); tdSummary(); },
  tdconfirm: b => ConceptModal.open('testdrive', { from: b, onClose: () => { if (PANEL){ PANEL.step = 2; drawPanel(); } } }),
  back: () => { PANEL.step = PANEL.kind==='testdrive' ? 1 : Math.max(0, PANEL.step-1); drawPanel(); },
  done: closePanel,
  lookup: () => { const v = ($('#reg').value || '').trim().toUpperCase(); if (!/^\d{2,3}-?[A-Z]{1,2}-?\d{1,6}$/.test(v.replace(/\s/g,''))){ $('#reg').setAttribute('aria-invalid','true'); $('.plate').style.borderColor='#B3261E'; if (!$('#regErr')) $('.panel-b').insertAdjacentHTML('beforeend', `<p id="regErr" class="small" style="color:#B3261E;margin:0" role="alert">We couldn't read that reg. Check it and try again, for example 172-WH-1408.</p>`); $('#reg').focus(); return; }
    PANEL.data.reg = v; PANEL.step = 1; drawPanel(); setTimeout(()=>{ if (PANEL && PANEL.step===1){ PANEL.step = 2; drawPanel(); } }, 1100); },
  notmine: () => { PANEL.step = 0; PANEL.data.reg=''; drawPanel(); },
  next: () => { if (PANEL.step===3) PANEL.data.km = $('#kmIn').value; PANEL.step++; drawPanel(); },
  opt: b => { PANEL.data[b.dataset.k] = b.dataset.v; pickPill(b); },
  photo: b => { const i = +b.dataset.i; const ph = PANEL.data.ph; if (ph.includes(i)) return; ph.push(i); b.classList.add('done'); b.querySelector('path').setAttribute('stroke','#86A57F'); b.lastChild.textContent = b.lastChild.textContent.trim() + ' added'; },
  value: b => { PANEL.data.name = $('#ti-n').value; PANEL.data.mob = $('#ti-m').value; ConceptModal.open('tradein', { from: b, onClose: () => { if (!PANEL) return; PANEL.step = 7; drawPanel(); setTimeout(()=>{ if (PANEL && PANEL.step===7){ PANEL.step = 8; drawPanel(); } }, 1300); } }); }
};
// focus trap
document.addEventListener('keydown', e => { if (e.key!=='Tab' || !PANEL) return; const f = $$('#panel button, #panel input, #panel [tabindex]').filter(x=>!x.disabled); if (!f.length) return; const first=f[0], last=f[f.length-1]; if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); } });

/* ---------- boot ---------- */
chrome();
route();
setInterval(liveOpen, 60000);
})();
