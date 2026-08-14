// The set piece — the knot. An endless loop that tumbles on its own,
// can be grabbed and thrown (real angular momentum, damped back to its
// idle drift), and leans toward the cursor when at rest.
// Material stays a dial while the finish gets decided: ?mat=name, the
// pill button, or ArrowUp/Down.

import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/room-environment.js';

// procedural surface maps — no asset files, baked once at boot
function bakeTexture(draw) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// long directional smears: brushed metal, smeared reflections
const streaks = bakeTexture((ctx) => {
  for (let i = 0; i < 1600; i++) {
    const y = Math.random() * 512;
    const w = 40 + Math.random() * 340;
    const x = Math.random() * 512 - w / 2;
    const v = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${0.09 + Math.random() * 0.14})`;
    ctx.fillRect(x, y, w, 0.6 + Math.random() * 2.2);
  }
});

// blotchy mineral grain: polished stone, hammered highlights
const grain = bakeTexture((ctx) => {
  for (let i = 0; i < 2400; i++) {
    const r = 3 + Math.random() * 30;
    const v = Math.random() > 0.5 ? 255 : 0;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${v},${v},${v},${0.07 + Math.random() * 0.12})`);
    g.addColorStop(1, 'rgba(128,128,128,0)');
    ctx.save();
    ctx.translate(Math.random() * 512, Math.random() * 512);
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
});
streaks.repeat.set(3, 1);
grain.repeat.set(2, 2);

const MATERIALS = [
  { name: 'obsidian', make: () => new THREE.MeshPhysicalMaterial({
      color: 0x0b0b0d, metalness: 0.12, roughness: 0.3, roughnessMap: grain,
      bumpMap: grain, bumpScale: 1.6, clearcoat: 1, clearcoatRoughness: 0.06,
      envMapIntensity: 1.5 }) },
  { name: 'glass', make: () => new THREE.MeshPhysicalMaterial({
      transmission: 1, ior: 1.52, thickness: 0.85, dispersion: 0.45,
      roughness: 0.02, metalness: 0, specularIntensity: 1,
      clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.1 }) },
  { name: 'chrome', make: () => new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1, roughness: 0.38, roughnessMap: streaks,
      bumpMap: streaks, bumpScale: 1.1, envMapIntensity: 1.6 }) },
  { name: 'soapglass', make: () => new THREE.MeshPhysicalMaterial({
      transmission: 1, ior: 1.4, thickness: 0.4, dispersion: 0.18,
      roughness: 0.08, metalness: 0, iridescence: 1, iridescenceIOR: 1.75,
      envMapIntensity: 1.25 }) },
  { name: 'oil', make: () => new THREE.MeshPhysicalMaterial({
      color: 0x101014, metalness: 0.3, roughness: 0.2, roughnessMap: streaks,
      iridescence: 1, iridescenceIOR: 1.8, envMapIntensity: 1.3 }) },
  { name: 'gold', make: () => new THREE.MeshPhysicalMaterial({
      color: 0xd8a04e, metalness: 1, roughness: 0.28, roughnessMap: streaks,
      bumpMap: streaks, bumpScale: 0.25, envMapIntensity: 1.35 }) },
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

  const coarse = matchMedia('(pointer: coarse)').matches;
  const geo = new THREE.TorusKnotGeometry(0.62, 0.24, coarse ? 180 : 280, coarse ? 28 : 44);
  const knot = new THREE.Mesh(geo, null);
  knot.scale.setScalar(0.62);
  scene.add(knot);

  // material dial (temporary, until the finish is locked)
  const ui = document.createElement('div');
  ui.className = 'pick-ui';
  const matBtn = document.createElement('button');
  ui.appendChild(matBtn);
  stage.appendChild(ui);

  let mdx = Math.max(0, MATERIALS.findIndex((m) => m.name === new URLSearchParams(location.search).get('mat')));
  let material = null;
  function setMat(i) {
    mdx = (i + MATERIALS.length) % MATERIALS.length;
    const next = MATERIALS[mdx].make();
    knot.material = next;
    if (material) material.dispose();
    material = next;
    matBtn.textContent = `material · ${MATERIALS[mdx].name}`;
  }
  setMat(mdx);
  matBtn.addEventListener('click', () => setMat(mdx + 1));
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') setMat(mdx + 1);
    if (e.key === 'ArrowDown') setMat(mdx - 1);
  });

  const dpr = Math.min(2, devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);
  function resize() {
    const box = stage.getBoundingClientRect();
    const size = Math.max(2, Math.round(box.width * 1.3));
    renderer.setSize(size, size, false);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // ---- motion state ----
  const IDLE_SPIN = 0.45;     // baseline drift, rad/s
  let boost = 0;              // hover speed feeds the spin
  let avX = 0, avY = 0;       // throw momentum from a grab
  let grabbing = false;
  let leanX = 0, leanY = 0;
  let lastX = 0, lastY = 0, lastT = 0;

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';

  canvas.addEventListener('pointerdown', (e) => {
    grabbing = true;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!grabbing) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastT) / 1000;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    // drag rotates directly; velocity is remembered for the throw
    knot.rotation.y += dx * 0.006;
    knot.rotation.x += dy * 0.006;
    avY = (dx * 0.006) / dt;
    avX = (dy * 0.006) / dt;
    lastX = e.clientX; lastY = e.clientY; lastT = now;
  });
  const release = (e) => {
    if (!grabbing) return;
    grabbing = false;
    canvas.style.cursor = 'grab';
    if (e.pointerId !== undefined) {
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    }
    // clamp the throw
    avY = Math.max(-9, Math.min(9, avY));
    avX = Math.max(-9, Math.min(9, avX));
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  // hover: lean toward the cursor, cursor speed pushes the spin
  addEventListener('pointermove', (e) => {
    if (grabbing) return;
    const box = stage.getBoundingClientRect();
    leanX = Math.max(-1, Math.min(1, (e.clientY - box.top - box.height / 2) / (box.height * 0.8))) * 0.30;
    leanY = Math.max(-1, Math.min(1, (e.clientX - box.left - box.width / 2) / (box.width * 0.8))) * 0.35;
    const now = performance.now();
    if (lastT) {
      const dt = Math.max(8, now - lastT);
      boost = Math.min(2.4, boost + (Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt) * 0.5);
    }
    lastX = e.clientX; lastY = e.clientY; lastT = now;
  }, { passive: true });

  let raf = 0, prev = 0, born = 0;
  function frame(now) {
    if (!born) born = now;
    const dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
    prev = now;
    const t = now / 1000;

    if (!grabbing) {
      // throw momentum decays; hover boost decays; idle drift underneath
      const damp = Math.pow(0.4, dt);
      avX *= damp; avY *= damp;
      boost *= Math.pow(0.25, dt);
      knot.rotation.y += (IDLE_SPIN + boost + Math.sin(t * 0.31) * 0.06) * dt + avY * dt;
      knot.rotation.x += avX * dt;

      // once the throw settles, ease back to facing the cursor
      if (Math.abs(avX) + Math.abs(avY) < 0.6) {
        knot.rotation.x = ((knot.rotation.x + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        knot.rotation.x += (leanX - knot.rotation.x) * 0.055;
        knot.rotation.z += ((-leanY * 0.35) - knot.rotation.z) * 0.045;
      }
    }

    // breath + rest bob + arrival settle
    const arrive = Math.min(1, (now - born) / 1400);
    const settle = 1 - Math.pow(1 - arrive, 3);
    const breath = 1 + Math.sin(t * 1.7) * 0.012;
    knot.scale.setScalar(0.62 * breath * (0.9 + 0.1 * settle));
    knot.position.y = Math.sin(t * 0.52) * 0.045;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  if (reduced) {
    knot.rotation.set(0.6, -0.7, 0);
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
