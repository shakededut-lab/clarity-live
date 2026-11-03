import gsap from 'gsap';
import { el, prefersReducedMotion } from '../../utils/dom.js';
import { icon } from '../../utils/icons.js';
import './chat.css';

/** One message bubble. from: 'clarity' | 'me'. */
export function createBubble(text, from) {
  const node = el('li', { class: `bubble bubble--${from}` },
    el('span', { class: 'visually-hidden' }, from === 'me' ? 'You said: ' : 'Clarity says: '),
    text);
  if (!prefersReducedMotion()) gsap.from(node, { y: 12, opacity: 0, duration: 0.3, ease: 'power2.out' });
  return node;
}

/** Three breathing dots while Clarity "types". */
export function createTyping() {
  const dots = [0, 1, 2].map(() => el('span', { class: 'typing__dot' }));
  const node = el('li', { class: 'bubble bubble--clarity typing', 'aria-label': 'Clarity is typing' }, dots);
  if (!prefersReducedMotion()) gsap.to(dots, { y: -4, duration: 0.35, repeat: -1, yoyo: true, stagger: 0.12, ease: 'sine.inOut' });
  return node;
}

/** Tappable reply suggestions. */
export function createReplyChips(replies, onPick) {
  return el('div', { class: 'chips', role: 'group', 'aria-label': 'Suggested replies' },
    replies.map(({ id, label }) => el('button', { class: 'chip', onclick: () => onPick(id, label) }, label)));
}

/** Text field + send. Calls onSend(text) with trimmed text. */
export function createComposer(onSend) {
  const input = el('input', { class: 'composer__input', type: 'text', placeholder: 'Write to Clarity…', 'aria-label': 'Message', maxlength: 200, autocomplete: 'off' });
  const form = el('form', { class: 'composer', onsubmit: (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    onSend(text);
  } },
  input,
  el('button', { class: 'composer__send', type: 'submit', 'aria-label': 'Send' }, icon('send', 24)));
  return { node: form, input };
}
