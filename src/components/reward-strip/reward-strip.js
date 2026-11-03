import { el } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './reward-strip.css';

const base = import.meta.env.BASE_URL;

function art() {
  return el('img', { class: 'reward__art', src: `${base}companion/glow.webp`, alt: '' });
}

function rewardCard({ title, caption, state }) {
  if (state === 'locked') {
    return el('li', {}, el('div', { class: 'reward reward--locked', 'aria-label': 'Locked reward' }, icon('lock', 18)));
  }
  const label = state === 'new' ? 'New companion skin, now available' : `${title} session`;
  return el(
    'li',
    {},
    el(
      'button',
      { class: `reward reward--${state}`, 'aria-label': label },
      title && el('span', { class: 'reward__title' }, title),
      art(),
      el('span', { class: 'reward__caption' }, caption),
    ),
  );
}

/** Micro-achievements row: open sessions, a new unlock, and a locked teaser. */
export function createRewardStrip(rewards) {
  return el('ul', { class: 'reward-strip', role: 'list', 'aria-label': 'Rewards' }, rewards.map(rewardCard));
}
