import { el } from '../../utils/dom.js';
import { DAYS } from '../../data/days.js';
import { BREAKDOWN, METRIC_INFO } from '../../data/breakdown.js';
import { createScoreRing } from '../../components/score-ring/score-ring.js';
import { createMetricTile, createSleepRow } from '../../components/metric-tile/metric-tile.js';
import { createTrendChart } from '../../components/trend-chart/trend-chart.js';
import { createNavBar } from '../../components/nav-bar/nav-bar.js';
import { createLoadingView } from '../../components/feedback/feedback.js';
import { mount, openInfoSheet, showOffline } from '../shared.js';
import './go-deeper.css';

/**
 * Go deeper: the "why" behind the daily score (Health tab).
 * Same day/state inputs as Home so the demo controls work everywhere.
 */
export function renderGoDeeper(screen, { day, state, onRetry, onNavigate }) {
  if (state === 'loading') return mount(screen, createLoadingView());

  const data = BREAKDOWN[day];
  const score = state === 'firstDay' ? null : DAYS[day].score;
  const open = (id, label, value) => openInfoSheet(screen, { title: value ? `${label}: ${value}` : label, body: METRIC_INFO[id] });

  const page = el(
    'main',
    { class: 'deeper', 'data-state': state },
    header(score, summaryFor(data, state, open)),
    state === 'firstDay' ? firstDayNote() : body(data, state, open),
    createNavBar({ active: 'health', onNavigate, tone: 'dark' }),
  );

  const view = mount(screen, { node: page });
  if (state === 'offline') showOffline(screen, onRetry);
  return view;
}

function header(score, summary) {
  return el('header', { class: 'deeper__header' },
    createScoreRing(score),
    el('div', {}, el('h1', { class: 'deeper__title' }, 'Why this score?'), summary));
}

/** The summary sentence. Bold words are buttons that open the metric they name. */
function summaryFor(data, state, open) {
  if (state === 'firstDay') return el('p', { class: 'deeper__summary' }, 'Your first breakdown arrives after one night with your watch.');
  if (state === 'noSleep') return el('p', { class: 'deeper__summary' }, 'No sleep data from last night, so today’s score uses activity only.');
  const parts = data.summary.map((part) => {
    if (typeof part === 'string') return part;
    const label = part.metric === 'sleep' ? 'Sleep' : data.metrics.find((m) => m.id === part.metric).label;
    return el('button', { class: 'deeper__term', onclick: () => open(part.metric, label) }, part.b);
  });
  return el('p', { class: 'deeper__summary' }, parts);
}

function body(data, state, open) {
  const sleep = createSleepRow({
    ...data.sleep,
    missing: state === 'noSleep',
    highlight: false,
    onOpen: () => open('sleep', 'Sleep', data.sleep.value),
  });
  const tiles = data.metrics.map((m) =>
    createMetricTile({ ...m, highlight: m.id === data.driver, onOpen: () => open(m.id, m.label, m.value) }));

  return el('div', { class: 'deeper__body' },
    el('h2', { class: 'visually-hidden' }, 'Today’s metrics'),
    sleep,
    el('ul', { class: 'metric-grid', role: 'list' }, tiles),
    createTrendChart(data));
}

function firstDayNote() {
  return el('div', { class: 'deeper__body' },
    el('p', { class: 'deeper__empty' }, 'Here you’ll see what moved your score each day: sleep, recovery, heart rate and more. No black box, just the science in plain words.'));
}
