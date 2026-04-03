import { Habit, UserStats, XP_PER_COMPLETION, XP_PER_LEVEL, STREAK_BONUS_XP, getStreak } from './types';

const HABITS_KEY = 'habitflow_habits';
const STATS_KEY = 'habitflow_stats';

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const stats = JSON.parse(raw);
      return { ...stats, level: Math.floor(stats.totalXp / XP_PER_LEVEL) + 1 };
    }
    return { totalXp: 0, level: 1 };
  } catch { return { totalXp: 0, level: 1 }; }
}

export function saveStats(stats: UserStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function calcXpGain(habit: Habit): number {
  const streak = getStreak(habit);
  return XP_PER_COMPLETION + (streak > 1 ? STREAK_BONUS_XP * Math.min(streak, 10) : 0);
}

export function getXpProgress(stats: UserStats): number {
  return (stats.totalXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
}
