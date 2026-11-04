import { el, svg } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './goal-card.css';

const R = 36;
const CIRC = 2 * Math.PI * R;

/** Progress ring drawn in SVG, with the signature yellow→pink gradient. */
function ring(progress, id) {
  const gradId = `ring-grad-${id}`;
  return svg(
    'svg',
    { class: 'goal-card__ring', viewBox: '0 0 84 84', 'aria-hidden': 'true' },
    svg(
      'defs',
      {},
      svg(
        'linearGradient',
        { id: gradId, x1: '0', y1: '0', x2: '1', y2: '1' },
        svg('stop', { offset: '0%', 'stop-color': '#eadc6d' }),
        svg('stop', { offset: '100%', 'stop-color': '#e6abb1' }),
      ),
    ),
    svg('circle', { cx: 42, cy: 42, r: R, class: 'goal-card__track' }),
    svg('circle', {
      cx: 42,
      cy: 42,
      r: R,
      class: 'goal-card__progress',
      stroke: `url(#${gradId})`,
      'stroke-dasharray': CIRC,
      'stroke-dashoffset': CIRC * (1 - Math.min(progress, 1)),
    }),
  );
}

/** Figma: "2/4" on one line, or "73min" over "100min". */
function valueLabel({ value, target, unit }) {
  if (!unit) {
    return el('span', { class: 'goal-card__inner' },
      el('span', { class: 'goal-card__value' }, el('strong', {}, value), `/${target}`));
  }
  return el('span', { class: 'goal-card__inner' },
    el('span', { class: 'goal-card__value' }, el('strong', {}, value, el('small', {}, unit))),
    el('span', { class: 'goal-card__target' }, target, el('small', {}, unit)));
}

export function createGoalCard(goal) {
  const { id, name, value, target, unit } = goal;
  const label = `${name}: ${value} of ${target}${unit ? ' ' + unit : ''}`;
  return el(
    'li',
    { class: 'goal-card' },
    el(
      'button',
      { class: 'goal-card__btn', 'aria-label': label },
      el('span', { class: 'goal-card__name' }, name),
      el('span', { class: 'goal-card__dial' }, ring(value / target, id), valueLabel(goal)),
    ),
  );
}

/** Empty state: first goal not set yet. */
export function createAddGoalCard() {
  return el(
    'li',
    { class: 'goal-card goal-card--add' },
    el('button', { class: 'goal-card__btn' }, icon('add', 36), el('span', { class: 'goal-card__name' }, 'Set your first goal')),
  );
}

export function createGoalList(goals) {
  const items = goals.length ? goals.map(createGoalCard) : [createAddGoalCard()];
  return el('ul', { class: 'goal-list', role: 'list' }, items);
}
