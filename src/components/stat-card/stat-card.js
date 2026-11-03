import { el, svg } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import { DAY_LABELS } from '../../data/days.js';
import './stat-card.css';

const W = 160;
const H = 64;

const x = (i, n) => (i / (n - 1)) * W;
const y = (v) => H - (v / 100) * H;

/** Smooth line through the week's values (HRV). */
function linePath(values) {
  const pts = values.map((v, i) => [x(i, values.length), y(v)]);
  return pts.reduce((d, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1];
    const mid = (qx + px) / 2;
    return `${d} C${mid},${qy} ${mid},${py} ${px},${py}`;
  }, '');
}

function gridLines() {
  return [0, 25, 50, 75, 100].map((v) => svg('line', { x1: 0, x2: W, y1: y(v), y2: y(v), class: 'stat-card__grid' }));
}

function lineChart(values) {
  return svg(
    'svg',
    { viewBox: `0 -4 ${W} ${H + 8}`, class: 'stat-card__chart', 'aria-hidden': 'true' },
    gridLines(),
    svg('path', { d: linePath(values), class: 'stat-card__line' }),
  );
}

const BAR_COLORS = ['#e6abb1', '#e6abb1', '#e8b8a0', '#e8c68c', '#e8c68c', '#eadc6d', '#eadc6d'];

function barChart(values) {
  const bw = W / values.length - 8;
  return svg(
    'svg',
    { viewBox: `0 -4 ${W} ${H + 8}`, class: 'stat-card__chart', 'aria-hidden': 'true' },
    gridLines(),
    values.map((v, i) =>
      svg('rect', { x: i * (W / values.length) + 4, y: y(v), width: bw, height: H - y(v), rx: 3, fill: BAR_COLORS[i] }),
    ),
  );
}

function dayAxis() {
  return el('div', { class: 'stat-card__days', 'aria-hidden': 'true' }, DAY_LABELS.map((d) => el('span', {}, d)));
}

/**
 * Weekly stat card. type: 'line' | 'bar'.
 * Screen readers get a text summary instead of the chart.
 */
export function createStatCard({ title, values, type, summary, onHelp }) {
  const body = values
    ? [type === 'line' ? lineChart(values) : barChart(values), dayAxis(), el('p', { class: 'visually-hidden' }, summary)]
    : [el('p', { class: 'stat-card__empty' }, 'Collecting your first week. Check back in 2 days.')];

  return el(
    'article',
    { class: 'stat-card' },
    el(
      'header',
      { class: 'stat-card__head' },
      el('h3', { class: 'stat-card__title' }, title),
      el('button', { class: 'stat-card__help', 'aria-label': `What is ${title}?`, onclick: onHelp }, icon('help', 22)),
    ),
    body,
  );
}
