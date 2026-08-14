import { runLoader } from './loader.js';
import { initSetPiece } from './setpiece.js';
import { initHScroll } from './hscroll.js';

const stage = document.querySelector('[data-stage]');
const piece = initSetPiece(stage);
if (piece) {
  const fallback = stage.querySelector('.mark-fallback');
  if (fallback) fallback.style.visibility = 'hidden';
}
runLoader({ visual: piece?.el });

// gsap + ScrollTrigger load as classic deferred scripts before this module
initHScroll();
