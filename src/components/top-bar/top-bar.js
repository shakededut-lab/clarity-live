import { el } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './top-bar.css';

/** Level badge with XP progress + round menu button. */
export function createTopBar({ level, xp, xpGoal }) {
  const pct = Math.round((xp / xpGoal) * 100);

  const badge = el(
    'div',
    { class: 'level-badge' },
    el('span', { class: 'level-badge__level' }, `Level ${level}`),
    el(
      'div',
      {
        class: 'level-badge__bar',
        role: 'progressbar',
        'aria-label': 'Experience points',
        'aria-valuemin': 0,
        'aria-valuemax': xpGoal,
        'aria-valuenow': xp,
        style: `--pct:${Math.max(pct, 45)}%`,
      },
      el('span', { class: 'level-badge__xp' }, `${xp} xp`),
      el('span', { class: 'level-badge__goal' }, xpGoal),
    ),
  );

  const menu = el('button', { class: 'round-btn', 'aria-label': 'Menu' }, icon('menu', 28));
  return el('header', { class: 'top-bar' }, badge, menu);
}
