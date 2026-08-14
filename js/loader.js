// Loader: the count steps while the knot condenses out of the dark,
// then the page assembles around it. Replay with R (kept during the build phase).

const T = {
  stepAt: [200, 900, 1600],   // when each count step fires
  stepDur: 520,               // digit roll duration
  steps: [34, 68, 100],
  congealStart: 150,
  congealDur: 1500,           // fragments drift + fuse
  orbIn: [1250, 1050],        // [start, duration] orb crossfade over fragments
  exitAt: 2350,               // count leaves, site assembles
  riseDur: 1100,
  stagger: 100,
};

const root = document.documentElement;
const css = getComputedStyle(root);
const EASE_MAIN = css.getPropertyValue('--ease-main').trim();
const EASE_INOUT = css.getPropertyValue('--ease-inout').trim();
const EASE_SETTLE = css.getPropertyValue('--ease-settle').trim();

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildCount() {
  const el = document.createElement('div');
  el.className = 'count';
  el.setAttribute('aria-hidden', 'true');
  const cols = [0, 1, 2].map(() => {
    const col = document.createElement('span');
    col.className = 'col';
    const roll = document.createElement('span');
    roll.textContent = '0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
    roll.style.whiteSpace = 'pre-line';
    col.appendChild(roll);
    el.appendChild(col);
    return { col, roll };
  });
  document.body.appendChild(el);

  // digits aren't tabular: each column follows its current glyph's width
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
  el.appendChild(probe);
  const widths = {};
  for (const d of '0123456789') {
    probe.textContent = d;
    widths[d] = probe.getBoundingClientRect().width;
  }
  probe.remove();
  cols.forEach(({ col }) => { col.style.width = `${widths['0']}px`; });

  return { el, cols, widths };
}

function setDigits(cols, widths, n) {
  String(n).padStart(3, '0').split('').forEach((d, i) => {
    const { col, roll } = cols[i];
    roll.style.transition = `transform ${T.stepDur}ms ${EASE_INOUT}`;
    roll.style.transform = `translateY(${-Number(d)}em)`;
    col.style.transition = `width ${T.stepDur}ms ${EASE_INOUT}`;
    col.style.width = `${widths[d]}px`;
  });
}

function assemble() {
  root.classList.remove('js-loading');
  const rise = (el, delay) => {
    if (!el) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(38px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: T.riseDur, delay, easing: EASE_SETTLE, fill: 'backwards' }
    );
  };
  rise(document.querySelector('.wordmark'), 0);
  rise(document.querySelector('.tagline'), 280);
  rise(document.querySelector('.cards-head'), 380);
  document.querySelectorAll('.card').forEach((el, i) => rise(el, 460 + i * T.stagger));
  rise(document.querySelector('.exp'), 700);
  rise(document.querySelector('.archive'), 800);
  const fade = (sel, delay) => {
    const el = document.querySelector(sel);
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay, easing: 'ease-out', fill: 'backwards' });
  };
  fade('.site-head', 150);
  fade('.site-foot', 700);
}

let lastOpts = {};

export function runLoader(opts = lastOpts) {
  lastOpts = opts;
  if (reduced || !document.querySelector('[data-stage]')) {
    root.classList.remove('js-loading');
    return;
  }
  root.classList.add('js-loading');

  const stage = document.querySelector('[data-stage]');
  const visual = opts.visual || stage.querySelector('.mark-fallback');

  const { el: countEl, cols, widths } = buildCount();
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // count steps
  T.stepAt.forEach((at, i) => later(() => setDigits(cols, widths, T.steps[i]), at));

  // the knot condenses out of the dark, sharpening into focus.
  // soft blur only (no brightness: it lights up the canvas bounds), and the
  // keyframes end at the natural state so no filter lingers afterward.
  visual.animate(
    [
      { opacity: 0, transform: 'scale(0.72)', filter: 'blur(12px)' },
      { opacity: 1, filter: 'blur(7px)', offset: 0.55 },
      { opacity: 1, transform: 'scale(1.03)', filter: 'blur(0px)', offset: 0.85 },
      { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
    ],
    { duration: T.congealDur + T.orbIn[1], delay: T.congealStart, easing: EASE_MAIN, fill: 'backwards' }
  );

  // exit: count leaves, the site assembles around the circle
  later(() => {
    countEl.animate(
      [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-0.7em)' }],
      { duration: 460, easing: EASE_MAIN, fill: 'forwards' }
    ).onfinish = () => countEl.remove();
    assemble();
  }, T.exitAt);

  return () => { timers.forEach(clearTimeout); countEl.remove(); };
}

// replay during the build phase
addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) {
    document.querySelectorAll('.count').forEach((n) => n.remove());
    runLoader();
  }
});
