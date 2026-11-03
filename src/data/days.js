/**
 * Mock data for the prototype. Two emotional tones of the same Home screen.
 * Copy follows the "no guilt UX" principle from the research.
 */
const shared = {
  level: 5,
  xp: 280,
  xpGoal: 1200,
  goals: [
    { id: 'running', name: 'Running', value: 2, target: 4, unit: '' },
    { id: 'dancing', name: 'Dancing', value: 73, target: 100, unit: 'min' },
    { id: 'walking', name: 'Walking Rex', value: 23, target: 90, unit: 'km' },
  ],
  rewards: [
    { id: 'meditate', title: 'Meditate', caption: 'Tap here!', state: 'open' },
    { id: 'running', title: 'Running', caption: 'Tap here!', state: 'open' },
    { id: 'new', title: '', caption: 'Now available!', state: 'new' },
    { id: 'locked', title: '', caption: '', state: 'locked' },
  ],
};

export const DAYS = {
  good: {
    ...shared,
    id: 'good',
    score: 82,
    headline: 'Making progress!',
    mood: 'energized',
    hrv: [38, 62, 88, 70, 52, 58, 66],
    bpm: [52, 90, 30, 58, 40, 82, 96],
  },
  hard: {
    ...shared,
    id: 'hard',
    score: 20,
    // Figma said "Bad results today, take some time to recover".
    // Rewritten so rest reads as a win, not a failure (research: "recovery is a win").
    headline: 'Rest is today’s workout',
    mood: 'tired',
    hrv: [62, 55, 48, 40, 34, 28, 22],
    bpm: [70, 76, 82, 88, 92, 96, 98],
  },
};

export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
