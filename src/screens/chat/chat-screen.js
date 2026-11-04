import { el } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import { createCompanion } from '../../components/companion/companion.js';
import { createBubble, createTyping, createReplyChips, createComposer } from '../../components/chat/chat.js';
import { createInfoBanner } from '../../components/feedback/feedback.js';
import { OPENERS, NODES, REPLY_LABELS, matchTyped } from '../../data/chat-script.js';
import { mount } from '../shared.js';
import './chat-screen.css';

const TYPING_MS = 700;

/** Scripted chat with Clarity. Works offline because every answer lives in the app. */
export function renderChat(screen, { day, state, onNavigate }) {
  const companion = createCompanion({ size: 72, mood: day === 'hard' ? 'tired' : 'happy' });
  const log = el('ol', { class: 'chat-log', 'aria-live': 'polite', 'aria-label': 'Conversation' });
  const chipsSlot = el('div', { class: 'chat__chips' });
  const composer = createComposer((text) => userSays(text, matchTyped(text)));
  let timer = null;

  const page = el('main', { class: 'chat' },
    el('header', { class: 'chat__header' },
      el('button', { class: 'chat__back', 'aria-label': 'Back to companion', onclick: () => onNavigate('companion') }, icon('back', 24)),
      el('h1', { class: 'visually-hidden' }, 'Chat with Clarity'),
      companion.node),
    state === 'offline' && createInfoBanner({ iconName: 'wifiOff', text: 'You’re offline, but I’m still here. Our chat works without internet.' }),
    el('div', { class: 'chat__scroll' }, log, chipsSlot),
    composer.node,
  );

  /** Clarity "types", then says each line, then offers replies. */
  function claritySays(node) {
    chipsSlot.replaceChildren();
    if (node.mood) companion.setMood(node.mood);
    const lines = [...node.says];
    const next = () => {
      const typing = createTyping();
      log.append(typing);
      scrollDown();
      timer = setTimeout(() => {
        typing.replaceWith(createBubble(lines.shift(), 'clarity'));
        scrollDown();
        if (lines.length) return next();
        if (node.action === 'openBreakdown') timer = setTimeout(() => onNavigate('health'), 900);
        showReplies(node.replies);
      }, TYPING_MS);
    };
    next();
  }

  function showReplies(ids) {
    if (!ids.length) return;
    const replies = ids.map((id) => ({ id, label: REPLY_LABELS[id] }));
    chipsSlot.replaceChildren(createReplyChips(replies, (id, label) => userSays(label, id)));
    scrollDown();
  }

  function userSays(text, nodeId) {
    clearTimeout(timer);
    log.querySelector('.typing')?.remove();
    log.append(createBubble(text, 'me'));
    claritySays(nodeId === 'start' ? opener(day, state) : NODES[nodeId]);
  }

  function scrollDown() {
    screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
  }

  mount(screen, { node: page });
  claritySays(opener(day, state));
  return { node: page, destroy: () => { clearTimeout(timer); companion.destroy(); } };
}

function opener(day, state) {
  return OPENERS[state] || OPENERS[day];
}
