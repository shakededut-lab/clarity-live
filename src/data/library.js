/**
 * Library content. `photo` files go in public/library/ (exported from the Figma).
 * Until a photo exists, the card shows the workout's icon instead.
 * `tone: 'dark'` cards use cream text so contrast stays AA.
 */
export const WORKOUTS = {
  yoga: { title: 'Ashtanga yoga', text: 'Ease your body and your mind.', tags: ['HRV', 'Mental', 'Discipline'], color: '#fbf4cf', icon: 'yoga', minutes: 40, effort: 'Gentle' },
  run: { title: 'Morning run', text: 'Fresh air and a steady pace to wake up.', tags: ['HRV', 'Bpm', 'Discipline'], color: '#e3d6d5', icon: 'run', minutes: 30, effort: 'Medium' },
  walk: { title: 'Easy walk', text: 'Twenty slow minutes outside. Still counts.', tags: ['Mental', 'Bpm'], color: '#d6e6d2', icon: 'footprint', minutes: 20, effort: 'Gentle' },
  meditation: { title: 'Guided meditation', text: 'Take a moment for yourself and feel calmer.', tags: ['Mental', 'Discipline'], color: '#e6abb1', icon: 'yoga', minutes: 10, effort: 'Gentle' },
  spinning: { title: 'Spinning class', text: 'Let it all out on a high-rhythm ride.', tags: ['Bpm', 'Mental', 'HRV'], color: '#e8c68c', icon: 'bike', minutes: 45, effort: 'Hard' },
  tennis: { title: 'Tennis match', text: 'A friend or a wall, both make a great workout.', tags: ['Coordination', 'Social', 'Mental'], color: '#c39363', icon: 'tennis', minutes: 60, effort: 'Medium' },
  heat: { title: 'Heat workout', text: 'Sweat it out for the sweet adrenaline rush.', tags: ['Bpm', 'Discipline', 'HRV'], color: '#bc9bbe', icon: 'fire', minutes: 30, effort: 'Hard' },
  zumba: { title: 'Zumba', text: 'Dance away without a care in the world.', tags: ['Bpm', 'Social', 'Discipline'], color: '#7b5258', icon: 'music', minutes: 45, effort: 'Medium', tone: 'dark' },
};

/** Today's picks follow the day: strong days push, hard days slow down. */
export const RECOMMENDED = {
  good: { ids: ['run', 'spinning', 'yoga'], why: 'Your recovery is high, so today can be a strong one.' },
  hard: { ids: ['walk', 'meditation', 'yoga'], why: 'Your recovery is low, so today’s picks are gentle.' },
  firstDay: { ids: ['walk', 'yoga', 'meditation'], why: 'Easy starters. After your first night I’ll match these to your body.' },
  noSleep: { ids: ['walk', 'meditation', 'yoga'], why: 'No sleep data yet, so I picked gentle ones to be safe.' },
};

export const ALL_IDS = ['meditation', 'spinning', 'tennis', 'heat', 'zumba', 'run', 'walk', 'yoga'];

export const GOALS = ['All', 'Mental', 'Discipline', 'HRV', 'Bpm', 'Coordination', 'Social'];
