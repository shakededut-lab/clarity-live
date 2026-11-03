import { el } from '../../utils/dom.js';
import './demo-panel.css';

/**
 * Controls for recruiters: switch the day's tone and the screen state.
 * Sits outside the phone, so it's clearly "prototype chrome", not app UI.
 */
export function createDemoPanel({ groups, value, onChange }) {
  const fieldsets = groups.map(({ key, legend, options }) =>
    el(
      'fieldset',
      { class: 'demo__group' },
      el('legend', {}, legend),
      el(
        'div',
        { class: 'demo__options' },
        options.map(([optValue, label]) =>
          el(
            'label',
            { class: 'demo__option' },
            el('input', {
              type: 'radio',
              name: key,
              value: optValue,
              checked: value[key] === optValue,
              onchange: () => onChange({ [key]: optValue }),
            }),
            el('span', {}, label),
          ),
        ),
      ),
    ),
  );

  return el(
    'aside',
    { class: 'demo', 'aria-label': 'Prototype controls' },
    el('p', { class: 'demo__eyebrow' }, 'Clarity · live prototype'),
    el('p', { class: 'demo__hint' }, 'Same Home, different day. Try each state.'),
    fieldsets,
  );
}
