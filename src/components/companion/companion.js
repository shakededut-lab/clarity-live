import gsap from 'gsap';
import { el } from '../../utils/dom.js';
import './companion.css';

const base = import.meta.env.BASE_URL;

/**
 * The companion: Shaked's Procreate drawing in layers (glow + face).
 * Moods: 'breathing' (default), 'energized' (good day), 'tired' (hard day).
 * Returns { node, setMood(mood), destroy() }.
 */
export function createCompanion({ size = 120, mood = 'breathing', label = 'Clarity, your companion' } = {}) {
  const glow = el('img', { class: 'companion__glow', src: `${base}companion/glow.webp`, alt: '' });
  const face = el('img', { class: 'companion__face', src: `${base}companion/face-happy.webp`, alt: '' });
  const zzz = el('span', { class: 'companion__zzz', 'aria-hidden': 'true' },
    el('span', {}, 'z'), el('span', {}, 'z'), el('span', {}, 'z'));
  const node = el('div', { class: 'companion', role: 'img', 'aria-label': label, style: `--size:${size}px` }, glow, face, zzz);

  let mm = null;

  function setMood(next) {
    node.dataset.mood = next;
    mm?.revert();
    mm = gsap.matchMedia();
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', still: '(prefers-reduced-motion: reduce)' },
      ({ conditions }) => {
        if (conditions.still) return applyStillPose(next);
        return MOODS[next]?.({ node, glow, face, zzz });
      },
    );
  }

  function applyStillPose(next) {
    gsap.set(face, { y: next === 'tired' ? 4 : 0, rotate: next === 'tired' ? -6 : 0 });
  }

  setMood(mood);
  return { node, setMood, destroy: () => mm?.revert() };
}

/* Each mood is a GSAP timeline. gsap.matchMedia reverts them automatically. */
const MOODS = {
  breathing({ glow, face }) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    tl.to(glow, { scale: 1.05, duration: 2.4 }, 0).to(face, { y: -2, duration: 2.4 }, 0);
    return tl;
  },

  energized({ node, glow, face }) {
    const breathe = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    breathe.to(glow, { scale: 1.08, duration: 1.4 }, 0).to(face, { y: -3, duration: 1.4 }, 0);
    const hop = gsap.timeline({ repeat: -1, repeatDelay: 3.5 });
    hop.to(node, { y: -8, duration: 0.25, ease: 'power2.out' })
      .to(node, { y: 0, duration: 0.5, ease: 'bounce.out' });
    return [breathe, hop];
  },

  tired({ glow, face, zzz }) {
    gsap.set(face, { rotate: -6 });
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    tl.to(glow, { scale: 1.03, opacity: 0.85, duration: 3.6 }, 0).to(face, { y: 4, duration: 3.6 }, 0);
    // Sleepy "z z z" drifting up, one after another
    const z = gsap.fromTo(zzz.children,
      { y: 0, x: 0, opacity: 0 },
      { y: -28, x: 10, opacity: 1, duration: 1.6, ease: 'sine.out', stagger: { each: 0.6, repeat: -1, yoyo: true } });
    return [tl, z];
  },
};
