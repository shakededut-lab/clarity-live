import { el } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './metric-tile.css';

/** Pill-shaped metric. `highlight` = the metric that drove today's score. */
export function createMetricTile({ label, value, icon: iconName, highlight, onOpen }) {
  return el(
    'li',
    {},
    el(
      'button',
      { class: `metric-tile${highlight ? ' metric-tile--highlight' : ''}`, onclick: onOpen, 'aria-label': `${label} ${value}${highlight ? ', main reason for today’s score' : ''}. Learn more` },
      el('span', { class: 'metric-tile__text', 'aria-hidden': 'true' },
        el('span', { class: 'metric-tile__label' }, label),
        el('span', { class: 'metric-tile__value' }, value)),
      icon(iconName, 40),
    ),
  );
}

/** Wide sleep row: the factor users ask about most, so it gets its own line. */
export function createSleepRow({ value, note, missing, highlight, onOpen, onAdd }) {
  if (missing) {
    return el('div', { class: 'sleep-row sleep-row--missing' },
      icon('bedtimeOff', 32),
      el('span', { class: 'metric-tile__text' },
        el('span', { class: 'metric-tile__label' }, 'Sleep'),
        el('span', { class: 'sleep-row__note' }, 'No data from last night')),
      el('button', { class: 'sleep-row__add', onclick: onAdd }, 'Add sleep'));
  }
  return el('button', { class: `sleep-row${highlight ? ' metric-tile--highlight' : ''}`, onclick: onOpen, 'aria-label': `Sleep ${value}. ${note}. Learn more` },
    icon('bedtime', 32),
    el('span', { class: 'metric-tile__text', 'aria-hidden': 'true' },
      el('span', { class: 'metric-tile__label' }, 'Sleep'),
      el('span', { class: 'sleep-row__note' }, note)),
    el('span', { class: 'metric-tile__value', 'aria-hidden': 'true' }, value));
}
