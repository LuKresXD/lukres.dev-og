// The circle — a living soft-body. Breathes on its own; the cursor is a force:
// speed dents and ripples the surface, stillness lets it settle.
// All chroma on the site lives inside this material.

import * as THREE from '../vendor/three.module.min.js';

const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uVel;
  varying vec3 vNormalV;
  varying vec3 vNormalO;
  varying vec3 vViewPos;
  ${'' /* noise injected below */}
  __NOISE__

  float surface(vec3 n) {
    float breath = 0.034 * snoise(n * 1.7 + vec3(0.0, 0.0, uTime * 0.22));
    float d = distance(n, uPointer);
    float dent = -0.5 * uVel * exp(-d * d * 9.0);
    float wake = 0.075 * uVel * sin(d * 16.0 - uTime * 5.5) * exp(-d * 2.6);
    return breath + dent + wake;
  }

  void main() {
    vec3 n = normalize(position);
    float h = surface(n);

    // displaced neighbors -> true surface normal
    vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = cross(n, t);
    float e = 0.05;
    vec3 nt = normalize(n + t * e);
    vec3 nb = normalize(n + b * e);
    vec3 p  = n  * (1.0 + h);
    vec3 pt = nt * (1.0 + surface(nt));
    vec3 pb = nb * (1.0 + surface(nb));
    vec3 sn = normalize(cross(pt - p, pb - p));
    if (dot(sn, n) < 0.0) sn = -sn;

    vNormalO = sn;
    vNormalV = normalize(normalMatrix * sn);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vNormalV;
  varying vec3 vNormalO;
  varying vec3 vViewPos;

  const vec3 DEEP   = vec3(0.133, 0.204, 0.302);
  const vec3 TEAL   = vec3(0.247, 0.490, 0.478);
  const vec3 COPPER = vec3(0.722, 0.537, 0.416);
  const vec3 VIOLET = vec3(0.416, 0.290, 0.494);
  const vec3 NAVY   = vec3(0.118, 0.165, 0.267);

  vec3 ramp(float t) {
    t = fract(t) * 5.0;
    vec3 c = mix(DEEP, TEAL, clamp(t, 0.0, 1.0));
    c = mix(c, COPPER, clamp(t - 1.0, 0.0, 1.0));
    c = mix(c, VIOLET, clamp(t - 2.0, 0.0, 1.0));
    c = mix(c, NAVY,   clamp(t - 3.0, 0.0, 1.0));
    c = mix(c, DEEP,   clamp(t - 4.0, 0.0, 1.0));
    return c;
  }

  void main() {
    vec3 N = normalize(vNormalV);
    vec3 V = normalize(-vViewPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.1);

    float angle = atan(vNormalO.y, vNormalO.x) / 6.28318530718;
    vec3 irid = ramp(angle + uTime * 0.008 + fres * 0.22);

    vec3 base = irid * (0.20 + fres * 1.15);

    vec3 L = normalize(vec3(-0.55, 0.65, 0.75));
    float diff = pow(max(dot(N, L), 0.0), 1.6) * 0.30;
    float spec = pow(max(dot(reflect(-L, N), V), 0.0), 42.0) * 0.7;

    vec3 col = base + irid * diff + vec3(spec);

    // weight at the bottom, like it is resting
    float shade = smoothstep(-0.15, -0.95, vNormalO.y) * 0.75;
    col = mix(col, vec3(0.012, 0.012, 0.014), shade);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initCircle(stage) {
  if (!stage) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  const canvas = renderer.domElement;
  canvas.className = 'circle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10);
  camera.position.z = 4.1;

  const coarse = matchMedia('(pointer: coarse)').matches;
  const geo = new THREE.SphereGeometry(1, coarse ? 160 : 256, coarse ? 120 : 192);
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT.replace('__NOISE__', NOISE),
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uVel: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const dpr = Math.min(2, devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);
  function resize() {
    const box = stage.getBoundingClientRect();
    const size = Math.max(2, Math.round(box.width * 1.3));
    renderer.setSize(size, size, false);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // pointer -> point on the front of the sphere, in stage space
  let vel = 0, lastX = 0, lastY = 0, lastT = 0;
  const target = new THREE.Vector3(0, 0, 1);
  function onMove(x, y) {
    const box = stage.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const r = box.width / 2;
    let nx = (x - cx) / r;
    let ny = -(y - cy) / r;
    const r2 = nx * nx + ny * ny;
    let nz;
    if (r2 < 1) { nz = Math.sqrt(1 - r2); }
    else { const m = Math.sqrt(r2); nx /= m; ny /= m; nz = 0.06; }
    target.set(nx, ny, nz).normalize();

    const now = performance.now();
    if (lastT) {
      const dt = Math.max(8, now - lastT);
      const dist = Math.hypot(x - lastX, y - lastY);
      vel = Math.min(1, vel * 0.82 + (dist / dt) * 0.22);
    }
    lastX = x; lastY = y; lastT = now;
  }
  addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) onMove(t.clientX, t.clientY);
  }, { passive: true });

  let raf = 0;
  const t0 = performance.now();
  function frame(now) {
    const t = (now - t0) / 1000;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uPointer.value.lerp(target, 0.14);
    vel *= 0.965;
    mat.uniforms.uVel.value += (vel - mat.uniforms.uVel.value) * 0.1;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    });
  }

  return { el: canvas };
}
