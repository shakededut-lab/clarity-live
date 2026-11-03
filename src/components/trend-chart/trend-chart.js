import { el, svg } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import { DAY_LABELS } from '../../data/days.js';
import './trend-chart.css';

const W = 300;
const H = 120;
const x = (i) => (i / 6) * W;
const y = (v) => H - (v / 100) * H;

function path(values) {
  const pts = values.map((v, i) => [x(i), y(v)]);
  return pts.reduce((d, [px, py], i) => {
    if (!i) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1];
    const m = (qx + px) / 2;
    return `${d} C${m},${qy} ${m},${py} ${px},${py}`;
  }, '');
}

/**
 * Weekly score line with tappable activity dots ("correlations").
 * Tapping a dot explains how that activity related to the score.
 */
export function createTrendChart({ trend, activities }) {
  const readout = el('p', { class: 'trend__readout', 'aria-live': 'polite' }, 'Tap a dot to see what you did that day.');

  const grid = [0, 20, 40, 60, 80, 100].map((v) => svg('line', { x1: 0, x2: W, y1: y(v), y2: y(v), class: 'trend__grid' }));
  const yLabels = el('div', { class: 'trend__ylabels', 'aria-hidden': 'true' }, [100, 80, 60, 40, 20, 0].map((v) => el('span', {}, v)));

  const dots = activities.map((a) => {
    const btn = el(
      'button',
      {
        class: `trend__dot${a.peak ? ' trend__dot--peak' : ''}`,
        style: `left:${(x(a.day) / W) * 100}%; top:${(y(trend[a.day]) / H) * 100}%`,
        'aria-label': `${DAY_LABELS_FULL[a.day]}: ${a.label}, score ${trend[a.day]}`,
        onclick: () => { readout.textContent = `${DAY_LABELS_FULL[a.day]}: ${a.label} → score ${trend[a.day]}`; },
      },
      a.peak ? icon(a.icon, 18) : null,
    );
    return btn;
  });

  const plot = el('div', { class: 'trend__plot' },
    svg('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', class: 'trend__svg', 'aria-hidden': 'true' },
      grid, svg('path', { d: path(trend), class: 'trend__line', 'vector-effect': 'non-scaling-stroke' })),
    dots);

  return el('section', { class: 'trend', 'aria-labelledby': 'trend-title' },
    el('h2', { class: 'trend__title', id: 'trend-title' }, 'Trends & correlations'),
    el('div', { class: 'trend__body' }, yLabels, plot),
    el('div', { class: 'trend__days', 'aria-hidden': 'true' }, DAY_LABELS.map((d) => el('span', {}, d))),
    readout);
}

const DAY_LABELS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
