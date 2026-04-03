import { Habit } from '@/lib/types';
import { useMemo } from 'react';

interface Props {
  habits: Habit[];
}

export function CalendarHeatmap({ habits }: Props) {
  const weeks = useMemo(() => {
    const today = new Date();
    const cells: { date: string; count: number; day: number }[][] = [];
    
    // 12 weeks
    for (let w = 11; w >= 0; w--) {
      const week: { date: string; count: number; day: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];
        const count = habits.reduce((acc, h) => acc + (h.completions.includes(dateStr) ? 1 : 0), 0);
        week.push({ date: dateStr, count, day: date.getDay() });
      }
      cells.push(week);
    }
    return cells;
  }, [habits]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-heatmap-0';
    if (count === 1) return 'bg-heatmap-1';
    if (count === 2) return 'bg-heatmap-2';
    if (count <= 4) return 'bg-heatmap-3';
    return 'bg-heatmap-4';
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <h3 className="font-display text-sm mb-3">Activity (12 weeks)</h3>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((l, i) => (
            <div key={i} className="h-3 w-3 text-[8px] text-muted-foreground flex items-center justify-center">{i % 2 === 1 ? l : ''}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => (
              <div
                key={di}
                className={`h-3 w-3 rounded-sm ${getColor(cell.count)} transition-colors`}
                title={`${cell.date}: ${cell.count} habit${cell.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[10px] text-muted-foreground mr-1">Less</span>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`h-2.5 w-2.5 rounded-sm ${getColor(i === 4 ? 5 : i)}`} />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
}
