// Page transitions: clicking a work card zooms its media into the case page
// (real URLs, barba lifecycle); the browser back button plays the zoom in
// reverse. Non-card navigations cross-fade.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUR = reduced ? 0 : 0.9;
const FADE = reduced ? 0 : 0.35;
const EASE = 'expo.inOut';

function makeClone(el) {
  const r = el.getBoundingClientRect();
  const clone = el.cloneNode(true);
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: '0',
    zIndex: 90,
    pointerEvents: 'none',
  });
  document.body.appendChild(clone);
  return clone;
}

function flyTo(clone, target) {
  target.style.visibility = 'hidden';
  const r = target.getBoundingClientRect();
  return window.gsap.to(clone, {
    left: r.left, top: r.top, width: r.width, height: r.height,
    duration: DUR, ease: EASE,
  }).then(() => {
    target.style.visibility = '';
    clone.remove();
  });
}

export function initTransitions({ onHomeEnter } = {}) {
  if (!window.barba || !window.gsap) return;
  const gsap = window.gsap;
  let clone = null;

  window.barba.init({
    timeout: 8000,
    transitions: [
      {
        name: 'card-zoom',
        from: { namespace: ['home'] },
        to: { namespace: ['case'] },
        leave(data) {
          const card = data.trigger?.closest?.('.card');
          const media = card?.querySelector('.card-media');
          if (media) clone = makeClone(media);
          return gsap.to(data.current.container, { opacity: 0, duration: FADE });
        },
        enter(data) {
          scrollTo(0, 0);
          gsap.fromTo(data.next.container, { opacity: 0 }, { opacity: 1, duration: FADE + 0.15 });
          const target = data.next.container.querySelector('[data-case-media]');
          if (clone && target) {
            const p = flyTo(clone, target);
            clone = null;
            return p;
          }
        },
      },
      {
        name: 'zoom-back',
        from: { namespace: ['case'] },
        to: { namespace: ['home'] },
        leave(data) {
          const media = data.current.container.querySelector('[data-case-media]');
          if (media) clone = makeClone(media);
          this.caseName = data.current.container.dataset.case;
          return gsap.to(data.current.container, { opacity: 0, duration: FADE });
        },
        enter(data) {
          scrollTo(0, 0);
          onHomeEnter?.(data.next.container);
          gsap.fromTo(data.next.container, { opacity: 0 }, { opacity: 1, duration: FADE + 0.15 });
          const target = data.next.container.querySelector(
            `.card[data-case="${this.caseName}"] .card-media`
          );
          if (clone && target) {
            const p = flyTo(clone, target);
            clone = null;
            return p;
          }
          if (clone) { clone.remove(); clone = null; }
        },
      },
      {
        name: 'fade',
        leave(data) {
          return gsap.to(data.current.container, { opacity: 0, duration: FADE });
        },
        enter(data) {
          scrollTo(0, 0);
          if (data.next.namespace === 'home') onHomeEnter?.(data.next.container);
          return gsap.fromTo(data.next.container, { opacity: 0 }, { opacity: 1, duration: FADE + 0.15 });
        },
      },
    ],
  });
}
