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
  if (typeof resplit === 'function') $$('[data-split]').forEach(resplit);
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

/* ── aparición de texto ──────────────────────────────────────── */
/* Los titulares se parten en palabras dentro de una máscara, así que al
   entrar en pantalla suben una por una en lugar de aparecer de golpe. */
const SPLIT = '.lead, .statement, .cta__title, .hero__title .ln, .index__name, .rate__name, .steps h3';

function splitWords(el) {
  if (el.dataset.split === 'done' || reduced) return;
  let i = 0;
  const wrap = (text) => {
    const w = document.createElement('span');
    w.className = 'w';
    const inner = document.createElement('span');
    inner.className = 'wi';
    inner.style.setProperty('--i', i++);
    inner.appendChild(document.createTextNode(text));
    w.appendChild(inner);
    return w;
  };
  // Baja por el árbol en lugar de tratar cada hijo como una sola palabra:
  // un <b class="brk"> con varias palabras dentro no cabría en un móvil,
  // porque la máscara es inline-block y no puede partirse en dos renglones.
  const walk = (node) => {
    const frag = document.createDocumentFragment();
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          frag.appendChild(tok.trim() ? wrap(tok) : document.createTextNode(tok));
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const shell = child.cloneNode(false); // conserva clase y pseudoelementos
        shell.appendChild(walk(child));
        frag.appendChild(shell);
      }
    });
    return frag;
  };
  const out = walk(el);
  el.textContent = '';
  el.appendChild(out);
  el.dataset.split = 'done';
}

function splitAll() {
  $$(SPLIT).forEach(splitWords);
}
function unwrap(el) {
  el.querySelectorAll('.w').forEach((w) => {
    const inner = w.firstElementChild;
    if (!inner) return w.remove();
    while (inner.firstChild) w.parentNode.insertBefore(inner.firstChild, w);
    w.remove();
  });
  el.normalize();
}
function resplit(el) {
  // tras cambiar de idioma el texto se reescribe: deshacemos y volvemos a partir
  if (!el.dataset.split) return;
  unwrap(el);
  el.dataset.split = '';
  splitWords(el);
}

(function reveals() {
  splitAll();
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
  }), { threshold: 0, rootMargin: '0px 0px -18% 0px' });
  items.forEach((el) => io.observe(el));

  // los titulares que no llevan data-reveal propio se animan solos
  const solo = $$(SPLIT).filter((el) => !el.closest('.hero') && !el.hasAttribute('data-reveal'));
  const io2 = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io2.unobserve(e.target);
  }), { threshold: 0, rootMargin: '0px 0px -18% 0px' });
  solo.forEach((el) => io2.observe(el));
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

/* ── la luz del fondo sigue al cursor ────────────────────────── */
const glow = { x: 0.68, y: 0.42, tx: 0.68, ty: 0.42, raf: 0, seen: false };
function paintGlow() {
  stage.style.setProperty('--gx', (glow.x * 100).toFixed(1) + '%');
  stage.style.setProperty('--gy', (glow.y * 100).toFixed(1) + '%');
}
function glowLoop(now) {
  glow.raf = 0;
  // suavizado por tiempo, no por frame: se siente igual en cualquier equipo
  const dt = Math.min((now - (glow.last || now)) / 1000, 0.1);
  glow.last = now;
  const k = 1 - Math.pow(0.0006, dt);
  glow.x += (glow.tx - glow.x) * k;
  glow.y += (glow.ty - glow.y) * k;
  paintGlow();
  if (Math.abs(glow.tx - glow.x) > 0.001 || Math.abs(glow.ty - glow.y) > 0.001) {
    glow.raf = requestAnimationFrame(glowLoop);
  }
}
function moveGlow(px, py) {
  glow.seen = true;
  glow.tx = clamp(px, 0, 1);
  glow.ty = clamp(py, 0, 1);
  if (reduced) { glow.x = glow.tx; glow.y = glow.ty; return paintGlow(); }
  if (!glow.raf) { glow.last = 0; glow.raf = requestAnimationFrame(glowLoop); }
}

/* ── parallax de texto ───────────────────────────────────────── */
const parallax = reduced ? [] : $$('[data-par]').map((el) => ({ el, k: parseFloat(el.dataset.par) || 0.06 }));
function runParallax(vh) {
  for (const p of parallax) {
    const r = p.el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const fromCenter = r.top + r.height / 2 - vh / 2;
    // el tope evita que un desplazamiento grande despegue el texto de su sección
    const d = clamp(-fromCenter * p.k, -170, 170);
    p.el.style.translate = '0 ' + d.toFixed(1) + 'px';
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
  if (!glow.seen) {
    glow.tx = 0.5 + Math.sin(p * Math.PI * 2) * 0.22;
    glow.ty = 0.3 + p * 0.4;
    glow.x = glow.tx; glow.y = glow.ty;
    paintGlow();
  }

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
  const nx = e.clientX / window.innerWidth, ny = e.clientY / window.innerHeight;
  if (scene) scene.setPointer(nx * 2 - 1, ny * 2 - 1);
  moveGlow(nx, ny);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (!e.touches[0]) return;
  const nx = e.touches[0].clientX / window.innerWidth, ny = e.touches[0].clientY / window.innerHeight;
  if (scene) scene.setPointer(nx * 2 - 1, ny * 2 - 1);
  moveGlow(nx, ny);
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
