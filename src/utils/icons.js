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
import heartFill from '@material-symbols/svg-400/rounded/ecg_heart-fill.svg?raw';
import battery from '@material-symbols/svg-400/rounded/battery_5_bar-fill.svg?raw';
import dumbbell from '@material-symbols/svg-400/rounded/fitness_center.svg?raw';
import barChart from '@material-symbols/svg-400/rounded/bar_chart.svg?raw';
import bolt from '@material-symbols/svg-400/rounded/bolt-fill.svg?raw';
import footprint from '@material-symbols/svg-400/rounded/footprint-fill.svg?raw';
import cardiology from '@material-symbols/svg-400/rounded/cardiology.svg?raw';
import bedtime from '@material-symbols/svg-400/rounded/bedtime-fill.svg?raw';
import bike from '@material-symbols/svg-400/rounded/directions_bike.svg?raw';
import run from '@material-symbols/svg-400/rounded/directions_run.svg?raw';
import yoga from '@material-symbols/svg-400/rounded/self_improvement.svg?raw';
import send from '@material-symbols/svg-400/rounded/send-fill.svg?raw';
import back from '@material-symbols/svg-400/rounded/arrow_back_ios_new.svg?raw';
import chevronDown from '@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?raw';
import check from '@material-symbols/svg-400/rounded/check.svg?raw';
import tennis from '@material-symbols/svg-400/rounded/sports_tennis.svg?raw';
import music from '@material-symbols/svg-400/rounded/music_note.svg?raw';
import fire from '@material-symbols/svg-400/rounded/local_fire_department.svg?raw';
import libraryFill from '@material-symbols/svg-400/rounded/video_library-fill.svg?raw';

const ICONS = {
  home, homeFill, library, heart, heartFill, help, lock, menu, star, close, wifiOff, bedtimeOff, add,
  battery, dumbbell, barChart, bolt, footprint, cardiology, bedtime, bike, run, yoga, send, back,
  chevronDown, check, tennis, music, fire, libraryFill,
};

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
