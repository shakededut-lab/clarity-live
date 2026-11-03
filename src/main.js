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
import { renderCompanionScreen } from './screens/companion/companion-screen.js';
import { renderChat } from './screens/chat/chat-screen.js';
import { renderLibrary } from './screens/library/library.js';

const SCREENS = { home: renderHome, health: renderGoDeeper, companion: renderCompanionScreen, chat: renderChat, library: renderLibrary };

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
const stage = el('div', { class: 'stage' }, phone);
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

const shell = el('div', { class: 'shell' });
const demoToggle = el('button', {
  class: 'demo-toggle',
  'aria-expanded': 'false',
  onclick: () => {
    const open = shell.classList.toggle('demo-open');
    demoToggle.setAttribute('aria-expanded', open);
    demoToggle.textContent = open ? 'Close demo' : 'Demo';
  },
}, 'Demo');
shell.append(demoToggle, createDemoPanel({ groups: DEMO_GROUPS, value: ui, onChange: update }), stage);
document.querySelector('#app').append(shell);

/** On a computer, show the iPhone at real size, shrinking only if the window is too small. */
const PHONE = { w: 393, h: 852, frame: 20, panel: 240 + 48 };
function fitPhone() {
  const byHeight = (window.innerHeight - 48 - PHONE.frame) / PHONE.h;
  const byWidth = (window.innerWidth - 48 - PHONE.panel - PHONE.frame) / PHONE.w;
  shell.style.setProperty('--scale', Math.min(1, byHeight, Math.max(byWidth, 0.5)).toFixed(3));
}
window.addEventListener('resize', fitPhone);
fitPhone();
render();
