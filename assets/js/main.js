/* ═══════════════════════════════════════════════════════════════
   Alphamilz · interfaz
   Idioma · scroll · escena 3D · WhatsApp · popup de auditoría
   ═══════════════════════════════════════════════════════════════ */
const I18N = window.ALPHA_I18N || { es: {}, en: {} };
const html = document.documentElement;
const body = document.body;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const WA_NUMBER = '528182870885';
let scene = null;
let lang = 'es';
let waTopic = null;

/* ── WhatsApp ────────────────────────────────────────────────── */
function waHref(topic) {
  const d = I18N[lang] || {};
  const msg = topic
    ? `${d['wa.topic'] || 'Hola Alphamilz, me interesa'} ${topic}.`
    : (d['wa.default'] || 'Hola Alphamilz, quiero una auditoría gratis de mi negocio.');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function refreshWa() {
  $$('[data-wa]').forEach((a) => {
    // cada enlace puede fijar su propio tema; el de "necesitas" sigue al pill elegido
    const topic = a.dataset.topic || (a.id === 'needCta' ? waTopic : null);
    a.setAttribute('href', waHref(topic));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
}

/* ── idioma ──────────────────────────────────────────────────── */
const TITLES = {
  es: 'Alphamilz · Agencia de IA aplicada | Automatización, agentes y desarrollo',
  en: 'Alphamilz · Applied AI agency | Automation, agents and development'
};
function applyLang(next, { store = true } = {}) {
  lang = I18N[next] ? next : 'es';
  const d = I18N[lang];
  html.lang = lang;
  document.title = TITLES[lang];
  $$('[data-i18n]').forEach((el) => {
    const v = d[el.dataset.i18n];
    if (v == null) return;
    if (el.dataset.i18nAttr) el.setAttribute(el.dataset.i18nAttr, v);
    else el.textContent = v;
  });
  $$('.lang__b').forEach((b) => {
    const on = b.dataset.lang === lang;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  refreshWa();
  if (store) { try { localStorage.setItem('alphamilz-lang', lang); } catch (e) { /* modo privado */ } }
}
(function initLang() {
  let start = new URLSearchParams(location.search).get('lang');
  if (start) start = start.toLowerCase().slice(0, 2);
  if (!start) { try { start = localStorage.getItem('alphamilz-lang'); } catch (e) { /* ignore */ } }
  if (!start) start = (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
  applyLang(start, { store: false });
})();
$$('.lang__b').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── preloader ───────────────────────────────────────────────── */
(function preload() {
  const count = $('#preloaderCount');
  const t0 = performance.now();
  let pct = 0, last = t0, settled = false, done = false;

  function finish() {
    if (done) return;
    done = true;
    if (count) count.textContent = '100';
    body.classList.remove('is-loading');
    body.classList.add('loaded');
    document.dispatchEvent(new CustomEvent('alpha:loaded'));
    requestAnimationFrame(() => {
      $$('.hero .ln').forEach((el) => el.classList.add('is-in'));
      $$('.hero [data-reveal]').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 70 * i));
    });
  }
  // el contador avanza con el reloj, no con los frames: así no depende
  // de lo ocupada que esté la GPU al arrancar
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.2);
    last = now;
    const elapsed = now - t0;
    pct = settled
      ? Math.min(100, pct + dt * 280)
      : Math.min(94, Math.max(pct, 18 + elapsed / 16));
    if (count) count.textContent = String(Math.round(pct)).padStart(2, '0');
    if (pct >= 100) return finish();
    requestAnimationFrame(tick);
  }
  const settle = () => { settled = true; };
  if (document.readyState === 'complete') setTimeout(settle, 200);
  else window.addEventListener('load', () => setTimeout(settle, 200), { once: true });
  setTimeout(settle, 2200);
  setTimeout(finish, 5000);
  if (reduced) finish(); else requestAnimationFrame(tick);
})();

/* ── reveals ─────────────────────────────────────────────────── */
(function reveals() {
  const items = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
  if (!('IntersectionObserver' in window) || reduced) return items.forEach((el) => el.classList.add('is-in'));
  const groups = new Map();
  items.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    list.push(el); groups.set(el.parentElement, list);
  });
  groups.forEach((list) => list.forEach((el, i) => el.style.setProperty('--d', Math.min(i, 6))));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ── menú ────────────────────────────────────────────────────── */
const header = $('#header');
const burger = $('#burger');
const menu = $('#menu');
let menuOpen = false;
function setMenu(open) {
  menuOpen = open;
  body.classList.toggle('menu-open', open);
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  if (open) menu.removeAttribute('hidden');
  else setTimeout(() => { if (!menuOpen) menu.setAttribute('hidden', ''); }, 500);
}
burger.addEventListener('click', () => setMenu(!menuOpen));
$$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ── parallax de texto ───────────────────────────────────────── */
const parallax = reduced ? [] : $$('[data-par]').map((el) => ({ el, k: parseFloat(el.dataset.par) || 0.06 }));
function runParallax(vh) {
  for (const p of parallax) {
    const r = p.el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const fromCenter = r.top + r.height / 2 - vh / 2;
    p.el.style.translate = '0 ' + (-fromCenter * p.k).toFixed(1) + 'px';
  }
}

/* ── scroll: progreso, acento y colocación de la escena ──────── */
const sections = $$('[data-accent]');
const stage = $('#stage');
let y = window.scrollY, lastY = y, ticking = false, current = null;

function onFrame() {
  ticking = false;
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const p = clamp(y / max, 0, 1);
  if (scene) scene.setProgress(p);
  runParallax(vh);

  header.classList.toggle('is-solid', y > 30);
  header.classList.toggle('is-hidden', y > lastY && y > vh * 0.8 && !menuOpen);
  body.classList.toggle('wa-on', y > vh * 0.35);
  lastY = y;

  const mid = y + vh * 0.5;
  let sec = null;
  for (const s of sections) {
    const top = s.offsetTop;
    if (mid >= top && mid < top + s.offsetHeight) { sec = s; break; }
  }
  if (sec && sec !== current) {
    current = sec;
    const accent = sec.dataset.accent || '#A6F700';
    const x = parseFloat(sec.dataset.x || '0');
    document.documentElement.style.setProperty('--accent', accent);
    stage.style.setProperty('--gx', x > 0.5 ? '72%' : x < -0.5 ? '28%' : '50%');
    stage.style.setProperty('--gy', '46%');
    if (scene) {
      scene.setAccent(accent);
      scene.setPlacement(x, parseFloat(sec.dataset.y || '0'), parseFloat(sec.dataset.scale || '1'));
      const dim = parseFloat(sec.dataset.dim);
      scene.setDim(Number.isNaN(dim) ? 1 : dim);
    }
  }
}
function request() { y = window.scrollY; if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
window.addEventListener('scroll', request, { passive: true });
window.addEventListener('resize', () => { request(); if (scene) scene.resize(); }, { passive: true });

/* ── "hacemos lo que necesitas" ──────────────────────────────── */
(function need() {
  const pills = $$('.pill--pick');
  const out = $('.need__out');
  const copy = $('#needCopy');
  if (!pills.length || !copy) return;
  pills.forEach((b) => b.addEventListener('click', () => {
    pills.forEach((p) => p.classList.toggle('is-on', p === b));
    const key = `need.${b.dataset.need}`;
    waTopic = b.dataset.topic || b.textContent.trim();
    out.classList.add('is-swap');
    setTimeout(() => {
      copy.dataset.i18n = key;
      copy.textContent = (I18N[lang] && I18N[lang][key]) || copy.textContent;
      out.classList.remove('is-swap');
    }, reduced ? 0 : 200);
    refreshWa();
    if (scene) scene.burst(0.8);
  }));
})();

/* ── clientes: el nombre en texto mientras no esté el logotipo ── */
$$('.logos img').forEach((img) => {
  const swap = () => {
    const span = document.createElement('span');
    span.className = 'fallback';
    span.textContent = img.dataset.name || img.alt;
    img.replaceWith(span);
  };
  if (img.complete && img.naturalWidth === 0) swap();
  else img.addEventListener('error', swap, { once: true });
});

/* ── popup de auditoría (20 s) ───────────────────────────────── */
(function audit() {
  const pop = $('#pop');
  if (!pop) return;
  const card = $('.pop__card', pop);
  let opened = false, lastFocus = null;

  const seen = () => { try { return sessionStorage.getItem('alphamilz-pop') === '1'; } catch (e) { return false; } };
  const mark = () => { try { sessionStorage.setItem('alphamilz-pop', '1'); } catch (e) { /* ignore */ } };

  function open() {
    if (opened || seen() || menuOpen) return;
    opened = true; mark();
    lastFocus = document.activeElement;
    pop.removeAttribute('hidden');
    requestAnimationFrame(() => pop.classList.add('is-on'));
    setTimeout(() => card.focus({ preventScroll: true }), 120);
  }
  function close() {
    pop.classList.remove('is-on');
    setTimeout(() => pop.setAttribute('hidden', ''), 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  $('#popX').addEventListener('click', close);
  $('#popNo').addEventListener('click', close);
  $('#popCta').addEventListener('click', close);
  pop.addEventListener('click', (e) => { if (!card.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && opened && !pop.hasAttribute('hidden')) close();
    if (e.key === 'Tab' && opened && !pop.hasAttribute('hidden')) {
      const f = $$('a[href],button:not([disabled])', card);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  setTimeout(open, 20000);
  // si alguien ya se fue a WhatsApp, no lo perseguimos con el popup
  $$('[data-wa]').forEach((a) => a.addEventListener('click', mark));
})();

/* ── puntero, magnéticos, varios ─────────────────────────────── */
window.addEventListener('pointermove', (e) => {
  if (scene) scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (scene && e.touches[0]) scene.setPointer((e.touches[0].clientX / window.innerWidth) * 2 - 1, (e.touches[0].clientY / window.innerHeight) * 2 - 1);
}, { passive: true });

if (fine && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (!id || id === '#' || id === '#top') return;
  const t = document.querySelector(id);
  if (!t) return;
  e.preventDefault();
  window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 8, behavior: reduced ? 'auto' : 'smooth' });
}));
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
document.addEventListener('visibilitychange', () => {
  if (!scene) return;
  document.hidden ? scene.pause() : scene.resume();
});

/* ── arranque de la escena ───────────────────────────────────── */
function canWebGL() {
  try {
    if (navigator.connection && navigator.connection.saveData) return false;
    if (navigator.deviceMemory && navigator.deviceMemory < 2) return false;
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (e) { return false; }
}
(async function boot() {
  const canvas = $('#scene');
  if (!canvas || !canWebGL()) { body.classList.add('no-webgl'); request(); return; }
  try {
    const mod = await import('./scene.js');
    scene = mod.createScene(canvas, {
      reducedMotion: reduced,
      lowPower: !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    });
    const go = () => { scene.start(); body.classList.add('scene-ready'); request(); };
    if (body.classList.contains('loaded')) go();
    else document.addEventListener('alpha:loaded', go, { once: true });
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      body.classList.add('no-webgl');
      body.classList.remove('scene-ready');
      scene = null;
    });
    request();
  } catch (err) {
    console.warn('[alphamilz] escena 3D no disponible:', err);
    body.classList.add('no-webgl');
    request();
  }
})();
