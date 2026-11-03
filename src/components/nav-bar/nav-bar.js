import { el } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './nav-bar.css';

const base = import.meta.env.BASE_URL;

const ITEMS = [
  { id: 'library', label: 'Library', render: (active) => icon('library', 36) },
  { id: 'home', label: 'Home', render: (active) => icon(active ? 'homeFill' : 'home', 38) },
  {
    id: 'companion',
    label: 'Companion',
    render: () => el('img', { class: 'nav-bar__companion', src: `${base}companion/glow.webp`, alt: '' }),
  },
  { id: 'health', label: 'Health', render: (active) => icon(active ? 'heartFill' : 'heart', 36) },
];

/** Floating pill navigation. Screens not built yet are marked "coming soon". */
export function createNavBar({ active = 'home', available = ['home', 'health'], onNavigate, tone = 'light' } = {}) {
  const buttons = ITEMS.map(({ id, label, render }) => {
    const isActive = id === active;
    const isAvailable = available.includes(id);
    return el(
      'li',
      {},
      el(
        'button',
        {
          class: `nav-bar__item${isActive ? ' is-active' : ''}`,
          'aria-label': isAvailable ? label : `${label}, coming soon`,
          'aria-current': isActive ? 'page' : null,
          'aria-disabled': isAvailable ? null : 'true',
          onclick: () => isAvailable && onNavigate?.(id),
        },
        render(isActive),
      ),
    );
  });

  return el('nav', { class: `nav-bar nav-bar--${tone}`, 'aria-label': 'Main' }, el('ul', { role: 'list' }, buttons));
}
