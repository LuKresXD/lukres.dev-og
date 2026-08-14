import { runLoader } from './loader.js';
import { initCircle } from './circle.js';

const stage = document.querySelector('[data-stage]');
const circle = initCircle(stage);
if (circle) {
  const fallback = stage.querySelector('.orb');
  if (fallback) fallback.style.visibility = 'hidden';
}
runLoader({ visual: circle?.el });
