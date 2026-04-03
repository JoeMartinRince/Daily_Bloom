export type HabitCategory = 'fitness' | 'study' | 'health' | 'mindfulness' | 'productivity' | 'social' | 'other';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  createdAt: string;
  completions: string[]; // array of ISO date strings (YYYY-MM-DD)
  reminderTime?: string; // HH:mm format
}

export interface UserStats {
  totalXp: number;
  level: number;
}

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; icon: string; color: string }> = {
  fitness: { label: 'Fitness', icon: '💪', color: 'hsl(var(--primary))' },
  study: { label: 'Study', icon: '📚', color: 'hsl(var(--accent))' },
  health: { label: 'Health', icon: '🍎', color: 'hsl(var(--streak))' },
  mindfulness: { label: 'Mindfulness', icon: '🧘', color: 'hsl(160, 55%, 45%)' },
  productivity: { label: 'Productivity', icon: '⚡', color: 'hsl(var(--xp))' },
  social: { label: 'Social', icon: '👥', color: 'hsl(280, 60%, 55%)' },
  other: { label: 'Other', icon: '✨', color: 'hsl(var(--muted-foreground))' },
};

export const XP_PER_COMPLETION = 10;
export const XP_PER_LEVEL = 100;
export const STREAK_BONUS_XP = 5; // extra XP per streak day

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (habits: Habit[], stats: UserStats) => boolean;
}

export const BADGES: Badge[] = [
  { id: 'first', name: 'First Step', description: 'Complete your first habit', icon: '🌱', requirement: (habits) => habits.some(h => h.completions.length > 0) },
  { id: 'streak7', name: 'Week Warrior', description: '7-day streak on any habit', icon: '🔥', requirement: (habits) => habits.some(h => getStreak(h) >= 7) },
  { id: 'streak30', name: 'Monthly Master', description: '30-day streak on any habit', icon: '👑', requirement: (habits) => habits.some(h => getStreak(h) >= 30) },
  { id: 'five_habits', name: 'Multitasker', description: 'Track 5 habits', icon: '🎯', requirement: (habits) => habits.length >= 5 },
  { id: 'level5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', requirement: (_, stats) => stats.level >= 5 },
  { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all habits in a day', icon: '💯', requirement: (habits) => { const today = getTodayStr(); return habits.length > 0 && habits.every(h => h.completions.includes(today)); } },
];

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStreak(habit: Habit): number {
  const sorted = [...habit.completions].sort().reverse();
  if (sorted.length === 0) return 0;
  const today = getTodayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

export function getLongestStreak(habit: Habit): number {
  const sorted = [...habit.completions].sort();
  if (sorted.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (Math.round(diff) === 1) { current++; longest = Math.max(longest, current); }
    else current = 1;
  }
  return longest;
}
