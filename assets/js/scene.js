/* ═══════════════════════════════════════════════════════════════
   Alphamilz · evolving business intelligence network.
   One Points cloud (nodes), one LineSegments (connections),
   one Points cloud (data in transit) and a few glass agents.
   Everything morphs procedurally between four layouts.
   ═══════════════════════════════════════════════════════════════ */
import * as THREE from '../vendor/three.module.min.js';

export const DOMAINS = ['customers', 'sales', 'marketing', 'operations', 'finance', 'support', 'knowledge'];

/* ── helpers ─────────────────────────────────────────────────── */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NODE_VERT = `
attribute float aSize;
attribute float aAct;
attribute float aSeed;
uniform float uTime;
uniform float uPixel;
uniform float uFocusDist;
varying float vAct;
varying float vBlur;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float dist = max(-mv.z, 1.0);
  float blur = clamp(abs(dist - uFocusDist) / 34.0, 0.0, 1.0);
  vBlur = blur;
  vAct = aAct;
  float breathe = 0.88 + 0.12 * sin(uTime * 1.6 + aSeed * 21.0);
  gl_PointSize = aSize * breathe * (1.0 + aAct * 1.15) * (1.0 + blur * 0.85) * (230.0 / dist) * uPixel;
  gl_Position = projectionMatrix * mv;
}`;

const NODE_FRAG = `
precision mediump float;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vAct;
varying float vBlur;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.05, d);
  float halo = smoothstep(0.5, 0.0, d);
  float shape = mix(core, halo * 0.6, vBlur);
  vec3 col = mix(uBase, uAccent, clamp(vAct * 1.15, 0.0, 1.0));
  float a = shape * (0.20 + 0.55 * vAct) * uOpacity * (1.0 - vBlur * 0.55);
  gl_FragColor = vec4(col, a);
}`;

const LINE_VERT = `
attribute float aAlpha;
varying float vAlpha;
varying float vFog;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFog = clamp((-mv.z - 18.0) / 52.0, 0.0, 1.0);
  vAlpha = aAlpha;
  gl_Position = projectionMatrix * mv;
}`;

const LINE_FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
varying float vFog;
void main(){
  gl_FragColor = vec4(uColor, vAlpha * uOpacity * (1.0 - vFog * 0.75));
}`;

const FLOW_VERT = `
attribute float aSize;
attribute float aLife;
uniform float uPixel;
varying float vLife;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float dist = max(-mv.z, 1.0);
  vLife = aLife;
  gl_PointSize = aSize * (230.0 / dist) * uPixel;
  gl_Position = projectionMatrix * mv;
}`;

const FLOW_FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform float uOpacity;
varying float vLife;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float shape = smoothstep(0.5, 0.0, d);
  float fade = sin(vLife * 3.14159);
  gl_FragColor = vec4(uColor, shape * fade * uOpacity);
}`;

const GLASS_VERT = `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normalize(position));
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const GLASS_FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uRim;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float f = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 2.6);
  vec3 col = mix(uColor, uRim, f * 0.55);
  gl_FragColor = vec4(col, (0.012 + f * 0.72) * uOpacity);
}`;

/* ── main factory ────────────────────────────────────────────── */
export function createNetwork(canvas, options = {}) {
  const reduced = !!options.reducedMotion;
  let W = window.innerWidth, H = window.innerHeight;

  const tier = W < 680 ? 0 : W < 1180 ? 1 : 2;
  const NODES = [150, 230, 310][tier];
  const MAX_LINKS = [420, 760, 1100][tier];
  const FLOWS = reduced ? 0 : [70, 140, 210][tier];
  const AGENTS = tier === 0 ? 3 : 5;

  // Every material here is a custom ShaderMaterial that writes final colours
  // directly, so we keep THREE.Color values in sRGB and ask the renderer not to
  // re-encode them. Without this, linear values land in an sRGB buffer and the
  // additive passes drift towards yellow-green.
  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: tier > 0, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  let dpr = Math.min(window.devicePixelRatio || 1, tier === 0 ? 1.75 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);

  const scene = new THREE.Scene();
  const world = new THREE.Group();
  scene.add(world);

  const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 220);
  camera.position.set(0, 0, 52);

  /* ── palette ─────────────────────────────────────────────── */
  const PAL = {
    darkBase: new THREE.Color('#EDEAE2'),
    darkAccent: new THREE.Color('#6E94FF'),
    darkLine: new THREE.Color('#8EA6D8'),
    lightBase: new THREE.Color('#14181F'),
    lightAccent: new THREE.Color('#2A4FD8'),
    lightLine: new THREE.Color('#4A5468')
  };
  const cBase = new THREE.Color(), cAccent = new THREE.Color(), cLine = new THREE.Color();

  /* ── node model ──────────────────────────────────────────── */
  const rnd = mulberry32(20260912);
  const domainOf = new Uint8Array(NODES);
  const isAgent = new Uint8Array(NODES);
  const seeds = new Float32Array(NODES);
  const baseSize = new Float32Array(NODES);

  const L = [new Float32Array(NODES * 3), new Float32Array(NODES * 3), new Float32Array(NODES * 3), new Float32Array(NODES * 3)];
  const focusTarget = new Float32Array(NODES * 3);
  const positions = new Float32Array(NODES * 3);
  const sizes = new Float32Array(NODES);
  const acts = new Float32Array(NODES);
  const actTarget = new Float32Array(NODES);

  const nDomains = DOMAINS.length;
  // fragmented cluster anchors (wide, uneven, disconnected)
  const frag = [], ring = [], ringWide = [];
  for (let d = 0; d < nDomains; d++) {
    const a = (d / nDomains) * Math.PI * 2 + rnd() * 0.9;
    const r = 19 + rnd() * 13;
    frag.push([Math.cos(a) * r, Math.sin(a) * r * 0.6 + (rnd() - 0.5) * 8, (rnd() - 0.5) * 22]);
    const a2 = (d / nDomains) * Math.PI * 2 - 0.35;
    ring.push([Math.cos(a2) * 17, Math.sin(a2) * 11.5, Math.sin(a2 * 2.1) * 5]);
    ringWide.push([Math.cos(a2) * 22.5, Math.sin(a2) * 15, Math.cos(a2 * 1.7) * 7]);
  }

  for (let i = 0; i < NODES; i++) {
    const d = i % nDomains;
    domainOf[i] = d;
    seeds[i] = rnd();
    isAgent[i] = (i % 9 === 3) ? 1 : 0;
    baseSize[i] = (isAgent[i] ? 2.5 : 1.15 + rnd() * 1.05) * (tier === 0 ? 0.9 : 1);

    const g = () => (rnd() + rnd() + rnd() - 1.5) * 1.25; // soft gaussian

    // 0 · fragmented
    let k = i * 3;
    L[0][k] = frag[d][0] + g() * 4.6;
    L[0][k + 1] = frag[d][1] + g() * 4.2;
    L[0][k + 2] = frag[d][2] + g() * 4.0;

    // 1 · connected
    L[1][k] = ring[d][0] + g() * 3.2;
    L[1][k + 1] = ring[d][1] + g() * 3.0;
    L[1][k + 2] = ring[d][2] + g() * 2.6;

    // 2 · agents at work
    if (isAgent[i]) {
      const a = rnd() * Math.PI * 2, r = 5.5 + rnd() * 2.6;
      L[2][k] = Math.cos(a) * r;
      L[2][k + 1] = Math.sin(a) * r * 0.8;
      L[2][k + 2] = (rnd() - 0.5) * 5;
    } else {
      L[2][k] = ringWide[d][0] + g() * 3.1;
      L[2][k + 1] = ringWide[d][1] + g() * 2.9;
      L[2][k + 2] = ringWide[d][2] + g() * 2.6;
    }

    // 3 · coordinated organism (fibonacci shell, banded by domain)
    const t = (i + 0.5) / NODES;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const R = isAgent[i] ? 7.4 : 13.4 + Math.sin(d * 1.7 + i * 0.13) * 1.1;
    L[3][k] = Math.sin(phi) * Math.cos(theta) * R;
    L[3][k + 1] = Math.sin(phi) * Math.sin(theta) * R * 0.82;
    L[3][k + 2] = Math.cos(phi) * R * 0.9;

    positions[k] = L[0][k]; positions[k + 1] = L[0][k + 1]; positions[k + 2] = L[0][k + 2];
    sizes[i] = baseSize[i];
    acts[i] = 0.08;
  }

  // focus constellation: a readable ring in front of the camera
  for (let i = 0; i < NODES; i++) {
    const a = (i / NODES) * Math.PI * 2 * 3.0;
    const r = 6.5 + (i % 5) * 1.15;
    focusTarget[i * 3] = Math.cos(a) * r;
    focusTarget[i * 3 + 1] = Math.sin(a) * r * 0.72;
    focusTarget[i * 3 + 2] = 4 + Math.sin(i * 0.7) * 2.2;
  }

  /* ── node object ─────────────────────────────────────────── */
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  nodeGeo.setAttribute('aAct', new THREE.BufferAttribute(acts, 1));
  nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const nodeMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uPixel: { value: dpr }, uFocusDist: { value: 52 },
      uBase: { value: cBase }, uAccent: { value: cAccent }, uOpacity: { value: 1 }
    },
    vertexShader: NODE_VERT, fragmentShader: NODE_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  nodePoints.frustumCulled = false;
  world.add(nodePoints);

  /* ── links ───────────────────────────────────────────────── */
  const linkPairs = new Int32Array(MAX_LINKS * 2);
  let linkCount = 0;
  const linkPos = new Float32Array(MAX_LINKS * 6);
  const linkAlpha = new Float32Array(MAX_LINKS * 2);
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
  linkGeo.setAttribute('aAlpha', new THREE.BufferAttribute(linkAlpha, 1));
  const linkMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: cLine }, uOpacity: { value: 0.55 } },
    vertexShader: LINE_VERT, fragmentShader: LINE_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const links = new THREE.LineSegments(linkGeo, linkMat);
  links.frustumCulled = false;
  world.add(links);

  /* ── data in transit ─────────────────────────────────────── */
  const flowPos = new Float32Array(Math.max(FLOWS, 1) * 3);
  const flowSize = new Float32Array(Math.max(FLOWS, 1));
  const flowLife = new Float32Array(Math.max(FLOWS, 1));
  const flowLink = new Int32Array(Math.max(FLOWS, 1));
  const flowT = new Float32Array(Math.max(FLOWS, 1));
  const flowSpeed = new Float32Array(Math.max(FLOWS, 1));
  for (let i = 0; i < FLOWS; i++) {
    flowLink[i] = -1; flowT[i] = rnd();
    flowSpeed[i] = 0.28 + rnd() * 0.5;
    flowSize[i] = 1.5 + rnd() * 1.8;
  }
  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  flowGeo.setAttribute('aSize', new THREE.BufferAttribute(flowSize, 1));
  flowGeo.setAttribute('aLife', new THREE.BufferAttribute(flowLife, 1));
  const flowMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#9CB6FF') }, uPixel: { value: dpr }, uOpacity: { value: 1 } },
    vertexShader: FLOW_VERT, fragmentShader: FLOW_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const flows = new THREE.Points(flowGeo, flowMat);
  flows.frustumCulled = false;
  if (FLOWS) world.add(flows);

  /* ── glass agents ────────────────────────────────────────── */
  const agentGeo = new THREE.OctahedronGeometry(1.15, 0);
  const agentEdges = new THREE.EdgesGeometry(agentGeo);
  const agentMeshes = [];
  for (let i = 0; i < AGENTS; i++) {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#5C86FF') },
        uRim: { value: new THREE.Color('#EDE8DB') },
        uOpacity: { value: 0 }
      },
      vertexShader: GLASS_VERT, fragmentShader: GLASS_FRAG,
      transparent: true, depthWrite: false, side: THREE.DoubleSide
    });
    const m = new THREE.Mesh(agentGeo, mat);
    const wire = new THREE.LineSegments(agentEdges, new THREE.LineBasicMaterial({
      transparent: true, depthWrite: false, opacity: 0
    }));
    m.add(wire);
    m.userData = { a: (i / AGENTS) * Math.PI * 2, r: 9.4 + (i % 2) * 1.8, s: 0.8 + (i % 3) * 0.22, wire };
    m.frustumCulled = false;
    world.add(m);
    agentMeshes.push(m);
  }

  /* ── state ───────────────────────────────────────────────── */
  const state = {
    phase: 0, phaseT: 0,
    theme: 0, themeT: 0,
    focus: -1, focusMix: 0, focusMixT: 0,
    pointer: { x: 0, y: 0 }, ptr: { x: 0, y: 0 },
    offsetX: 0, offsetXT: 0,
    burst: 0,
    quality: 1,
    opacity: 0, opacityT: 1, presence: 1, presenceT: 1
  };
  let linksDirty = true, lastBuild = -1, lastBuildTime = -9, running = true, raf = 0;
  const clock = new THREE.Clock();

  /* ── link construction ───────────────────────────────────── */
  function buildLinks() {
    const p = state.phase;
    const crossOK = p > 0.24 || state.focusMix > 0.3;
    const k = p < 0.2 ? 2 : p < 0.5 ? 3 : 4;
    const maxDist = (p < 0.2 ? 9 : 16 + p * 12) ** 2;
    const seen = new Set();
    let n = 0;
    const cand = [];
    for (let i = 0; i < NODES && n < MAX_LINKS; i++) {
      cand.length = 0;
      const ix = positions[i * 3], iy = positions[i * 3 + 1], iz = positions[i * 3 + 2];
      for (let j = 0; j < NODES; j++) {
        if (j === i) continue;
        if (!crossOK && domainOf[j] !== domainOf[i]) continue;
        const dx = positions[j * 3] - ix, dy = positions[j * 3 + 1] - iy, dz = positions[j * 3 + 2] - iz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > maxDist) continue;
        cand.push(d2, j);
      }
      // partial selection of the k nearest
      for (let s = 0; s < k && n < MAX_LINKS; s++) {
        let bi = -1, bd = Infinity;
        for (let c = 0; c < cand.length; c += 2) if (cand[c] < bd) { bd = cand[c]; bi = c; }
        if (bi < 0) break;
        const j = cand[bi + 1];
        cand[bi] = Infinity;
        const key = i < j ? i * NODES + j : j * NODES + i;
        if (seen.has(key)) continue;
        seen.add(key);
        linkPairs[n * 2] = i; linkPairs[n * 2 + 1] = j;
        n++;
      }
    }
    linkCount = n;
    linkGeo.setDrawRange(0, linkCount * 2);
    linksDirty = false;
  }

  /* ── per frame ───────────────────────────────────────────── */
  function updatePositions(dt, time) {
    const p = state.phase;
    const seg = clamp(p, 0, 0.9999) * 3;
    const si = Math.floor(seg);
    const st = smooth(seg - si);
    const A = L[si], B = L[Math.min(si + 1, 3)];
    const fm = state.focusMix;
    const drift = reduced ? 0 : 1;
    const chaos = 1 - smooth(p);          // fragmented layouts jitter more
    const amp = 0.55 + chaos * 0.75;

    for (let i = 0; i < NODES; i++) {
      const k = i * 3;
      let x = lerp(A[k], B[k], st);
      let y = lerp(A[k + 1], B[k + 1], st);
      let z = lerp(A[k + 2], B[k + 2], st);

      if (fm > 0.001) {
        const match = domainOf[i] === state.focus;
        if (match) {
          const f = fm * 0.78;
          x = lerp(x, focusTarget[k], f);
          y = lerp(y, focusTarget[k + 1], f);
          z = lerp(z, focusTarget[k + 2], f);
        } else {
          const push = 1 + fm * 0.26;
          x *= push; y *= push; z = z * push - fm * 5;
        }
      }

      if (drift) {
        const s = seeds[i] * 100;
        x += Math.sin(time * 0.42 + s) * amp;
        y += Math.cos(time * 0.37 + s * 1.31) * amp * 0.9;
        z += Math.sin(time * 0.29 + s * 0.77) * amp * 1.1;
      }

      positions[k] = x; positions[k + 1] = y; positions[k + 2] = z;

      // activity relaxation
      const a = acts[i];
      acts[i] = a + (actTarget[i] - a) * Math.min(1, dt * 2.6);
      if (actTarget[i] > 0.25) actTarget[i] = Math.max(0.05, actTarget[i] - dt * 0.55);
      sizes[i] = baseSize[i] * (1 + state.burst * 0.5);
    }
    nodeGeo.attributes.position.needsUpdate = true;
    nodeGeo.attributes.aAct.needsUpdate = true;
    nodeGeo.attributes.aSize.needsUpdate = true;
  }

  function updateLinks() {
    const fm = state.focusMix;
    for (let l = 0; l < linkCount; l++) {
      const i = linkPairs[l * 2], j = linkPairs[l * 2 + 1];
      const o = l * 6;
      linkPos[o] = positions[i * 3]; linkPos[o + 1] = positions[i * 3 + 1]; linkPos[o + 2] = positions[i * 3 + 2];
      linkPos[o + 3] = positions[j * 3]; linkPos[o + 4] = positions[j * 3 + 1]; linkPos[o + 5] = positions[j * 3 + 2];
      let a = 0.11 + 0.24 * Math.max(acts[i], acts[j]);
      if (fm > 0.001) {
        const hot = domainOf[i] === state.focus || domainOf[j] === state.focus;
        a = hot ? a + fm * 0.34 : a * (1 - fm * 0.82);
      }
      linkAlpha[l * 2] = a; linkAlpha[l * 2 + 1] = a;
    }
    linkGeo.attributes.position.needsUpdate = true;
    linkGeo.attributes.aAlpha.needsUpdate = true;
  }

  function updateFlows(dt) {
    if (!FLOWS || !linkCount) return;
    const fm = state.focusMix;
    const density = 0.25 + smooth(state.phase) * 0.75;
    for (let i = 0; i < FLOWS; i++) {
      let li = flowLink[i];
      if (li < 0 || li >= linkCount) {
        if (Math.random() > density) { flowLife[i] = 0; continue; }
        li = flowLink[i] = (Math.random() * linkCount) | 0;
        flowT[i] = 0;
      }
      flowT[i] += dt * flowSpeed[i];
      if (flowT[i] >= 1) {
        const a = linkPairs[li * 2], b = linkPairs[li * 2 + 1];
        actTarget[b] = 1; actTarget[a] = Math.max(actTarget[a], 0.4);
        flowLink[i] = -1; flowLife[i] = 0;
        continue;
      }
      const a = linkPairs[li * 2] * 3, b = linkPairs[li * 2 + 1] * 3;
      const t = flowT[i];
      flowPos[i * 3] = lerp(positions[a], positions[b], t);
      flowPos[i * 3 + 1] = lerp(positions[a + 1], positions[b + 1], t);
      flowPos[i * 3 + 2] = lerp(positions[a + 2], positions[b + 2], t);
      let life = t;
      if (fm > 0.001) {
        const hot = domainOf[linkPairs[li * 2]] === state.focus || domainOf[linkPairs[li * 2 + 1]] === state.focus;
        if (!hot) life = 0;
      }
      flowLife[i] = life;
    }
    flowGeo.attributes.position.needsUpdate = true;
    flowGeo.attributes.aLife.needsUpdate = true;
  }

  function updateAgents(time) {
    const p = state.phase;
    const vis = smooth((p - 0.34) / 0.22) * (1 - smooth((p - 0.9) / 0.14) * 0.55);
    for (let i = 0; i < agentMeshes.length; i++) {
      const m = agentMeshes[i], u = m.userData;
      const a = u.a + time * 0.19 * u.s;
      const r = u.r * (1 - state.focusMix * 0.35);
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.55 + Math.sin(time * 0.7 + i) * 0.9, Math.sin(a * 1.3) * 4.5);
      m.rotation.x = time * 0.35 * u.s;
      m.rotation.y = time * 0.28 + i;
      const sc = 0.8 + vis * 0.5;
      m.scale.setScalar(sc);
      const alpha = vis * (0.55 + state.burst * 0.4) * state.presence * state.presence * (1 - state.theme * 0.35);
      m.material.uniforms.uOpacity.value = alpha;
      m.material.uniforms.uRim.value.copy(cBase);
      m.material.uniforms.uColor.value.copy(cAccent);
      u.wire.material.color.copy(cAccent);
      u.wire.material.opacity = alpha * 0.5;
    }
  }

  /* random firing: nodes talking to each other */
  let fireAcc = 0;
  function fireNodes(dt) {
    if (reduced) return;
    fireAcc += dt;
    const every = 0.09;
    while (fireAcc > every) {
      fireAcc -= every;
      const i = (Math.random() * NODES) | 0;
      if (state.focus >= 0 && domainOf[i] !== state.focus && Math.random() < 0.75) continue;
      actTarget[i] = 0.85 + Math.random() * 0.15;
    }
  }

  /* ── loop ────────────────────────────────────────────────── */
  let frameSamples = 0, frameAcc = 0, degraded = false;

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    // eased state
    state.phase += (state.phaseT - state.phase) * Math.min(1, dt * 3.4);
    state.theme += (state.themeT - state.theme) * Math.min(1, dt * 2.6);
    state.focusMix += (state.focusMixT - state.focusMix) * Math.min(1, dt * 3.8);
    state.opacity += (state.opacityT - state.opacity) * Math.min(1, dt * 2.2);
    state.presence += (state.presenceT - state.presence) * Math.min(1, dt * 1.9);
    state.offsetX += (state.offsetXT - state.offsetX) * Math.min(1, dt * 1.6);
    state.burst *= Math.max(0, 1 - dt * 1.6);
    state.ptr.x += (state.pointer.x - state.ptr.x) * Math.min(1, dt * 2.4);
    state.ptr.y += (state.pointer.y - state.ptr.y) * Math.min(1, dt * 2.4);

    // colors follow the page theme
    cBase.copy(PAL.darkBase).lerp(PAL.lightBase, state.theme);
    cAccent.copy(PAL.darkAccent).lerp(PAL.lightAccent, state.theme);
    cLine.copy(PAL.darkLine).lerp(PAL.lightLine, state.theme);
    const wantNormal = state.theme > 0.55;
    if (wantNormal !== (nodeMat.blending === THREE.NormalBlending)) {
      const b = wantNormal ? THREE.NormalBlending : THREE.AdditiveBlending;
      nodeMat.blending = b; linkMat.blending = b; flowMat.blending = b;
      nodeMat.needsUpdate = linkMat.needsUpdate = flowMat.needsUpdate = true;
      agentMeshes.forEach((m) => {
        m.material.blending = b; m.material.needsUpdate = true;
        m.userData.wire.material.blending = b; m.userData.wire.material.needsUpdate = true;
      });
    }
    flowMat.uniforms.uColor.value.copy(cAccent);
    const vis = state.opacity * state.presence * (1 - state.theme * 0.24);
    linkMat.uniforms.uOpacity.value = (state.theme > 0.55 ? 0.5 : 0.62) * vis;
    nodeMat.uniforms.uOpacity.value = vis;
    flowMat.uniforms.uOpacity.value = vis * 0.95;
    nodeMat.uniforms.uTime.value = time;

    fireNodes(dt);
    updatePositions(dt, time);

    // rebuild topology on a budget: the network keeps re-wiring itself,
    // but never more than a few times a second (it is the one O(n^2) pass).
    const bucket = Math.round(state.phase * 12) + (state.focus + 2) * 100;
    const since = time - lastBuildTime;
    if ((linksDirty && since > 0.12) || (bucket !== lastBuild && since > 0.3) || (!reduced && since > 1.6)) {
      buildLinks(); lastBuildTime = time; lastBuild = bucket;
    }
    updateLinks();
    updateFlows(dt);
    updateAgents(time);

    // camera: framing per chapter + parallax
    const p = smooth(state.phase);
    const zBase = [60, 50, 46][tier];
    const z = zBase - p * 6 - state.focusMix * 8 + Math.sin(time * 0.12) * 0.7;
    camera.position.x += (state.ptr.x * 4.2 - camera.position.x) * Math.min(1, dt * 2.2);
    camera.position.y += (-state.ptr.y * 3.0 - camera.position.y) * Math.min(1, dt * 2.2);
    camera.position.z += (z - camera.position.z) * Math.min(1, dt * 1.8);
    camera.lookAt(state.ptr.x * 1.2, -state.ptr.y * 0.8, 0);
    nodeMat.uniforms.uFocusDist.value = camera.position.z - state.focusMix * 4;

    world.position.x = state.offsetX;
    world.rotation.y = state.ptr.x * 0.24 + (reduced ? 0 : time * 0.022) + state.phase * 0.5;
    world.rotation.x = -state.ptr.y * 0.18 + Math.sin(time * 0.09) * 0.03;

    renderer.render(scene, camera);

    // adaptive quality
    if (!degraded) {
      frameAcc += dt; frameSamples++;
      if (frameSamples > 120) {
        const avg = frameAcc / frameSamples;
        if (avg > 0.026) {
          degraded = true;
          dpr = Math.max(1, dpr * 0.75);
          renderer.setPixelRatio(dpr);
          nodeMat.uniforms.uPixel.value = dpr;
          flowMat.uniforms.uPixel.value = dpr;
        }
        frameAcc = 0; frameSamples = 0;
      }
    }
  }

  /* ── public api ──────────────────────────────────────────── */
  const api = {
    start() { if (!raf) { clock.start(); raf = requestAnimationFrame(frame); } state.opacityT = 1; },
    setPhase(p) { state.phaseT = clamp(p, 0, 1); },
    setPresence(v) { state.presenceT = clamp(v, 0, 1); },
    setOffset(x) { state.offsetXT = tier > 0 ? clamp(x, -14, 14) : 0; },
    setTheme(t) { state.themeT = clamp(t, 0, 1); },
    setFocus(domain) {
      const idx = typeof domain === 'string' ? DOMAINS.indexOf(domain) : -1;
      state.focus = idx;
      state.focusMixT = idx >= 0 ? 1 : 0;
      linksDirty = true;
      if (idx >= 0) for (let i = 0; i < NODES; i++) if (domainOf[i] === idx) actTarget[i] = 0.95;
    },
    burst(strength = 1) {
      state.burst = Math.min(1.4, state.burst + strength);
      for (let i = 0; i < NODES; i++) if (Math.random() < 0.5) actTarget[i] = 0.9;
      linksDirty = true;
    },
    setPointer(x, y) { state.pointer.x = clamp(x, -1, 1); state.pointer.y = clamp(y, -1, 1); },
    pause() { running = false; },
    resume() { running = true; clock.getDelta(); },
    resize() {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    },
    dispose() {
      cancelAnimationFrame(raf); raf = 0;
      nodeGeo.dispose(); linkGeo.dispose(); flowGeo.dispose(); agentGeo.dispose(); agentEdges.dispose();
      nodeMat.dispose(); linkMat.dispose(); flowMat.dispose();
      agentMeshes.forEach((m) => { m.material.dispose(); m.userData.wire.material.dispose(); });
      renderer.dispose();
    },
    info: { nodes: NODES, maxLinks: MAX_LINKS, flows: FLOWS, tier }
  };

  buildLinks();
  nodeMat.uniforms.uPixel.value = dpr;
  flowMat.uniforms.uPixel.value = dpr;
  return api;
}

export function webglSupported() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
