// Loader: the count steps while molten fragments fuse into the circle,
// then the page assembles around it. Replay with R (kept during the build phase).

const T = {
  stepAt: [200, 900, 1600],   // when each count step fires
  stepDur: 520,               // digit roll duration
  steps: [34, 68, 100],
  congealStart: 150,
  congealDur: 1500,           // fragments drift + fuse
  orbIn: [1250, 1050],        // [start, duration] orb crossfade over fragments
  exitAt: 2350,               // count leaves, site assembles
  riseDur: 750,
  stagger: 70,
};

const root = document.documentElement;
const css = getComputedStyle(root);
const EASE_MAIN = css.getPropertyValue('--ease-main').trim();
const EASE_INOUT = css.getPropertyValue('--ease-inout').trim();

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
  root.classList.remove('js-loading');
  const rise = (el, delay) => {
    if (!el) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(38px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: T.riseDur, delay, easing: EASE_MAIN, fill: 'backwards' }
    );
  };
  rise(document.querySelector('.wordmark'), 0);
  rise(document.querySelector('.stage-note'), 220);
  rise(document.querySelector('.tagline'), 300);
  document.querySelectorAll('.work-row').forEach((el, i) => rise(el, 380 + i * T.stagger));
  const fade = (sel, delay) => {
    const el = document.querySelector(sel);
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay, easing: 'ease-out', fill: 'backwards' });
  };
  fade('.site-head', 150);
  fade('.site-foot', 600);
}

export function runLoader() {
  if (reduced || !document.querySelector('[data-stage]')) {
    root.classList.remove('js-loading');
    return;
  }
  root.classList.add('js-loading');

  const stage = document.querySelector('[data-stage]');
  const orb = stage.querySelector('.orb');
  const blobs = ['b1', 'b2', 'b3'].map((c) => {
    let b = stage.querySelector('.' + c);
    if (!b) {
      b = document.createElement('i');
      b.className = 'blob ' + c;
      stage.appendChild(b);
    }
    return b;
  });

  const { el: countEl, cols } = buildCount();
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // count steps
  T.stepAt.forEach((at, i) => later(() => setDigits(cols, T.steps[i]), at));

  // fragments drift to center and fuse
  const targets = [
    { x: '46%', y: '38%' }, { x: '-40%', y: '30%' }, { x: '4%', y: '-42%' },
  ];
  blobs.forEach((b, i) => {
    b.animate(
      [
        { opacity: 0, transform: 'translate(0, 0) scale(0.7)', filter: 'blur(52px) saturate(1.2)' },
        { opacity: 0.85, offset: 0.25 },
        { opacity: 0.85, transform: `translate(${targets[i].x}, ${targets[i].y}) scale(0.92)`, filter: 'blur(26px) saturate(1.2)' },
      ],
      { duration: T.congealDur, delay: T.congealStart, easing: EASE_MAIN, fill: 'forwards' }
    );
    b.animate([{ opacity: 0.85 }, { opacity: 0 }], {
      duration: 500, delay: T.orbIn[0] + 350, easing: 'ease-out', fill: 'forwards',
    });
  });

  // the circle arrives out of the fusion
  orb.animate(
    [
      { opacity: 0, transform: 'scale(0.86)', filter: 'blur(18px)' },
      { opacity: 1, transform: 'scale(1.03)', filter: 'blur(0px)', offset: 0.72 },
      { opacity: 1, transform: 'scale(1)' },
    ],
    { duration: T.orbIn[1], delay: T.orbIn[0], easing: EASE_MAIN, fill: 'forwards' }
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
