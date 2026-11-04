import gsap from 'gsap';
import { el } from '../../utils/dom.js';
import './companion.css';

const base = import.meta.env.BASE_URL;

/**
 * Shaked's Procreate layers, already positioned per mood (scripts: see README).
 * Each mood = glow (body) + face, and optional left/right arms so they can move on their own.
 */
const ART = {
  energized: ['glow', 'face'], // the original drawing, arms included
  happy: ['glow', 'armL', 'armR', 'face'],
  calm: ['glow', 'armL', 'armR', 'face'],
  tired: ['glow', 'face'],
  sad: ['glow', 'face'],
  curious: ['glow', 'face'],
  scholar: ['glow', 'face'],
};
const ALIAS = { breathing: 'calm' };

/**
 * createCompanion({ size, mood, label }) → { node, setMood(mood), destroy() }
 * Moods (matched to the Figma): energized (companion screen, good day), happy (good-day Home, chat),
 * tired (hard day), calm, sad, curious, scholar.
 */
export function createCompanion({ size = 120, mood = 'calm', label = 'Clarity, your companion' } = {}) {
  const node = el('div', { class: 'companion', role: 'img', 'aria-label': label, style: `--size:${size}px` });
  let mm = null;

  function setMood(next) {
    const art = ALIAS[next] ?? next;
    const parts = ART[art] ?? ART.calm;
    const imgs = Object.fromEntries(parts.map((p) => [p,
      el('img', { class: `companion__${p}`, src: `${base}companion/moods/${art}-${p}.webp`, alt: '', decoding: 'async' })]));
    node.replaceChildren(...Object.values(imgs));
    node.dataset.mood = art;
    mm?.revert();
    mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, () => MOODS[art]?.({ node, ...imgs }));
  }

  setMood(mood);
  return { node, setMood, destroy: () => mm?.revert() };
}

/* Each mood is a GSAP timeline. gsap.matchMedia reverts them, and skips them for reduced motion. */
const breathe = (glow, face, scale, y, dur) => gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
  .to(glow, { scale, duration: dur }, 0).to(face, { y, duration: dur }, 0);

const MOODS = {
  energized({ node, glow, face }) {
    const hop = gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
      .to(node, { y: -8, duration: 0.25, ease: 'power2.out' })
      .to(node, { y: 0, duration: 0.5, ease: 'bounce.out' });
    return [breathe(glow, face, 1.06, -3, 1.4), hop];
  },
  happy: ({ glow, face, armL, armR }) => [breathe(glow, face, 1.04, -2, 2),
    gsap.to([armL, armR], { y: -3, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })],
  calm: ({ glow, face }) => breathe(glow, face, 1.05, -2, 3),
  tired: ({ glow, face }) => breathe(glow, face, 1.02, 3, 3.6),
  sad: ({ glow, face }) => breathe(glow, face, 1.02, 3, 3.6),
  curious: ({ glow, face }) => [breathe(glow, face, 1.04, -2, 2.4),
    gsap.to(face, { x: 4, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })],
  scholar: ({ glow, face }) => breathe(glow, face, 1.03, -2, 2.8),
};
