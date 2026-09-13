/* ═══════════════════════════════════════════════════════════════
   Alphamilz · escena 3D
   El isotipo extruido en vidrio, girando con el scroll, más un
   pequeño ecosistema de objetos que acompañan a cada sección.
   ═══════════════════════════════════════════════════════════════ */
import * as THREE from '../vendor/three.module.min.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const BASE_TINT = new THREE.Color('#E8EFF8');
const lerp = (a, b, t) => a + (b - a) * t;

/* Isotipo Alphamilz en coordenadas de path (y invertida para three) */
function markShapes() {
  const blade = new THREE.Shape();
  blade.moveTo(430, -14);
  blade.bezierCurveTo(300, -300, 140, -640, 14, -978);
  blade.lineTo(512, -884);
  blade.lineTo(508, -731);
  blade.lineTo(233, -731);
  blade.closePath();

  const wing = new THREE.Shape();
  wing.moveTo(458, -300);
  wing.bezierCurveTo(628, -440, 726, -660, 722, -926);
  wing.bezierCurveTo(656, -836, 546, -794, 487, -727);
  wing.bezierCurveTo(503, -582, 492, -420, 458, -300);
  wing.closePath();

  return [blade, wing];
}

/* Entorno de reflejos: degradado de marca en una textura equirectangular */
function brandEnvironment(renderer) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#05060A';
  g.fillRect(0, 0, 512, 256);
  // bandas de estudio: el contraste duro es lo que hace que el cromo lea como cromo
  const bands = [
    [0, 34, '#0A0D18'], [34, 26, '#F4FAFF'], [60, 18, '#0A0D18'],
    [78, 40, '#C8D6E8'], [118, 22, '#5200FF'], [140, 30, '#0A0D18'],
    [170, 26, '#A6F700'], [196, 22, '#141826'], [218, 38, '#2A3044']
  ];
  for (const [y0, h, col] of bands) { g.fillStyle = col; g.fillRect(0, y0, 512, h); }
  // vetas verticales: dan variación a las caras planas del isotipo
  g.globalAlpha = 0.5;
  for (let i = 0; i < 9; i++) {
    const x = (i * 57 + 12) % 512;
    g.fillStyle = i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#0A0D18' : '#7A8CA8';
    g.fillRect(x, 0, 6 + (i % 3) * 5, 256);
  }
  g.globalAlpha = 1;
  // reflejos puntuales, como luces de estudio
  const spots = [[110, 44, 52], [330, 92, 74], [455, 40, 38], [210, 176, 46]];
  for (const [x, y, r] of spots) {
    const sg = g.createRadialGradient(x, y, 0, x, y, r);
    sg.addColorStop(0, 'rgba(255,255,255,.95)');
    sg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sg;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose(); pmrem.dispose();
  return env;
}

export function createScene(canvas, options = {}) {
  const reduced = !!options.reducedMotion;
  let W = window.innerWidth, H = window.innerHeight;
  const tier = W < 700 ? 0 : W < 1180 ? 1 : 2;

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false
  });
  renderer.setClearColor(0x000000, 0);
  let dpr = Math.min(window.devicePixelRatio || 1, tier === 0 ? 1.6 : 1.9);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0, 16);

  const env = brandEnvironment(renderer);
  scene.environment = env;

  /* ── luces ─────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xA6F700, 3.2);
  rim.position.set(-6, -2, -4);
  scene.add(rim);
  const back = new THREE.DirectionalLight(0xffffff, 1.4);
  back.position.set(-2, 5, -7);
  scene.add(back);
  const fill = new THREE.PointLight(0x5200FF, 60, 40);
  fill.position.set(-5, 4, 6);
  scene.add(fill);

  /* ── isotipo extruido ──────────────────────────────────────── */
  const geo = new THREE.ExtrudeGeometry(markShapes(), {
    depth: 150,
    bevelEnabled: true,
    bevelThickness: 44,
    bevelSize: 30,
    bevelSegments: tier === 0 ? 2 : 4,
    curveSegments: tier === 0 ? 10 : 20
  });
  geo.center();
  geo.scale(0.0052, 0.0052, 0.0052);
  geo.computeVertexNormals();

  const markMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DCE6F2'),
    metalness: 1,
    roughness: 0.055,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 0.55,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [120, 520],
    envMapIntensity: 1.9
  });
  const mark = new THREE.Mesh(geo, markMat);
  scene.add(mark);

  /* halo detrás del isotipo */
  const haloMat = new THREE.SpriteMaterial({
    color: new THREE.Color('#A6F700'),
    transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending,
    map: (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d');
      const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      rg.addColorStop(0, 'rgba(255,255,255,1)');
      rg.addColorStop(0.35, 'rgba(255,255,255,.35)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })()
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(16, 16, 1);
  halo.position.z = -3;
  scene.add(halo);

  /* ── satélites: pequeños objetos de marca ──────────────────── */
  const SAT = tier === 0 ? 3 : tier === 1 ? 5 : 7;
  const satGeos = [
    new THREE.IcosahedronGeometry(0.42, 0),
    new THREE.TorusGeometry(0.36, 0.13, 12, 32),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.OctahedronGeometry(0.44, 0),
    new THREE.CapsuleGeometry(0.2, 0.4, 4, 12)
  ];
  const satColors = ['#A6F700', '#5200FF', '#8645F9', '#6CB7FF', '#EAF3FF'];
  const sats = [];
  for (let i = 0; i < SAT; i++) {
    const g = satGeos[i % satGeos.length];
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(satColors[i % satColors.length]),
      metalness: 0.15, roughness: 0.18, transmission: 0.75, thickness: 1.1,
      ior: 1.4, clearcoat: 1, envMapIntensity: 1.2, transparent: true
    });
    const mesh = new THREE.Mesh(g, m);
    const a = (i / SAT) * Math.PI * 2;
    mesh.userData = {
      a, r: 5.6 + (i % 3) * 1.8, y: (i % 2 ? 1 : -1) * (1.4 + (i % 3) * 0.9),
      sp: 0.12 + (i % 4) * 0.05, spin: 0.2 + (i % 3) * 0.18
    };
    scene.add(mesh);
    sats.push(mesh);
  }

  /* ── estado ────────────────────────────────────────────────── */
  const st = {
    prog: 0, progT: 0,
    accent: new THREE.Color('#A6F700'), accentT: new THREE.Color('#A6F700'),
    ox: 0, oxT: 0, oy: 0, oyT: 0, sc: 1, scT: 1,
    ptr: { x: 0, y: 0 }, ptrT: { x: 0, y: 0 },
    opacity: 0, opacityT: 1, dim: 1, dimT: 1,
    burst: 0
  };
  let running = true, raf = 0, degraded = false, frames = 0, acc = 0;
  const clock = new THREE.Clock();

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    st.prog += (st.progT - st.prog) * Math.min(1, dt * 3.2);
    st.ox += (st.oxT - st.ox) * Math.min(1, dt * 2.4);
    st.oy += (st.oyT - st.oy) * Math.min(1, dt * 2.4);
    st.sc += (st.scT - st.sc) * Math.min(1, dt * 2.4);
    st.opacity += (st.opacityT - st.opacity) * Math.min(1, dt * 1.8);
    st.dim += (st.dimT - st.dim) * Math.min(1, dt * 1.8);
    st.ptr.x += (st.ptrT.x - st.ptr.x) * Math.min(1, dt * 2.6);
    st.ptr.y += (st.ptrT.y - st.ptr.y) * Math.min(1, dt * 2.6);
    st.accent.lerp(st.accentT, Math.min(1, dt * 1.6));
    st.burst *= Math.max(0, 1 - dt * 1.8);

    const p = st.prog;
    const vis = st.opacity * st.dim;
    const spin = reduced ? 0.6 : p * Math.PI * 4.2 + t * 0.06;
    mark.rotation.set(
      -0.22 + Math.sin(p * Math.PI * 2) * 0.4 + Math.sin(t * 0.35) * 0.05 - st.ptr.y * 0.25,
      spin + st.ptr.x * 0.4,
      Math.sin(p * Math.PI) * 0.22
    );
    const s = st.sc * (1 + st.burst * 0.06);
    mark.scale.setScalar(s);
    mark.position.set(st.ox + st.ptr.x * 0.35, st.oy - st.ptr.y * 0.25, 0);

    halo.position.set(mark.position.x, mark.position.y, -3);
    halo.scale.setScalar(13 * s);
    haloMat.color.copy(st.accent);
    haloMat.opacity = (0.3 + st.burst * 0.2) * vis;

    rim.color.copy(st.accent);
    markMat.sheenColor && markMat.sheenColor.copy(st.accent);
    markMat.envMapIntensity = 1.85 + st.burst * 0.5;
    markMat.color.lerpColors(BASE_TINT, st.accent, 0.18);

    for (let i = 0; i < sats.length; i++) {
      const m = sats[i], u = m.userData;
      const a = u.a + (reduced ? 0 : t * u.sp) + p * 1.5;
      m.position.set(
        Math.cos(a) * u.r + st.ox * 0.6,
        Math.sin(a * 0.8) * 1.6 + u.y + st.oy * 0.6,
        Math.sin(a) * 2.4 - 1
      );
      m.rotation.x = t * u.spin;
      m.rotation.y = t * u.spin * 0.7 + i;
      m.material.opacity = vis * 0.75;
      m.scale.setScalar(0.62 + Math.sin(t * 0.6 + i) * 0.06);
    }

    camera.position.x += (st.ptr.x * 0.9 - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += (-st.ptr.y * 0.7 - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0, 0);

    renderer.toneMappingExposure = 0.4 + vis * 0.7;
    renderer.render(scene, camera);

    if (!degraded) {
      acc += dt; frames++;
      if (frames > 90) {
        if (acc / frames > 0.028) {
          degraded = true;
          dpr = Math.max(1, dpr * 0.72);
          renderer.setPixelRatio(dpr);
          if (markMat.transmission) { markMat.transmission = 0; markMat.metalness = 0.9; markMat.needsUpdate = true; }
        }
        acc = 0; frames = 0;
      }
    }
  }

  const api = {
    start() { if (!raf) { clock.start(); raf = requestAnimationFrame(frame); } st.opacityT = 1; },
    setProgress(v) { st.progT = clamp(v, 0, 1); },
    setAccent(hex) { st.accentT.set(hex); },
    setDim(v) { st.dimT = clamp(v, 0.15, 1) * (tier === 0 ? 0.6 : 1); },
    setPlacement(x, y, scale) {
      // en móvil el isotipo pasa a ser fondo: centrado, más chico y más abajo
      if (tier === 0) {
        st.oxT = x * 0.16; st.oyT = y - 1.45; st.scT = scale * 0.55;
      } else {
        st.oxT = x * (tier === 1 ? 0.82 : 1); st.oyT = y; st.scT = scale * (tier === 1 ? 0.88 : 1);
      }
    },
    setPointer(x, y) { st.ptrT.x = clamp(x, -1, 1); st.ptrT.y = clamp(y, -1, 1); },
    burst(v = 1) { st.burst = Math.min(1.5, st.burst + v); },
    pause() { running = false; },
    resume() { running = true; clock.getDelta(); },
    resize() {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    },
    dispose() {
      cancelAnimationFrame(raf); raf = 0;
      geo.dispose(); markMat.dispose(); haloMat.dispose();
      satGeos.forEach((g) => g.dispose());
      sats.forEach((m) => m.material.dispose());
      env.dispose(); renderer.dispose();
    },
    tier
  };
  return api;
}
