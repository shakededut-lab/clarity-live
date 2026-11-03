import { el } from '../../utils/dom.js';
import { DAYS } from '../../data/days.js';
import { HELP, STATES } from '../../data/copy.js';
import { createTopBar } from '../../components/top-bar/top-bar.js';
import { createScoreHeader } from '../../components/score-header/score-header.js';
import { createGoalList } from '../../components/goal-card/goal-card.js';
import { createStatCard } from '../../components/stat-card/stat-card.js';
import { createRewardStrip } from '../../components/reward-strip/reward-strip.js';
import { createNavBar } from '../../components/nav-bar/nav-bar.js';
import { createBottomSheet, createInfoBanner, createLoadingView } from '../../components/feedback/feedback.js';
import './home.css';

/**
 * Home screen.
 * day:   'good' | 'hard'
 * state: 'success' | 'loading' | 'firstDay' | 'noSleep' | 'offline'
 */
export function renderHome(screen, { day, state, onRetry }) {
  if (state === 'loading') return mount(screen, createLoadingView());

  const data = dataFor(day, state);
  const header = createScoreHeader({ ...data, onOpen: data.score == null ? null : () => {} });

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
    createNavBar({ active: 'home' }),
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
    mood: 'breathing',
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
  const sheet = createBottomSheet({ ...HELP[key], actionLabel: 'Got it', onAction: () => sheet.close() });
  screen.append(sheet.node);
  sheet.open();
}

function showOffline(screen, onRetry) {
  const { title, body, action } = STATES.offline;
  const sheet = createBottomSheet({ title, body, iconName: 'wifiOff', actionLabel: action, onAction: () => { sheet.close(); onRetry?.(); } });
  screen.append(sheet.node);
  sheet.open();
}

function mount(screen, view) {
  screen.replaceChildren(view.node);
  screen.scrollTop = 0;
  return view;
}
