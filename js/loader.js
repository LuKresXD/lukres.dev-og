// Loader: the wordmark letters rise out of their masks while the count
// steps; the knot's stage sweeps open from the center as the name halves
// breathe apart; then the site rises in. Replay with R during the build.

const T = {
  letterDur: 1250,
  letterStagger: 25,
  growAt: 1250,               // stage sweep + name halves part
  growDur: 1250,
  stepAt: [300, 1400, 2150],  // count steps
  stepDur: 520,
  steps: [34, 68, 100],
  uiAt: 2450,                 // site rises in
  exitAt: 2650,               // count leaves
  riseDur: 1250,
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
    return roll;
  });
  document.body.appendChild(el);
  return { el, cols };
}

function setDigits(cols, n) {
  String(n).padStart(3, '0').split('').forEach((d, i) => {
    cols[i].style.transitionProperty = 'transform';
    cols[i].style.transitionDuration = `${T.stepDur}ms`;
    cols[i].style.transitionTimingFunction = EASE_INOUT;
    cols[i].style.transform = `translateY(${-Number(d)}em)`;
  });
}

function assemble() {
  const rise = (el, delay) => {
    if (!el) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(38px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: T.riseDur, delay, easing: EASE_SETTLE, fill: 'backwards' }
    );
  };
  rise(document.querySelector('.tagline'), 0);
  document.querySelectorAll('.work-row').forEach((el, i) => rise(el, 100 + i * T.stagger));
  const fade = (sel, delay) => {
    const el = document.querySelector(sel);
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay, easing: 'ease-out', fill: 'backwards' });
  };
  fade('.site-head', 0);
  fade('.site-foot', 400);
}

let lastOpts = {};

export function runLoader(opts = lastOpts) {
  lastOpts = opts;
  const stage = document.querySelector('[data-stage]');
  if (reduced || !stage) {
    root.classList.remove('js-loading');
    return;
  }
  root.classList.add('js-loading');

  const letters = document.querySelectorAll('.wordmark .l > span');
  const wmStart = document.querySelector('.wordmark .wm-start');
  const wmEnd = document.querySelector('.wordmark .wm-end');

  const { el: countEl, cols } = buildCount();
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // 1 — the name rises out of its masks, letter by letter
  letters.forEach((l, i) => {
    l.animate(
      [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
      { duration: T.letterDur, delay: i * T.letterStagger, easing: EASE_INOUT, fill: 'forwards' }
    );
  });

  // count steps
  T.stepAt.forEach((at, i) => later(() => setDigits(cols, T.steps[i]), at));

  // 2 — the stage sweeps open from the center; the halves breathe apart
  later(() => {
    stage.style.opacity = '1';
    stage.animate(
      [
        { clipPath: 'inset(0 50% 0 50%)', opacity: 1 },
        { clipPath: 'inset(0 0 0 0)', opacity: 1 },
      ],
      { duration: T.growDur, easing: EASE_INOUT, fill: 'forwards' }
    );
    if (wmStart) wmStart.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-0.05em)' }],
      { duration: T.growDur, easing: EASE_INOUT, fill: 'forwards' });
    if (wmEnd) wmEnd.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(0.05em)' }],
      { duration: T.growDur, easing: EASE_INOUT, fill: 'forwards' });
  }, T.growAt);

  // 3 — the site rises in
  later(() => {
    root.classList.remove('js-loading');
    assemble();
  }, T.uiAt);

  // 4 — count leaves
  later(() => {
    countEl.animate(
      [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-0.7em)' }],
      { duration: 460, easing: EASE_MAIN, fill: 'forwards' }
    ).onfinish = () => countEl.remove();
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
