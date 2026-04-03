import { motion } from 'framer-motion';
import { Habit, UserStats, BADGES, getTodayStr, getStreak, XP_PER_LEVEL } from '@/lib/types';
import { getXpProgress } from '@/lib/store';
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';

interface Props {
  habits: Habit[];
  stats: UserStats;
}

export function StatsBar({ habits, stats }: Props) {
  const today = getTodayStr();
  const completedToday = habits.filter(h => h.completions.includes(today)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map(h => getStreak(h)));
  const earnedBadges = BADGES.filter(b => b.requirement(habits, stats));
  const xpProgress = getXpProgress(stats);

  return (
    <div className="space-y-4">
      {/* Level & XP bar */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-xp" />
            <span className="font-display text-lg">Level {stats.level}</span>
          </div>
          <span className="text-xs text-muted-foreground">{stats.totalXp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-xp rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 shadow-card text-center">
          <Target className="w-4 h-4 mx-auto text-primary mb-1" />
          <div className="text-xl font-display">{completionRate}%</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 shadow-card text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-streak mb-1" />
          <div className="text-xl font-display">{bestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 shadow-card text-center">
          <Trophy className="w-4 h-4 mx-auto text-xp mb-1" />
          <div className="text-xl font-display">{earnedBadges.length}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </div>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <h3 className="font-display text-sm mb-2">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(b => (
              <div key={b.id} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-xs" title={b.description}>
                <span>{b.icon}</span>
                <span className="font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
