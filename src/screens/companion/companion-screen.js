import gsap from 'gsap';
import { el, prefersReducedMotion } from '../../utils/dom.js';
import { createCompanion } from '../../components/companion/companion.js';
import { createNavBar } from '../../components/nav-bar/nav-bar.js';
import { createLoadingView } from '../../components/feedback/feedback.js';
import { mount, showOffline } from '../shared.js';
import './companion-screen.css';

const INSIGHT = {
  good: ['Your recovery is at 76 today. ', { b: 'A great day for deep focus or a strong workout.' }],
  hard: ['You slept 4h 50m. ', { b: 'Today is for gentle movement and rest. Rest counts.' }],
  firstDay: ['Nice to meet you! ', { b: 'Wear your watch tonight and I’ll learn your rhythm.' }],
  noSleep: ['I couldn’t find last night’s sleep. ', { b: 'Tell me how you slept, and I’ll adjust your day.' }],
};

/** Companion tab: one insight, the big companion, and an invitation to talk. */
export function renderCompanionScreen(screen, { day, state, onRetry, onNavigate }) {
  if (state === 'loading') return mount(screen, createLoadingView());

  const key = INSIGHT[state] ? state : day;
  const mood = state === 'firstDay' || state === 'noSleep' ? 'breathing' : day === 'hard' ? 'tired' : 'energized';
  const companion = createCompanion({ size: 300, mood, label: `Clarity, feeling ${mood}` });
  const talk = el('button', { class: 'companion-screen__talk', onclick: () => onNavigate('chat') }, 'Hi! Let’s talk');

  if (!prefersReducedMotion()) {
    gsap.fromTo(talk, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, ease: 'back.out(2)' });
  }

  const page = el('main', { class: 'companion-screen', 'data-state': state, 'data-day': day },
    el('h1', { class: 'visually-hidden' }, 'Your companion'),
    el('p', { class: 'companion-screen__insight' }, INSIGHT[key].map((p) => (typeof p === 'string' ? p : el('strong', {}, p.b)))),
    el('div', { class: 'companion-screen__stage' }, companion.node, talk),
    el('button', { class: 'companion-screen__beams', 'aria-disabled': 'true', title: 'Coming soon' }, 'My beams', el('span', { class: 'visually-hidden' }, ', coming soon')),
    createNavBar({ active: 'companion', onNavigate }),
  );

  const view = mount(screen, { node: page, destroy: companion.destroy });
  if (state === 'offline') showOffline(screen, onRetry);
  return view;
}
