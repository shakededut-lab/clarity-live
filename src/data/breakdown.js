/**
 * "Go deeper" data: what made today's score. Solves the black box problem
 * from the research ("See the science" next to every score).
 * `driver` = the metric the summary sentence talks about; it gets the highlight.
 */
export const BREAKDOWN = {
  good: {
    summary: [
      'Your ', { b: 'sleep', metric: 'sleep' }, ' was a bit short, but your ',
      { b: 'HRV', metric: 'hrv' }, ' is holding strong. You’re ready for a real workout.',
    ],
    sleep: { value: '6h 40m', note: 'A bit short, still fine' },
    driver: 'hrv',
    metrics: [
      { id: 'recovery', label: 'Recovery', value: 76, icon: 'battery' },
      { id: 'discipline', label: 'Discipline', value: 90, icon: 'dumbbell' },
      { id: 'hrv', label: 'HRV', value: 78, icon: 'barChart' },
      { id: 'endurance', label: 'Endurance', value: 87, icon: 'bolt' },
      { id: 'steps', label: 'Steps', value: '8,067', icon: 'footprint' },
      { id: 'bpm', label: 'Bpm', value: 64, icon: 'cardiology' },
    ],
    trend: [28, 46, 92, 52, 40, 72, 82],
    activities: [
      { day: 0, icon: 'yoga', label: 'Yoga, 20 min' },
      { day: 2, icon: 'bike', label: 'Cycling, 45 min', peak: true },
      { day: 3, icon: 'run', label: 'Running, 5 km' },
      { day: 5, icon: 'run', label: 'Running, 3 km' },
    ],
  },
  hard: {
    summary: [
      'Only ', { b: '4h 50m of sleep', metric: 'sleep' }, ' and a dip in ',
      { b: 'recovery', metric: 'recovery' }, '. Your body is asking for rest, and rest counts.',
    ],
    sleep: { value: '4h 50m', note: 'The main reason for today’s score' },
    driver: 'recovery',
    metrics: [
      { id: 'recovery', label: 'Recovery', value: 31, icon: 'battery' },
      { id: 'discipline', label: 'Discipline', value: 88, icon: 'dumbbell' },
      { id: 'hrv', label: 'HRV', value: 41, icon: 'barChart' },
      { id: 'endurance', label: 'Endurance', value: 70, icon: 'bolt' },
      { id: 'steps', label: 'Steps', value: '2,140', icon: 'footprint' },
      { id: 'bpm', label: 'Bpm', value: 78, icon: 'cardiology' },
    ],
    trend: [70, 66, 58, 52, 44, 31, 20],
    activities: [
      { day: 1, icon: 'run', label: 'Running, 10 km' },
      { day: 2, icon: 'bike', label: 'Cycling, 60 min' },
      { day: 4, icon: 'run', label: 'Running, 8 km', peak: true },
    ],
  },
};

/** One-paragraph "science" for each metric, shown in its bottom sheet. */
export const METRIC_INFO = {
  sleep: 'Sleep is when your body repairs muscles and resets stress hormones. 7 to 9 hours is the range most adults recover best in.',
  recovery: 'Recovery shows how ready your body is to take on effort today. It combines sleep, HRV and resting heart rate.',
  discipline: 'Discipline counts how often you showed up for your goals this week, not how hard you pushed.',
  hrv: 'Heart rate variability is the tiny change in time between heartbeats. Higher usually means your nervous system is calm and ready.',
  endurance: 'Endurance tracks how long you can keep a steady effort, based on your last 4 weeks of workouts.',
  steps: 'All your steps today, from walks to the way to the fridge. Every one counts.',
  bpm: 'Your resting heart rate. Lower and steady usually means good fitness and recovery.',
};
