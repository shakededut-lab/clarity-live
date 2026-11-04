import { el } from '../../utils/dom.js';
import { DAYS } from '../../data/days.js';
import { HELP, STATES } from '../../data/copy.js';
import { createTopBar } from '../../components/top-bar/top-bar.js';
import { createScoreHeader } from '../../components/score-header/score-header.js';
import { createGoalList } from '../../components/goal-card/goal-card.js';
import { createStatCard } from '../../components/stat-card/stat-card.js';
import { createRewardStrip } from '../../components/reward-strip/reward-strip.js';
import { createNavBar } from '../../components/nav-bar/nav-bar.js';
import { createInfoBanner, createLoadingView } from '../../components/feedback/feedback.js';
import { mount, openInfoSheet, showOffline } from '../shared.js';
import './home.css';

/**
 * Home screen.
 * day:   'good' | 'hard'
 * state: 'success' | 'loading' | 'firstDay' | 'noSleep' | 'offline'
 */
export function renderHome(screen, { day, state, onRetry, onNavigate }) {
  if (state === 'loading') return mount(screen, createLoadingView());

  let data = dataFor(day, state);
  if (state === 'offline') data = { ...data, mood: 'sad' }; // lost signal: the companion looks a little sad
  const header = createScoreHeader({ ...data, onOpen: data.score == null ? null : () => onNavigate('health') });

  const page = el(
    'main',
    { class: 'home', 'data-day': day, 'data-state': state },
    el('h1', { class: 'visually-hidden' }, 'Home'),
    createTopBar(data),
    header.node,
    state === 'noSleep' && createInfoBanner({ iconName: 'bedtimeOff', text: STATES.noSleep.banner, actionLabel: STATES.noSleep.action }),
    section('Your goals', createGoalList(data.goals)),
    section('Weekly stats', el('div', { class: 'stat-row' }, statCards(screen, data))),
    createRewardStrip(data.rewards),
    createNavBar({ active: 'home', onNavigate }),
  );

  const view = mount(screen, { node: page, destroy: header.companion.destroy });
  if (state === 'offline') showOffline(screen, onRetry);
  return view;
}

function dataFor(day, state) {
  const base = DAYS[day];
  if (state !== 'firstDay') return base;
  return {
    ...base,
    score: null,
    mood: 'happy',
    headline: STATES.firstDay.headline,
    note: STATES.firstDay.note,
    goals: [],
    hrv: null,
    bpm: null,
    rewards: base.rewards.map((r, i) => (i === 0 ? { ...r, title: 'Say hi' } : { ...r, state: 'locked' })),
  };
}

function section(title, content) {
  return el('section', { class: 'home__section' }, el('h2', { class: 'home__title' }, title), content);
}

function statCards(screen, data) {
  const help = (key) => () => openHelp(screen, key);
  return [
    createStatCard({ title: 'HRV', type: 'line', values: data.hrv, summary: summary('HRV', data.hrv), onHelp: help('HRV') }),
    createStatCard({ title: 'Bpm', type: 'bar', values: data.bpm, summary: summary('Bpm', data.bpm), onHelp: help('Bpm') }),
  ];
}

function summary(name, values) {
  if (!values) return '';
  const trend = values.at(-1) > values[0] ? 'rising' : 'falling';
  return `${name} this week: ${values.join(', ')}. Trend ${trend}.`;
}

function openHelp(screen, key) {
  openInfoSheet(screen, HELP[key]);
}
