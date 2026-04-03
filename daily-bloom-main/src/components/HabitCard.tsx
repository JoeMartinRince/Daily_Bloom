import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
import { Habit, CATEGORY_CONFIG, getTodayStr, getStreak, getLongestStreak } from '@/lib/types';
import { useState } from 'react';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  xpGain: number | null;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete, xpGain }: Props) {
  const today = getTodayStr();
  const completed = habit.completions.includes(today);
  const streak = getStreak(habit);
  const longest = getLongestStreak(habit);
  const cat = CATEGORY_CONFIG[habit.category];
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`relative flex items-center gap-4 rounded-lg p-4 shadow-card transition-all duration-200 ${
        completed ? 'bg-primary/5 border border-primary/20' : 'bg-card border border-border hover:shadow-elevated'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          completed
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <AnimatePresence>
          {completed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <Check className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.icon}</span>
          <span className={`font-body font-medium text-sm truncate ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {habit.name}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-streak font-medium">
              <Flame className="w-3 h-3" /> {streak}d
            </span>
          )}
          <span className="text-xs text-muted-foreground">Best: {longest}d</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{cat.label}</span>
        </div>
      </div>

      <AnimatePresence>
        {xpGain && (
          <motion.span
            className="absolute -top-2 right-4 text-xp font-bold text-sm"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            +{xpGain} XP
          </motion.span>
        )}
      </AnimatePresence>

      <div className={`flex gap-1 transition-opacity duration-150 ${showActions ? 'opacity-100' : 'opacity-0 sm:opacity-0'} max-sm:opacity-100`}>
        <button onClick={() => onEdit(habit.id)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(habit.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
