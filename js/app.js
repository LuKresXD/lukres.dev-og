import { runLoader } from './loader.js';
import { initSetPiece } from './setpiece.js';
import { initTransitions } from './transitions.js';

// the knot survives page transitions: built once, re-attached to each
// home container barba injects
let knotCanvas = null;

function mountKnot(scope) {
  const stage = scope.querySelector('[data-stage]');
  if (!stage) return null;
  if (knotCanvas) {
    stage.appendChild(knotCanvas);
  } else {
    const piece = initSetPiece(stage);
    knotCanvas = piece?.el ?? null;
  }
  if (knotCanvas) {
    const fallback = stage.querySelector('.mark-fallback');
    if (fallback) fallback.style.visibility = 'hidden';
  }
  return knotCanvas;
}

const visual = mountKnot(document);
runLoader({ visual });

// barba+gsap load as classic deferred scripts before this module runs
initTransitions({ onHomeEnter: (container) => mountKnot(container) });
