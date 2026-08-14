// Loader: a scramble-count runs bottom-left (cropped by the viewport) while
// the center bar fills; the bar cuts into a corner bracket; the bracket
// zooms through the camera and the page is revealed through it.
// Replay with R during the build phase.

const T = {
  countIn: 470,      // count fades in
  barAt: 500,        // bar pops in (instant)
  fillDur: 1930,     // fill 0 -> 100
  holdFull: 200,
  cutDur: 270,       // halves reform into the bracket
  holdL: 830,
  zoomDur: 270,      // bracket through the camera
  riseDur: 1100,     // content reveals after
  stagger: 100,
};

const GAP = 4; // px, bracket corner gap

const root = document.documentElement;
const css = getComputedStyle(root);
const EASE_MAIN = css.getPropertyValue('--ease-main').trim();
const EASE_SETTLE = css.getPropertyValue('--ease-settle').trim();
const FILL_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeFill = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInCubic = (t) => t * t * t;

const GLYPHS = '0123456789XKZY%';

function assemble(visual) {
  root.classList.remove('js-loading');
  const rise = (el, delay) => {
    if (!el) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(38px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: T.riseDur, delay, easing: EASE_SETTLE, fill: 'backwards' }
    );
  };
  const fade = (el, delay, dur = 600) => {
    if (!el) return;
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, delay, easing: 'ease-out', fill: 'backwards' });
  };
  rise(document.querySelector('.wordmark'), 0);
  fade(visual || document.querySelector('.stage .mark-fallback'), 150, 900);
  rise(document.querySelector('.tagline'), 280);
  document.querySelectorAll('.work-row').forEach((el, i) => rise(el, 380 + i * T.stagger));
  fade(document.querySelector('.site-head'), 150);
  fade(document.querySelector('.site-foot'), 600);
}

let lastOpts = {};

export function runLoader(opts = lastOpts) {
  lastOpts = opts;
  if (reduced) {
    root.classList.remove('js-loading');
    return;
  }
  root.classList.add('js-loading');
  document.querySelectorAll('.load-overlay, .load-count, .load-bar, .load-piece')
    .forEach((n) => n.remove());

  const overlay = document.createElement('canvas');
  overlay.className = 'load-overlay';
  const dpr = Math.min(2, devicePixelRatio || 1);
  overlay.width = innerWidth * dpr;
  overlay.height = innerHeight * dpr;
  const octx = overlay.getContext('2d');
  octx.scale(dpr, dpr);
  octx.fillStyle = '#000';
  octx.fillRect(0, 0, innerWidth, innerHeight);
  const count = document.createElement('div');
  count.className = 'load-count';
  count.textContent = '000';
  const bar = document.createElement('div');
  bar.className = 'load-bar';
  const fillEl = document.createElement('i');
  bar.appendChild(fillEl);
  document.body.append(overlay, count, bar);

  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let scrambleTimer = 0;

  // 1 — count fades in, cropped by the bottom edge
  count.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.countIn, easing: 'ease-out', fill: 'forwards' });

  // 2 — bar pops in, fill runs, count scrambles toward 100
  later(() => {
    bar.style.display = 'block';
    fillEl.style.transition = `transform ${T.fillDur}ms ${FILL_EASE}`;
    requestAnimationFrame(() => { fillEl.style.transform = 'scaleX(1)'; });

    const t0 = performance.now();
    scrambleTimer = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / T.fillDur);
      const value = Math.round(easeFill(p) * 100);
      const digits = String(value).padStart(3, '0');
      let out = '';
      for (let i = 0; i < 3; i++) {
        // digits resolve left to right as the fill completes
        out += p > 0.35 + i * 0.22
          ? digits[i]
          : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      count.textContent = p >= 1 ? '100' : out;
      if (p >= 1) clearInterval(scrambleTimer);
    }, 50);
  }, T.barAt);

  // 3 — the cut: halves reform into a corner bracket, then the zoom
  later(() => {
    const r = bar.getBoundingClientRect();
    bar.remove();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const w2 = r.width / 2;
    const h = r.height;

    // final bracket: vertical limb upper-left of center, horizontal lower-right
    const vFinal = { x: cx - GAP - h, y: cy - GAP - w2, w: h, h: w2 };
    const hFinal = { x: cx + GAP, y: cy + GAP, w: w2, h };

    const mkPiece = (x, y, w, hh) => {
      const el = document.createElement('div');
      el.className = 'load-piece';
      el.style.left = `${x}px`; el.style.top = `${y}px`;
      el.style.width = `${w}px`; el.style.height = `${hh}px`;
      document.body.appendChild(el);
      return el;
    };
    // start as the two halves of the bar
    const left = mkPiece(r.left, r.top, w2, h);
    const right = mkPiece(cx, r.top, w2, h);

    const place = (el, rect) => {
      el.animate(
        [{}, {
          left: `${rect.x}px`, top: `${rect.y}px`,
          width: `${rect.w}px`, height: `${rect.h}px`,
        }],
        { duration: T.cutDur, easing: EASE_MAIN, fill: 'forwards' }
      );
    };
    place(left, vFinal);
    place(right, hFinal);

    // 4 — hold, then zoom: both rects scale around the horizontal piece's
    // center; the page shows through holes punched in the black canvas,
    // with a white frost pane that thins out as it grows
    later(() => {
      count.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
      left.remove();
      right.remove();
      const ox = hFinal.x + hFinal.w / 2;
      const oy = hFinal.y + hFinal.h / 2;
      const vw = innerWidth, vh = innerHeight;
      // scale until the horizontal piece covers the farthest viewport corner
      let need = 1;
      for (const [px, py] of [[0, 0], [vw, 0], [0, vh], [vw, vh]]) {
        need = Math.max(need,
          Math.abs(px - ox) / (hFinal.w / 2),
          Math.abs(py - oy) / (hFinal.h / 2));
      }
      const S = need * 1.06;

      const drawRect = (rect, s, ang, mode, alpha) => {
        octx.save();
        octx.translate(ox, oy);
        octx.rotate(ang);
        octx.scale(s, s);
        octx.translate(-ox, -oy);
        octx.globalCompositeOperation = mode;
        octx.fillStyle = mode === 'destination-out'
          ? '#fff' : `rgba(255,255,255,${alpha})`;
        octx.fillRect(rect.x, rect.y, rect.w, rect.h);
        octx.restore();
      };

      const zt0 = performance.now();
      function zoomFrame(now) {
        const p = Math.min(1, (now - zt0) / T.zoomDur);
        const s = 1 + (S - 1) * easeInCubic(p);
        // diagonal tilt mid-zoom, level again at the end
        const tilt = Math.sin(p * Math.PI) * -0.14;
        const frost = p < 0.4 ? 1 - p * 1.7 : Math.max(0, 0.32 - (p - 0.4) * 0.55);
        octx.globalCompositeOperation = 'source-over';
        octx.clearRect(0, 0, vw, vh);
        octx.fillStyle = '#000';
        octx.fillRect(0, 0, vw, vh);
        for (const rect of [vFinal, hFinal]) {
          drawRect(rect, s, tilt, 'destination-out');
          if (frost > 0.005) drawRect(rect, s, tilt, 'source-over', frost.toFixed(3));
        }
        if (p < 1) {
          requestAnimationFrame(zoomFrame);
        } else {
          overlay.remove(); count.remove();
        }
      }
      // the page is live underneath while the holes open
      root.classList.remove('js-loading');
      requestAnimationFrame(zoomFrame);
      assemble(opts.visual);
    }, T.cutDur + T.holdL);
  }, T.barAt + T.fillDur + T.holdFull);

  return () => { timers.forEach(clearTimeout); clearInterval(scrambleTimer); };
}

// replay during the build phase
addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) runLoader();
});
