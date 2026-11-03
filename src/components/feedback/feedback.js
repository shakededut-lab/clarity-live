import gsap from 'gsap';
import { el, prefersReducedMotion } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import { createCompanion } from '../companion/companion.js';
import './feedback.css';

/** Inline info banner (e.g. missing sleep data). Never a dead end: always has an action. */
export function createInfoBanner({ iconName, text, actionLabel, onAction }) {
  return el(
    'div',
    { class: 'info-banner', role: 'status' },
    icon(iconName, 24),
    el('p', {}, text),
    actionLabel && el('button', { class: 'info-banner__action', onclick: onAction }, actionLabel),
  );
}

/**
 * Soft bottom sheet for errors (research: keep context, light humor, always offer help).
 * Returns { node, open(), close() }.
 */
export function createBottomSheet({ title, body, actionLabel, onAction, iconName, content }) {
  const titleId = `sheet-${Math.random().toString(36).slice(2, 8)}`;
  const action = actionLabel && el('button', { class: 'btn-primary', onclick: onAction }, actionLabel);
  const panel = el(
    'div',
    { class: 'sheet__panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
    el('span', { class: 'sheet__handle', 'aria-hidden': 'true' }),
    iconName && el('span', { class: 'sheet__icon' }, icon(iconName, 32)),
    el('h2', { class: 'sheet__title', id: titleId }, title),
    body && el('p', { class: 'sheet__body' }, body),
    content,
    action,
  );
  const scrim = el('div', { class: 'sheet__scrim' });
  const node = el('div', { class: 'sheet' }, scrim, panel);

  const duration = () => (prefersReducedMotion() ? 0 : 0.35);
  let returnFocus = null;

  function open() {
    returnFocus = document.activeElement;
    gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: duration() });
    gsap.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: duration(), ease: 'power2.out', onComplete: () => (action || panel.querySelector('input:checked, button, input'))?.focus({ preventScroll: true }) });
  }

  function close() {
    gsap.to(scrim, { opacity: 0, duration: duration() });
    gsap.to(panel, {
      yPercent: 100,
      duration: duration(),
      ease: 'power2.in',
      onComplete: () => { node.remove(); returnFocus?.focus?.(); },
    });
  }

  scrim.addEventListener('click', close);
  node.addEventListener('keydown', (e) => e.key === 'Escape' && close());

  return { node, open, close };
}

const LOADING_LINES = ['I’m working on it…', 'Final touches…', 'Can’t find the key…', 'Where are my glasses??'];

/** Loading: the companion "tidies up" while the bar fills, with playful lines. */
export function createLoadingView() {
  const companion = createCompanion({ size: 160, mood: 'breathing', label: 'Clarity is loading your day' });
  const fill = el('span', { class: 'loading__fill' });
  const line = el('p', { class: 'loading__line', 'aria-live': 'polite' }, LOADING_LINES[0]);
  const node = el(
    'div',
    { class: 'loading', role: 'status' },
    companion.node,
    el('div', { class: 'loading__bar', 'aria-hidden': 'true' }, fill),
    line,
  );

  if (!prefersReducedMotion()) {
    gsap.fromTo(fill, { width: '8%' }, { width: '92%', duration: 6, ease: 'power1.inOut', repeat: -1 });
  } else {
    fill.style.width = '60%';
  }
  let i = 0;
  const timer = setInterval(() => {
    i = (i + 1) % LOADING_LINES.length;
    line.textContent = LOADING_LINES[i];
  }, 1600);

  return { node, destroy: () => { clearInterval(timer); companion.destroy(); } };
}
