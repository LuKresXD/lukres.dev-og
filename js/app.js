import { runLoader } from './loader.js';
import { initSetPiece } from './setpiece.js';

const stage = document.querySelector('[data-stage]');
const piece = initSetPiece(stage);
if (piece) {
  const fallback = stage.querySelector('.mark-fallback');
  if (fallback) fallback.style.visibility = 'hidden';
}
runLoader({ visual: piece?.el });
