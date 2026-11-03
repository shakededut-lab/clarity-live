import { createBottomSheet } from '../components/feedback/feedback.js';
import { STATES } from '../data/copy.js';

/** Replace the screen's content with a view ({ node, destroy }). */
export function mount(screen, view) {
  screen.replaceChildren(view.node);
  screen.scrollTop = 0;
  return view;
}

/** Simple explanation sheet with a "Got it" button. */
export function openInfoSheet(screen, { title, body, actionLabel = 'Got it', onAction }) {
  const sheet = createBottomSheet({ title, body, actionLabel, onAction: () => { sheet.close(); onAction?.(); } });
  screen.append(sheet.node);
  sheet.open();
  return sheet;
}

/** Offline: keep the last data on screen and explain in a soft sheet. */
export function showOffline(screen, onRetry) {
  const { title, body, action } = STATES.offline;
  const sheet = createBottomSheet({
    title, body, iconName: 'wifiOff', actionLabel: action,
    onAction: () => { sheet.close(); onRetry?.(); },
  });
  screen.append(sheet.node);
  sheet.open();
}
