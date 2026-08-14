// The set piece — a form cut from real glass. It spins slowly, leans toward
// the cursor, and fast movement gives it a push; light refracts and disperses
// through it. All chroma on the site lives here.
//
// Pick phase: several candidate forms share the one glass system.
// Cycle with ArrowLeft/Right, click/tap the form, or force one via ?form=name.

import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/room-environment.js';

// the mark, same coordinates as assets/mark.svg (0..100, y down)
const F1_OUTER = [[15, 10], [33, 10], [33, 72], [85, 72], [85, 90], [15, 90]];
const F1_HOLE  = [[21, 16], [27, 16], [27, 78], [79, 78], [79, 84], [21, 84]];
const F2_OUTER = [[39, 10], [57, 10], [57, 48], [85, 48], [85, 66], [39, 66]];
const F2_HOLE  = [[45, 16], [51, 16], [51, 54], [79, 54], [79, 60], [45, 60]];

function toShape(outer, hole) {
  const m = ([x, y]) => [(x - 50) / 50, (50 - y) / 50];
  const s = new THREE.Shape();
  outer.forEach((p, i) => { const [x, y] = m(p); i ? s.lineTo(x, y) : s.moveTo(x, y); });
  s.closePath();
  const h = new THREE.Path();
  hole.forEach((p, i) => { const [x, y] = m(p); i ? h.lineTo(x, y) : h.moveTo(x, y); });
  h.closePath();
  s.holes.push(h);
  return s;
}

function facet(geo) {
  const g = geo.toNonIndexed();
  g.computeVertexNormals();
  geo.dispose();
  return g;
}

function twistedBar() {
  const g = new THREE.BoxGeometry(0.62, 2.1, 0.62, 6, 64, 6);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = v.y * 1.15;
    const c = Math.cos(a), s = Math.sin(a);
    pos.setXYZ(i, v.x * c - v.z * s, v.y, v.x * s + v.z * c);
  }
  g.computeVertexNormals();
  return g;
}

function markGroup(material) {
  const opts = {
    depth: 0.3, bevelEnabled: true, bevelThickness: 0.05,
    bevelSize: 0.04, bevelSegments: 3, curveSegments: 2,
  };
  const grp = new THREE.Group();
  for (const [o, h] of [[F1_OUTER, F1_HOLE], [F2_OUTER, F2_HOLE]]) {
    const geo = new THREE.ExtrudeGeometry(toShape(o, h), opts);
    geo.translate(0, 0, -opts.depth / 2);
    grp.add(new THREE.Mesh(geo, material));
  }
  return grp;
}

const FORMS = [
  { name: 'knot',     scale: 0.62, build: (m) => new THREE.Mesh(new THREE.TorusKnotGeometry(0.62, 0.24, 240, 40), m) },
  { name: 'gem',      scale: 0.66, build: (m) => new THREE.Mesh(facet(new THREE.IcosahedronGeometry(0.95, 1)), m) },
  { name: 'monolith', scale: 0.72, build: (m) => new THREE.Mesh(twistedBar(), m) },
  { name: 'ring',     scale: 0.66, build: (m) => new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.29, 48, 120), m) },
  { name: 'coil',     scale: 0.68, build: (m) => new THREE.Mesh(new THREE.TorusKnotGeometry(0.58, 0.17, 280, 28, 1, 3), m) },
  { name: 'mark',     scale: 0.82, build: (m) => markGroup(m) },
];

export function initSetPiece(stage) {
  if (!stage) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  const canvas = renderer.domElement;
  canvas.className = 'stage-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 12);
  camera.position.z = 3.5;

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // dark backdrop so transmission has ground to refract; same color as the page
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ color: 0x060607, toneMapped: false })
  );
  backdrop.position.z = -4;
  scene.add(backdrop);

  const glass = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    ior: 1.48,
    thickness: 0.55,
    dispersion: 0.28,
    roughness: 0.06,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.35,
  });

  // pick phase: cycling label
  const label = document.createElement('span');
  label.className = 'form-label';
  stage.appendChild(label);
  let labelTimer = 0;
  function showLabel(text) {
    label.textContent = text;
    label.classList.add('on');
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => label.classList.remove('on'), 1400);
  }

  let piece = null;
  let idx = Math.max(0, FORMS.findIndex((f) => f.name === new URLSearchParams(location.search).get('form')));
  function setForm(i) {
    idx = (i + FORMS.length) % FORMS.length;
    if (piece) {
      scene.remove(piece);
      piece.traverse((o) => o.geometry && o.geometry.dispose());
    }
    piece = FORMS[idx].build(glass);
    piece.scale.setScalar(FORMS[idx].scale);
    scene.add(piece);
    showLabel(`${idx + 1}/${FORMS.length} · ${FORMS[idx].name}`);
  }
  setForm(idx);

  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setForm(idx + 1);
    if (e.key === 'ArrowLeft') setForm(idx - 1);
  });
  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('click', () => setForm(idx + 1));

  const dpr = Math.min(2, devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);
  function resize() {
    const box = stage.getBoundingClientRect();
    const size = Math.max(2, Math.round(box.width * 1.3));
    renderer.setSize(size, size, false);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // cursor: lean toward it; speed = spin push
  let leanX = 0, leanY = 0, boost = 0, lastX = 0, lastY = 0, lastT = 0;
  function onMove(x, y) {
    const box = stage.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (x - box.left - box.width / 2) / (box.width * 0.8)));
    const ny = Math.max(-1, Math.min(1, (y - box.top - box.height / 2) / (box.height * 0.8)));
    leanX = ny * 0.30;
    leanY = nx * 0.35;
    const now = performance.now();
    if (lastT) {
      const dt = Math.max(8, now - lastT);
      boost = Math.min(2.4, boost + (Math.hypot(x - lastX, y - lastY) / dt) * 0.5);
    }
    lastX = x; lastY = y; lastT = now;
  }
  addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) onMove(t.clientX, t.clientY);
  }, { passive: true });

  let raf = 0, prev = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
    prev = now;
    boost *= 0.96;
    piece.rotation.y += dt * (0.45 + boost);
    piece.rotation.x += (leanX - piece.rotation.x) * 0.055;
    piece.rotation.z += (-leanY * 0.35 - piece.rotation.z) * 0.045;
    piece.position.y = Math.sin(now / 1900) * 0.045;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  if (reduced) {
    piece.rotation.y = -0.5;
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { prev = performance.now(); raf = requestAnimationFrame(frame); }
    });
  }

  return { el: canvas };
}
