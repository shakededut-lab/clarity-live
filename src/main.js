import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/shell.css';

import { el } from './utils/dom.js';
import { createDemoPanel } from './components/demo-panel/demo-panel.js';
import { renderHome } from './screens/home/home.js';
import { renderGoDeeper } from './screens/go-deeper/go-deeper.js';

const SCREENS = { home: renderHome, health: renderGoDeeper };

const DEMO_GROUPS = [
  { key: 'day', legend: 'Day', options: [['good', 'Good day'], ['hard', 'Hard day']] },
  {
    key: 'state',
    legend: 'State',
    options: [
      ['success', 'Normal'],
      ['loading', 'Loading'],
      ['firstDay', 'First day'],
      ['noSleep', 'No sleep data'],
      ['offline', 'Offline'],
    ],
  },
];

const params = new URLSearchParams(location.search);
const ui = {
  screen: params.get('screen') || 'home',
  day: params.get('day') || 'good',
  state: params.get('state') || 'success',
};

const screen = el('div', { class: 'screen', tabindex: '-1', 'aria-live': 'off' });
const phone = el('div', { class: 'phone' }, screen);
let view = null;

function render() {
  view?.destroy?.();
  const renderScreen = SCREENS[ui.screen] || renderHome;
  view = renderScreen(screen, { ...ui, onRetry: retry, onNavigate: navigate });
}

/** Moving between screens: render, then put keyboard focus at the top of the new screen. */
function navigate(id) {
  update({ screen: id });
  screen.focus({ preventScroll: true });
}

function update(patch) {
  Object.assign(ui, patch);
  history.replaceState(null, '', `?screen=${ui.screen}&day=${ui.day}&state=${ui.state}`);
  render();
}

/** Offline "Try again": show loading briefly, then the normal screen. */
function retry() {
  update({ state: 'loading' });
  setTimeout(() => {
    update({ state: 'success' });
    document.querySelector(`input[name=state][value=success]`).checked = true;
  }, 1800);
}

document.querySelector('#app').append(
  el('div', { class: 'shell' }, createDemoPanel({ groups: DEMO_GROUPS, value: ui, onChange: update }), phone),
);
render();
