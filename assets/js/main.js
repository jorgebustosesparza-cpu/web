/* ═══════════════════════════════════════════════════════════════
   Alphamilz · interface orchestration
   Scroll story · language · reveals · diagnostic lab · WebGL bridge
   ═══════════════════════════════════════════════════════════════ */
const I18N = window.ALPHA_I18N || { es: {}, en: {}, diagnose: () => ({ title: '', cards: [], domain: null }) };
const html = document.documentElement;
const body = document.body;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

let net = null;              // WebGL network api
let lang = 'es';
let hoverFocus = null;       // focus coming from hover
let lastDiagnosis = null;    // last lab diagnosis, re-rendered on language change
let stickyFocus = null;      // focus set by the diagnostic

/* ── language ────────────────────────────────────────────────── */
const TITLES = {
  es: 'Alphamilz · IA aplicada a negocios | Implementación, agentes y automatización',
  en: 'Alphamilz · Applied AI for business | Implementation, agents and automation'
};

function applyLang(next, { store = true } = {}) {
  lang = I18N[next] ? next : 'es';
  const dict = I18N[lang];
  html.lang = lang;
  document.title = TITLES[lang];
  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const val = dict[key];
    if (val == null) return;
    const attr = el.dataset.i18nAttr;
    if (attr) el.setAttribute(attr, val);
    else el.textContent = val;
  });
  $$('.lang__btn').forEach((b) => {
    const on = b.dataset.lang === lang;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  if (store) { try { localStorage.setItem('alphamilz-lang', lang); } catch (e) { /* private mode */ } }
  if (lastDiagnosis) renderDiagnosis(lastDiagnosis.query, { silent: true });
}

(function initLang() {
  let start = null;
  const param = new URLSearchParams(location.search).get('lang');
  if (param) start = param.toLowerCase().slice(0, 2);
  if (!start) { try { start = localStorage.getItem('alphamilz-lang'); } catch (e) { /* ignore */ } }
  if (!start) start = (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
  if (start !== 'es') applyLang(start, { store: false });
})();

$$('.lang__btn').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── preloader ───────────────────────────────────────────────── */
(function preload() {
  const bar = $('#preloaderBar');
  const count = $('#preloaderCount');
  const started = performance.now();
  let pct = 0, done = false;

  const tick = () => {
    const elapsed = performance.now() - started;
    const target = Math.min(100, done ? 100 : 18 + elapsed / 14);
    pct += (target - pct) * 0.14;
    if (bar) bar.style.width = pct + '%';
    if (count) count.textContent = String(Math.round(pct)).padStart(2, '0');
    if (pct > 99.4) { finish(); return; }
    requestAnimationFrame(tick);
  };

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    if (bar) bar.style.width = '100%';
    if (count) count.textContent = '100';
    body.classList.remove('is-loading');
    body.classList.add('loaded');
    requestAnimationFrame(() => {
      const title = $('.hero__title');
      if (title) title.classList.add('is-in');
      $$('.hero [data-reveal]').forEach((el, i) => {
        el.style.setProperty('--d', i);
        setTimeout(() => el.classList.add('is-in'), 60 * i);
      });
    });
  }

  const settle = () => { done = true; };
  if (document.readyState === 'complete') setTimeout(settle, 350);
  else window.addEventListener('load', () => setTimeout(settle, 350), { once: true });
  setTimeout(settle, 2600);          // never hold the page hostage
  if (reduced) { finish(); } else { requestAnimationFrame(tick); }
})();

/* ── reveals ─────────────────────────────────────────────────── */
(function reveals() {
  const items = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
  if (!('IntersectionObserver' in window) || reduced) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const groups = new Map();
  items.forEach((el) => {
    const p = el.parentElement;
    const list = groups.get(p) || [];
    list.push(el);
    groups.set(p, list);
  });
  groups.forEach((list) => list.forEach((el, i) => el.style.setProperty('--d', Math.min(i, 6))));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ── header + menu ───────────────────────────────────────────── */
const header = $('#header');
const burger = $('#burger');
const menu = $('#menu');
let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  body.classList.toggle('menu-open', open);
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (open) menu.removeAttribute('hidden');
  else setTimeout(() => { if (!menuOpen) menu.setAttribute('hidden', ''); }, 600);
}
burger.addEventListener('click', () => setMenu(!menuOpen));
$$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });

/* ── scroll orchestration ────────────────────────────────────── */
const sections = $$('[data-scene-theme]');
const storyTrack = $('#storyTrack');
const storyBar = $('#storyProgress');
const chapters = $$('.chapter');
const indexItems = $$('.story__index li');

let scrollY = window.scrollY;
let lastScroll = scrollY;
let ticking = false;
let activeChapter = -1;
let themeIsLight = false;

function onScrollFrame() {
  ticking = false;
  const y = scrollY;
  const vh = window.innerHeight;
  const mid = y + vh * 0.5;

  // header
  if (header) {
    header.classList.toggle('is-solid', y > 40);
    const goingDown = y > lastScroll && y > vh * 0.9;
    header.classList.toggle('is-hidden', goingDown && !menuOpen);
  }
  lastScroll = y;

  // which section owns the viewport centre
  let current = null;
  for (const s of sections) {
    const top = s.offsetTop;
    const bottom = top + s.offsetHeight;
    if (mid >= top && mid < bottom) { current = s; break; }
  }
  if (current && stickyFocus && current.id !== 'laboratorio' && current.id !== 'contacto') {
    stickyFocus = null;
    if (net && !hoverFocus) net.setFocus(null);
  }
  if (current) {
    const light = current.dataset.sceneTheme === 'light';
    if (light !== themeIsLight) {
      themeIsLight = light;
      body.classList.toggle('theme-light', light);
      html.dataset.theme = light ? 'light' : 'dark';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', light ? '#F1EDE4' : '#0A0C10');
      if (net) net.setTheme(light ? 1 : 0);
    }
  }

  // story: continuous phase across the pinned track
  let phase = null;
  if (storyTrack) {
    const r = storyTrack.getBoundingClientRect();
    const span = r.height - vh;
    if (r.top <= 0 && r.bottom >= vh && span > 0) {
      const p = clamp(-r.top / span, 0, 1);
      phase = p;
      if (storyBar) storyBar.style.transform = `scaleX(${p})`;
      const ci = clamp(Math.floor(p * 3.999), 0, chapters.length - 1);
      if (ci !== activeChapter) {
        activeChapter = ci;
        chapters.forEach((c, i) => {
          c.classList.toggle('is-active', i === ci);
          c.classList.toggle('is-past', i < ci);
        });
        indexItems.forEach((li, i) => li.classList.toggle('is-active', i === ci));
      }
    }
  }
  if (phase === null && current && current.dataset.scenePhase !== undefined) {
    phase = parseFloat(current.dataset.scenePhase);
  }
  if (phase !== null && net && !Number.isNaN(phase)) net.setPhase(phase);

  // how much of the frame the network is allowed to own in this section,
  // and whether it steps aside to leave the text column clear
  if (net && current) {
    const pr = parseFloat(current.dataset.scenePresence);
    net.setPresence(Number.isNaN(pr) ? 0.6 : pr);
    const off = parseFloat(current.dataset.sceneOffset);
    net.setOffset(!Number.isNaN(off) && window.innerWidth > 1080 ? off : 0);
  }
}

function requestFrame() {
  scrollY = window.scrollY;
  if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
}
window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', () => { requestFrame(); if (net) net.resize(); }, { passive: true });

/* ── hero function explorer ──────────────────────────────────── */
(function explorer() {
  const tabs = $$('.function');
  const panel = $('#functionPanel');
  const text = $('#functionText');
  if (!tabs.length || !text) return;

  function select(btn, { move = true } = {}) {
    tabs.forEach((t) => { t.classList.toggle('is-active', t === btn); t.setAttribute('aria-selected', String(t === btn)); });
    if (btn.id) panel.setAttribute('aria-labelledby', btn.id);
    const key = `fn.${btn.dataset.domain}.copy`;
    panel.classList.add('is-swapping');
    setTimeout(() => {
      text.dataset.i18n = key;
      text.textContent = (I18N[lang] && I18N[lang][key]) || text.textContent;
      panel.classList.remove('is-swapping');
    }, reduced ? 0 : 180);
    if (move) setFocus(btn.dataset.domain, 'hover');
  }

  tabs.forEach((btn) => {
    btn.addEventListener('mouseenter', () => select(btn));
    btn.addEventListener('focus', () => select(btn));
    btn.addEventListener('click', (e) => { e.preventDefault(); select(btn); });
  });
  tabs.forEach((btn, i) => btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
  }));
})();

/* ── focus routing (hover on cards drives the network) ───────── */
function setFocus(domain, source) {
  if (source === 'hover') hoverFocus = domain;
  if (!net) return;
  net.setFocus(domain || stickyFocus || null);
}
function clearFocus() {
  hoverFocus = null;
  if (net) net.setFocus(stickyFocus || null);
}
$$('[data-domain]').forEach((el) => {
  const d = el.dataset.domain;
  const enter = () => setFocus(d, 'hover');
  el.addEventListener('mouseenter', enter);
  el.addEventListener('focusin', enter);
  el.addEventListener('mouseleave', clearFocus);
  el.addEventListener('focusout', clearFocus);
});

/* ── diagnostic lab ──────────────────────────────────────────── */
const labForm = $('#labForm');
const labInput = $('#labInput');
const labOut = $('#labOut');

function renderDiagnosis(query, { silent = false } = {}) {
  const res = I18N.diagnose(query, lang);
  lastDiagnosis = { query, res };
  const dict = I18N[lang];
  labOut.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'lab-result';
  const head = document.createElement('div');
  head.className = 'lab-result__head';
  head.innerHTML = `<span class="mono lab-result__label">${dict['lab.resultLabel'] || ''}</span>`;
  const title = document.createElement('h3');
  title.className = 'lab-result__title';
  title.textContent = res.title;
  head.appendChild(title);
  wrap.appendChild(head);

  const grid = document.createElement('div');
  grid.className = 'lab-cards';
  res.cards.forEach((c, i) => {
    const card = document.createElement('article');
    card.className = 'lab-card';
    card.style.setProperty('--i', i);
    const kind = document.createElement('span');
    kind.className = 'mono lab-card__kind';
    kind.textContent = c[0];
    const h = document.createElement('h4');
    h.textContent = c[1];
    const p = document.createElement('p');
    p.textContent = c[2];
    card.append(kind, h, p);
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  const note = document.createElement('p');
  note.className = 'lab-note';
  note.textContent = dict['lab.note'] || '';
  wrap.appendChild(note);
  labOut.appendChild(wrap);

  stickyFocus = res.domain || null;
  if (net && !silent) { net.setFocus(stickyFocus); net.burst(1); }
}

if (labForm) {
  labForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (labInput.value || '').trim() || labInput.placeholder;
    renderDiagnosis(q);
  });
  $$('.lab__examples button').forEach((b) => {
    b.addEventListener('click', () => {
      labInput.value = b.textContent.trim();
      renderDiagnosis(labInput.value);
      labInput.focus({ preventScroll: true });
    });
  });
}

/* ── pointer, cursor, magnetics ──────────────────────────────── */
(function pointer() {
  const cursor = $('#cursor');
  const dot = cursor && cursor.querySelector('.cursor__dot');
  const ring = cursor && cursor.querySelector('.cursor__ring');
  let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
  let dx = rx, dy = ry;
  let raf = 0;

  function loop() {
    raf = 0;
    dx += (rx - dx) * 0.18;
    dy += (ry - dy) * 0.18;
    if (dot) dot.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    if (ring) ring.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    if (Math.abs(rx - dx) > 0.4 || Math.abs(ry - dy) > 0.4) raf = requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', (e) => {
    rx = e.clientX; ry = e.clientY;
    if (net) net.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    if (finePointer && !raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  if (finePointer && !reduced) {
    body.classList.add('has-cursor');
    const hot = 'a, button, input, summary, .agent, .svc__row, .outcome';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hot)) body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hot)) body.classList.remove('cursor-hot');
    });
  }

  // touch: drag anywhere to steer the network
  window.addEventListener('touchmove', (e) => {
    if (!net || !e.touches[0]) return;
    net.setPointer((e.touches[0].clientX / window.innerWidth) * 2 - 1, (e.touches[0].clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  document.addEventListener('click', (e) => {
    if (net && e.target.closest && e.target.closest('a, button')) net.burst(0.5);
  });

  if (!reduced && finePointer) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.22;
        const my = (e.clientY - r.top - r.height / 2) * 0.32;
        el.style.transform = `translate(${mx}px, ${my}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
})();

/* ── misc ────────────────────────────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

document.addEventListener('visibilitychange', () => {
  if (!net) return;
  if (document.hidden) net.pause(); else net.resume();
});

// in-page anchors keep the sticky header clear
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#' || id === '#top') return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    const top = t.getBoundingClientRect().top + window.scrollY - (id === '#contenido' ? 0 : 10);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  });
});

/* ── WebGL bootstrap (progressive enhancement) ───────────────── */
function canRunWebGL() {
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
  if (!canvas || !canRunWebGL()) { body.classList.add('no-webgl'); requestFrame(); return; }
  try {
    const mod = await import('./scene.js');
    net = mod.createNetwork(canvas, { reducedMotion: reduced });
    net.start();
    body.classList.add('scene-ready');
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      body.classList.add('no-webgl');
      body.classList.remove('scene-ready');
      net = null;
    });
    requestFrame();
    const active = document.querySelector('.function.is-active');
    if (active) net.setFocus(active.dataset.domain);
    setTimeout(() => { if (net && !hoverFocus && !stickyFocus) net.setFocus(null); }, 2600);
  } catch (err) {
    console.warn('[alphamilz] WebGL scene unavailable:', err);
    body.classList.add('no-webgl');
    requestFrame();
  }
})();
