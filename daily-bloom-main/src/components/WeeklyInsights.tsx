import { Habit, getTodayStr } from '@/lib/types';
import { useMemo } from 'react';

interface Props {
  habits: Habit[];
}

export function WeeklyInsights({ habits }: Props) {
  const data = useMemo(() => {
    const today = new Date();
    const days: { label: string; completed: number; total: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dLabel = d.toLocaleDateString('en', { weekday: 'short' });
      const completed = habits.filter(h => h.completions.includes(dateStr)).length;
      days.push({ label: dLabel, completed, total: habits.length });
    }
    return days;
  }, [habits]);

  const max = Math.max(1, ...data.map(d => d.total));

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <h3 className="font-display text-sm mb-3">This Week</h3>
      <div className="flex items-end gap-2 h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full relative" style={{ height: '60px' }}>
              <div className="absolute bottom-0 w-full bg-secondary rounded-t" style={{ height: `${(d.total / max) * 100}%` }} />
              <div className="absolute bottom-0 w-full bg-primary rounded-t transition-all duration-300" style={{ height: `${d.total > 0 ? (d.completed / max) * 100 : 0}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
