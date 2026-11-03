import { el } from '../../utils/dom.js';
import { createCompanion } from '../companion/companion.js';
import './score-header.css';

/**
 * Companion + daily score + one-line message.
 * The whole score is a button: it opens "Go deeper" (the why behind the number).
 */
export function createScoreHeader({ score, headline, mood, note, onOpen }) {
  const companion = createCompanion({ size: 136, mood });
  const scoreText = score == null ? '–' : score;

  const button = el(
    'button',
    {
      class: 'score-header__score',
      'aria-label': score == null ? `No score yet. ${headline}` : `Daily score ${score}. ${headline}. See why`,
      onclick: onOpen,
      disabled: score == null,
    },
    el('span', { class: 'score-header__number', 'aria-hidden': 'true' }, scoreText),
    el('span', { class: 'score-header__headline', 'aria-hidden': 'true' }, headline),
  );

  const node = el(
    'section',
    { class: 'score-header', 'aria-label': 'Today' },
    companion.node,
    el('div', { class: 'score-header__text' }, button, note && el('p', { class: 'score-header__note' }, note)),
  );

  return { node, companion };
}
