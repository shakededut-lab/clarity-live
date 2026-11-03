import gsap from 'gsap';
import { el, svg, prefersReducedMotion } from '../../utils/dom.js';
import './score-ring.css';

const R = 46;
const CIRC = 2 * Math.PI * R;

/** Big daily score ring with the signature gradient. Animates its fill on mount. */
export function createScoreRing(score) {
  const progress = svg('circle', {
    cx: 52, cy: 52, r: R, class: 'score-ring__progress', stroke: 'url(#score-ring-grad)',
    'stroke-dasharray': CIRC, 'stroke-dashoffset': CIRC,
  });

  const ring = svg(
    'svg',
    { viewBox: '0 0 104 104', class: 'score-ring__svg', 'aria-hidden': 'true' },
    svg('defs', {}, svg('linearGradient', { id: 'score-ring-grad', x1: '1', y1: '0', x2: '0', y2: '1' },
      svg('stop', { offset: '0%', 'stop-color': '#eadc6d' }),
      svg('stop', { offset: '100%', 'stop-color': '#e6abb1' }))),
    svg('circle', { cx: 52, cy: 52, r: R, class: 'score-ring__track' }),
    progress,
  );

  const target = CIRC * (1 - (score ?? 0) / 100);
  if (prefersReducedMotion()) progress.setAttribute('stroke-dashoffset', target);
  else gsap.to(progress, { attr: { 'stroke-dashoffset': target }, duration: 1.2, ease: 'power2.out', delay: 0.15 });

  return el('div', { class: 'score-ring', role: 'img', 'aria-label': score == null ? 'No score yet' : `Daily score ${score} out of 100` },
    ring, el('span', { class: 'score-ring__number', 'aria-hidden': 'true' }, score ?? '–'));
}
