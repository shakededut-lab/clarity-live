import gsap from 'gsap';
import { el, prefersReducedMotion } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import { WORKOUTS, RECOMMENDED, ALL_IDS, GOALS } from '../../data/library.js';
import { createNavBar } from '../../components/nav-bar/nav-bar.js';
import { createLoadingView, createBottomSheet, createInfoBanner } from '../../components/feedback/feedback.js';
import { mount, openInfoSheet, showOffline } from '../shared.js';
import './library.css';

const base = import.meta.env.BASE_URL;
let goal = 'Mental'; // remembered while the prototype is open

/** Library: today's picks (follow the day) + every workout, filtered by goal. */
export function renderLibrary(screen, { day, state, onRetry, onNavigate }) {
  if (state === 'loading') return mount(screen, createLoadingView());

  const added = new Set();
  const rec = RECOMMENDED[state] ?? RECOMMENDED[day];
  const list = el('ul', { class: 'library__list', role: 'list' });
  const filterBtn = el('button', { class: 'library__filter', 'aria-haspopup': 'dialog', onclick: openFilter });

  function openDetails(id) {
    const w = WORKOUTS[id];
    const done = added.has(id);
    const sheet = createBottomSheet({
      title: w.title,
      body: `${w.minutes} min · ${w.effort}. ${w.text}`,
      iconName: w.icon,
      actionLabel: done ? 'Already in today’s goals' : 'Add to today’s goals',
      onAction: () => {
        sheet.close();
        if (done) return;
        added.add(id);
        drawList();
        screen.querySelectorAll(`[data-id="${id}"] .w-card__added`).forEach((n) => (n.hidden = false));
      },
    });
    screen.append(sheet.node);
    sheet.open();
  }

  /** Goal picker: one tap picks the goal and closes the sheet. No confirm button. */
  function openFilter() {
    const options = el('div', { class: 'goal-options', role: 'radiogroup', 'aria-label': 'Goal' },
      GOALS.map((g) => el('label', { class: 'goal-option' },
        el('input', { type: 'radio', name: 'goal', value: g, checked: g === goal, onclick: () => pick(g) }),
        el('span', {}, g))));
    const sheet = createBottomSheet({ title: 'What’s your goal today?', content: options });
    function pick(g) {
      goal = g;
      drawList();
      setTimeout(sheet.close, 150); // short pause so the tap is seen
    }
    screen.append(sheet.node);
    sheet.open();
  }

  function drawList() {
    filterBtn.replaceChildren(el('span', { class: 'visually-hidden' }, 'Goal: '), goal, icon('chevronDown', 24));
    const ids = goal === 'All' ? ALL_IDS : ALL_IDS.filter((id) => WORKOUTS[id].tags.includes(goal));
    list.replaceChildren(...ids.map((id) => el('li', {}, workoutCard(id, 'row', added.has(id), openDetails))));
    if (!prefersReducedMotion()) gsap.from(list.children, { y: 12, opacity: 0, duration: 0.3, stagger: 0.05 });
  }

  const banner = state === 'noSleep' && createInfoBanner({
    iconName: 'bedtimeOff',
    text: 'No sleep data from last night.',
    actionLabel: 'Add sleep',
    onAction: () => openInfoSheet(screen, { title: 'Add last night’s sleep', body: 'In the full app you can type it in. For this demo, switch the state to Success.' }),
  });

  const page = el('main', { class: 'library', 'data-state': state },
    el('h1', { class: 'library__title' }, state === 'firstDay' ? 'Start here' : 'Today’s recommendation'),
    banner,
    el('p', { class: 'library__why' }, rec.why),
    el('ul', { class: 'library__recs', role: 'list', 'aria-label': 'Recommended for today' },
      rec.ids.map((id) => el('li', {}, workoutCard(id, 'rec', false, openDetails)))),
    el('div', { class: 'library__by' }, el('h2', { class: 'library__subtitle' }, 'Workouts by'), filterBtn),
    list,
    createNavBar({ active: 'library', onNavigate, tone: 'dark' }),
  );

  drawList();
  const view = mount(screen, { node: page });
  if (state === 'offline') showOffline(screen, onRetry);
  return view;
}

/** One workout card. 'rec' = small carousel card, 'row' = full-width list card. */
function workoutCard(id, variant, isAdded, onOpen) {
  const w = WORKOUTS[id];
  const photo = el('img', { class: 'w-card__photo', src: `${base}library/${id}.webp`, alt: '', loading: 'lazy' });
  photo.addEventListener('error', () => photo.remove());
  return el('button', {
    class: `w-card w-card--${variant}${w.tone === 'dark' ? ' w-card--dark' : ''}`,
    style: `--card:${w.color}`,
    'data-id': id,
    onclick: () => onOpen(id),
  },
    el('span', { class: 'w-card__media', 'aria-hidden': 'true' }, icon(w.icon, 56), photo),
    el('span', { class: 'w-card__body' },
      el('span', { class: 'w-card__title' }, w.title),
      el('span', { class: 'w-card__text' }, w.text),
      el('span', { class: 'w-card__tags' },
        w.tags.map((t) => el('span', { class: `w-card__tag${t === goal && variant === 'row' ? ' is-match' : ''}` }, t)),
        el('span', { class: 'w-card__added', hidden: !isAdded }, icon('check', 16), 'Added'))),
  );
}
