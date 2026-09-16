/* ═══════════════════════════════════════════════════════════════
   Alphamilz · escena 3D
   El isotipo extruido en vidrio, girando con el scroll, más un
   pequeño ecosistema de objetos que acompañan a cada sección.
   ═══════════════════════════════════════════════════════════════ */
import * as THREE from '../vendor/three.module.min.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const BASE_TINT = new THREE.Color('#E8EFF8');
const lerp = (a, b, t) => a + (b - a) * t;

/* Isotipo Alphamilz, trazado del original. Coordenadas del path con la
   y invertida, porque en SVG crece hacia abajo y en three hacia arriba. */
function markShapes() {
  const s = new THREE.Shape();
  s.moveTo(766.9, -0.3);
  s.bezierCurveTo(778.3, 0.3, 788.8, -1, 788.8, -1);
  s.lineTo(643.9, -287.5);
  s.bezierCurveTo(643.9, -287.5, 680.4, -288.8, 695.8, -290.4);
  s.bezierCurveTo(711.2, -291.9, 721.4, -293.6, 736.3, -296.8);
  s.bezierCurveTo(751.2, -300, 769.3, -304.5, 785.3, -309.7);
  s.bezierCurveTo(801.3, -314.9, 817.2, -321, 832.3, -327.8);
  s.bezierCurveTo(847.4, -334.6, 861.8, -342.1, 876, -350.3);
  s.bezierCurveTo(890.2, -358.6, 904.6, -368.1, 917.3, -377.3);
  s.bezierCurveTo(930, -386.5, 940.4, -395.1, 952, -405.7);
  s.bezierCurveTo(963.6, -416.3, 975.5, -427.7, 987.1, -440.8);
  s.bezierCurveTo(998.8, -453.9, 1011.8, -470.3, 1021.9, -484.5);
  s.bezierCurveTo(1032, -498.7, 1003.5, -439.9, 1047.6, -525.8);
  s.bezierCurveTo(1091.7, -611.7, 1286.5, -999.7, 1286.5, -999.7);
  s.bezierCurveTo(1286.5, -999.7, 1242.6, -998.6, 1222.5, -996.1);
  s.bezierCurveTo(1202.4, -993.6, 1186.4, -990.4, 1165.8, -984.5);
  s.bezierCurveTo(1145.2, -978.6, 1118.8, -969.3, 1098.8, -960.7);
  s.bezierCurveTo(1078.8, -952.1, 1063.2, -943.5, 1046, -933);
  s.bezierCurveTo(1028.8, -922.5, 1012, -910.9, 995.8, -897.6);
  s.bezierCurveTo(979.5, -884.4, 963.3, -869.3, 948.5, -853.5);
  s.bezierCurveTo(933.8, -837.7, 919.3, -819.4, 907.3, -802.6);
  s.bezierCurveTo(895.3, -785.8, 876.7, -752.7, 876.7, -752.7);
  s.bezierCurveTo(876.7, -752.7, 865.1, -775.8, 857.1, -788.5);
  s.bezierCurveTo(849.1, -801.2, 838.2, -816.8, 828.7, -829);
  s.bezierCurveTo(819.3, -841.2, 811.5, -850.5, 800.4, -861.9);
  s.bezierCurveTo(789.3, -873.3, 775.1, -886.7, 762.1, -897.6);
  s.bezierCurveTo(749.1, -908.5, 734.4, -918.9, 722.2, -927.2);
  s.bezierCurveTo(710, -935.5, 701.6, -940.4, 688.7, -947.2);
  s.bezierCurveTo(675.8, -954, 660, -961.7, 644.9, -967.8);
  s.bezierCurveTo(629.8, -973.9, 614.6, -979.3, 597.9, -983.9);
  s.bezierCurveTo(581.1, -988.5, 561, -992.8, 544.4, -995.5);
  s.bezierCurveTo(527.8, -998.2, 588.8, -999.3, 498.1, -1000);
  s.bezierCurveTo(407.4, -1000.8, 0.3, -1000, 0.3, -1000);
  s.bezierCurveTo(0.3, -1000, 307.3, -382.8, 376.7, -246.9);
  s.bezierCurveTo(446.1, -111, 404.6, -201.2, 416.6, -184.5);
  s.bezierCurveTo(428.6, -167.8, 437.1, -158.9, 448.8, -146.5);
  s.bezierCurveTo(460.6, -134.1, 474.4, -121, 487.1, -110.1);
  s.bezierCurveTo(499.8, -99.2, 510.9, -90.6, 525.1, -81.1);
  s.bezierCurveTo(539.3, -71.5, 555.7, -61.4, 572.1, -52.8);
  s.bezierCurveTo(588.5, -44.2, 607.7, -35.8, 623.6, -29.6);
  s.bezierCurveTo(639.5, -23.4, 651.3, -19.7, 667.4, -15.5);
  s.bezierCurveTo(683.5, -11.3, 703.6, -7, 720.2, -4.5);
  s.bezierCurveTo(736.8, -2, 755.5, -0.9, 766.9, -0.3);
  s.closePath();

  const hole = new THREE.Path();
  hole.moveTo(643.3, -288.8);
  hole.lineTo(876.4, -751.1);
  hole.lineTo(409.9, -751.4);
  hole.lineTo(643.3, -288.8);
  hole.closePath();
  s.holes.push(hole);

  return [s];
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
  geo.scale(0.0042, 0.0042, 0.0042);
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

  /* ── polvo de marca: campo de puntos con profundidad ───────── */
  const DUST = tier === 0 ? 240 : tier === 1 ? 520 : 900;
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 34;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    dustPos[i * 3 + 2] = -2 - Math.random() * 16;
    dustSeed[i] = Math.random() * Math.PI * 2;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.4, 'rgba(255,255,255,.5)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const dustMat = new THREE.PointsMaterial({
    size: 0.11, map: dotTex, transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ── nudo de luz al fondo ──────────────────────────────────── */
  const knotGeo = new THREE.TorusKnotGeometry(7.4, 0.055, tier === 0 ? 120 : 260, 6, 2, 3);
  const knotMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#A6F700'), transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  knot.position.z = -11;
  scene.add(knot);

  /* ── malla icosaédrica: estructura lejana ──────────────────── */
  const cageGeo = new THREE.IcosahedronGeometry(13, 1);
  const cageMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#5200FF'), wireframe: true, transparent: true,
    opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const cage = new THREE.Mesh(cageGeo, cageMat);
  cage.position.z = -15;
  scene.add(cage);

  /* ── bandada: isotipos planos flotando en profundidad ──────── */
  const FLOCK = tier === 0 ? 4 : tier === 1 ? 7 : 11;
  const flatGeo = new THREE.ShapeGeometry(markShapes(), tier === 0 ? 6 : 12);
  flatGeo.center();
  flatGeo.scale(0.0011, 0.0011, 0.0011);
  const flockMat = new THREE.MeshBasicMaterial({
    transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const flock = new THREE.InstancedMesh(flatGeo, flockMat, FLOCK);
  flock.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const flockData = [];
  const flockColor = new THREE.Color();
  for (let i = 0; i < FLOCK; i++) {
    flockData.push({
      x: (Math.random() - 0.5) * 26,
      y: (Math.random() - 0.5) * 16,
      z: -6 - Math.random() * 12,
      sp: 0.1 + Math.random() * 0.3,
      tilt: Math.random() * Math.PI * 2,
      sc: 0.45 + Math.random() * 0.75
    });
    flockColor.set(i % 3 === 0 ? '#A6F700' : i % 3 === 1 ? '#5200FF' : '#8CA8D8');
    flock.setColorAt(i, flockColor);
  }
  if (flock.instanceColor) flock.instanceColor.needsUpdate = true;
  scene.add(flock);
  const dummy = new THREE.Object3D();

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
    st.ox += (st.oxT - st.ox) * Math.min(1, dt * 3.2);
    st.oy += (st.oyT - st.oy) * Math.min(1, dt * 3.2);
    st.sc += (st.scT - st.sc) * Math.min(1, dt * 3.2);
    st.opacity += (st.opacityT - st.opacity) * Math.min(1, dt * 1.8);
    st.dim += (st.dimT - st.dim) * Math.min(1, dt * 5);
    st.ptr.x += (st.ptrT.x - st.ptr.x) * Math.min(1, dt * 2.6);
    st.ptr.y += (st.ptrT.y - st.ptr.y) * Math.min(1, dt * 2.6);
    st.accent.lerp(st.accentT, Math.min(1, dt * 1.6));
    st.burst *= Math.max(0, 1 - dt * 1.8);

    const p = st.prog;
    const vis = st.opacity * st.dim;
    // el giro depende del scroll, no del reloj: así cada sección
    // siempre encuadra el isotipo en el mismo ángulo
    const spin = reduced ? 0.35 : p * Math.PI * 4 + Math.sin(t * 0.22) * 0.07;
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

    /* capas de fondo: se mueven a distinta velocidad que el isotipo,
       que es lo que da la sensación de profundidad al hacer scroll */
    dust.position.y = p * 9;
    dust.position.x = st.ptr.x * 1.4;
    dust.rotation.z = p * 0.35 + t * 0.008;
    dustMat.opacity = vis * 0.55;
    dustMat.color.copy(st.accent).lerp(BASE_TINT, 0.45);

    knot.rotation.set(t * 0.07 + p * 1.2, t * 0.11 - p * 2.1, p * 0.8);
    knot.position.set(st.ptr.x * -1.8, 2 - p * 14, -11);
    knotMat.color.copy(st.accent);
    knotMat.opacity = vis * (0.11 + st.burst * 0.08);

    cage.rotation.set(-p * 1.6, t * 0.04 + p * 0.9, 0);
    cage.position.set(st.ptr.x * -2.6, -1 + p * 6, -15);
    cageMat.opacity = vis * 0.07;

    for (let i = 0; i < FLOCK; i++) {
      const f = flockData[i];
      const drift = t * f.sp;
      dummy.position.set(
        f.x + Math.sin(drift + f.tilt) * 2.2 + st.ptr.x * 1.1,
        f.y + Math.cos(drift * 0.7) * 1.4 + p * 11 - 5.5,
        f.z
      );
      dummy.rotation.set(Math.sin(drift * 0.5) * 0.5, drift * 0.9 + f.tilt, p * 2.4 + f.tilt);
      dummy.scale.setScalar(f.sc);
      dummy.updateMatrix();
      flock.setMatrixAt(i, dummy.matrix);
    }
    flock.instanceMatrix.needsUpdate = true;
    flockMat.opacity = vis * 0.2;

    key.position.set(4 + st.ptr.x * 7, 6 - st.ptr.y * 5, 8);
    rim.position.set(-6 + st.ptr.x * 5, -2 - st.ptr.y * 3.5, -4);
    fill.position.set(-5 + st.ptr.x * 4, 4 - st.ptr.y * 3, 6);

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
      dustGeo.dispose(); dustMat.dispose(); dotTex.dispose();
      knotGeo.dispose(); knotMat.dispose();
      cageGeo.dispose(); cageMat.dispose();
      flatGeo.dispose(); flockMat.dispose(); flock.dispose();
      sats.forEach((m) => m.material.dispose());
      env.dispose(); renderer.dispose();
    },
    tier
  };
  return api;
}
