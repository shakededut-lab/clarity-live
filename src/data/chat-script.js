/**
 * Scripted companion chat (Option A: free, works offline, never off-brand).
 * Each node: what Clarity says + tappable replies. `action` triggers app behavior.
 * Voice (from research): friendly, calm, warm, never guilt.
 */
export const OPENERS = {
  good: { says: ['Hi! Your recovery is at 76 today. A great day to move.', 'How can I help?'], replies: ['newSport', 'whyScore', 'tired'] },
  hard: { says: ['Hey you. I saw you slept under 5 hours.', 'How are you feeling?'], replies: ['tired', 'pushAnyway', 'whyScore'] },
  firstDay: { says: ['Hi, I’m Clarity! I’ll know you better after tonight.', 'Want to start with something small?'], replies: ['newSport', 'tired'] },
  noSleep: { says: ['I couldn’t find last night’s sleep.', 'How did you sleep?'], replies: ['sleptWell', 'tired'] },
};

/** Labels for the user's tappable replies (key = node it leads to). */
export const REPLY_LABELS = {
  newSport: 'Should I try a new sport today?',
  whyScore: 'Why is my score like this?',
  tired: 'I feel tired',
  pushAnyway: 'I want to work out anyway',
  sleptWell: 'I slept fine',
  bpm: 'Something for my heart rate',
  gentle: 'Something gentle',
  surprise: 'Surprise me!',
  added: 'Add it to my goals',
  breathe: 'Yes, let’s breathe',
  later: 'Maybe later',
  thanks: 'Thanks!',
  showBreakdown: 'Show me',
  start: 'Start over',
};

export const NODES = {
  newSport: { says: ['Yes! If it feels good to you.', 'What are you in the mood for?'], replies: ['gentle', 'bpm', 'surprise'] },
  bpm: { says: ['Slow running is a lovely start: 20 minutes at a pace where you can still talk.', 'It trains your heart without wearing you out.'], replies: ['added', 'gentle'] },
  gentle: { says: ['How about free dancing? 15 minutes, any song you love.', 'It lifts your mood and counts as cardio.'], replies: ['added', 'start'] },
  surprise: { says: ['Indoor climbing! Great for focus and grip strength, and beginners are welcome.'], replies: ['added', 'later'] },
  added: { says: ['Done, it’s in your goals.', 'I’ll remind you around 4pm, when your energy usually peaks.'], replies: ['thanks'], mood: 'energized' },
  tired: { says: ['Thanks for telling me. Rest is progress too.', 'Want to do 5 minutes of breathing together?'], replies: ['breathe', 'later'], mood: 'tired' },
  breathe: { says: ['Breathe in with me for 4… hold for 4… and out for 6.', 'I’ll glow slowly while you breathe.'], replies: ['thanks'], mood: 'breathing' },
  pushAnyway: { says: ['I get it! Let’s keep it light: a 20-minute walk or easy yoga.', 'Your body will thank you tomorrow, when you’re ready for a real push.'], replies: ['gentle', 'later'] },
  sleptWell: { says: ['Love that. Your watch may have missed it, you can add your sleep from Home.', 'Want an idea for today?'], replies: ['newSport', 'later'] },
  whyScore: { says: ['Your score mixes sleep, HRV, recovery and heart rate.', 'Want to see what moved it today?'], replies: ['showBreakdown', 'later'] },
  showBreakdown: { says: ['Taking you there now.'], replies: [], action: 'openBreakdown' },
  later: { says: ['No pressure. I’m here whenever you need me.'], replies: ['start'] },
  thanks: { says: ['Anytime! You’re doing better than you think. 💛'], replies: ['start'], mood: 'energized' },
  fallback: { says: ['I’m still learning new words.', 'Can I help with one of these?'], replies: ['newSport', 'tired', 'whyScore'] },
};

/** Simple keyword matching for typed messages. First match wins. */
export const KEYWORDS = [
  [/thank/i, 'thanks'],
  [/breath|stress|anxious|calm/i, 'breathe'],
  [/tired|exhaust|sleepy|no energy/i, 'tired'],
  [/score|why/i, 'whyScore'],
  [/bpm|heart/i, 'bpm'],
  [/danc|gentle|easy/i, 'gentle'],
  [/sport|try|workout|exercise|train/i, 'newSport'],
  [/surprise|random/i, 'surprise'],
];

export function matchTyped(text) {
  const hit = KEYWORDS.find(([re]) => re.test(text));
  return hit ? hit[1] : 'fallback';
}
