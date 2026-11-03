// Material Symbols (Rounded, Apache 2.0). Inlined at build time so they inherit text color.
import home from '@material-symbols/svg-400/rounded/home.svg?raw';
import homeFill from '@material-symbols/svg-400/rounded/home-fill.svg?raw';
import library from '@material-symbols/svg-400/rounded/video_library.svg?raw';
import heart from '@material-symbols/svg-400/rounded/ecg_heart.svg?raw';
import help from '@material-symbols/svg-400/rounded/help-fill.svg?raw';
import lock from '@material-symbols/svg-400/rounded/lock.svg?raw';
import menu from '@material-symbols/svg-400/rounded/menu.svg?raw';
import star from '@material-symbols/svg-400/rounded/star.svg?raw';
import close from '@material-symbols/svg-400/rounded/close.svg?raw';
import wifiOff from '@material-symbols/svg-400/rounded/wifi_off.svg?raw';
import bedtimeOff from '@material-symbols/svg-400/rounded/bedtime_off.svg?raw';
import add from '@material-symbols/svg-400/rounded/add.svg?raw';

const ICONS = { home, homeFill, library, heart, help, lock, menu, star, close, wifiOff, bedtimeOff, add };

/** Returns a decorative icon element. Give the parent button an aria-label. */
export function icon(name, size = 24) {
  const span = document.createElement('span');
  span.className = 'icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = ICONS[name];
  const node = span.firstElementChild;
  node.setAttribute('width', size);
  node.setAttribute('height', size);
  return span;
}
