import { useState, useCallback, useEffect } from 'react';
import { Habit, UserStats, HabitCategory, getTodayStr, XP_PER_LEVEL } from '@/lib/types';
import { calcXpGain } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalXp: 0, level: 1 });
  const [lastXpGain, setLastXpGain] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/habits', { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to load habits');
      const data = await res.json();
      setHabits(data.map((h: any) => ({ ...h, id: h._id })));
    } catch (err) {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/stats', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats({ totalXp: data.totalXp, level: data.level });
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchHabits();
      fetchStats();
    } else {
      setHabits([]);
      setStats({ totalXp: 0, level: 1 });
      setLoading(false);
    }
  }, [user, fetchHabits, fetchStats]);

  const addHabit = useCallback(async (habit: { name: string; category: HabitCategory; icon: string; reminderTime?: string }) => {
    if (!user) return;
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(habit)
      });
      if (!res.ok) throw new Error('Failed to add habit');
      const data = await res.json();
      setHabits(prev => [...prev, { ...data, id: data._id }]);
    } catch (err) {
      toast.error('Failed to add habit');
    }
  }, [user]);

  const editHabit = useCallback(async (id: string, updates: Partial<Pick<Habit, 'name' | 'category' | 'icon' | 'reminderTime'>>) => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update habit');
      const data = await res.json();
      setHabits(prev => prev.map(h => h.id === id ? { ...data, id: data._id } : h));
    } catch (err) {
      toast.error('Failed to update habit');
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete habit');
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  }, []);

  const toggleCompletion = useCallback(async (id: string) => {
    if (!user) return;
    const today = getTodayStr();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompleted = habit.completions.includes(today);

    try {
      const res = await fetch(`/api/habits/${id}/toggle`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date: today })
      });
      if (!res.ok) throw new Error('Failed to toggle');
      
      const updatedHabitData = await res.json();
      const updatedHabit = { ...updatedHabitData, id: updatedHabitData._id };

      if (!isCompleted) {
        const xp = calcXpGain(updatedHabit);
        setLastXpGain(xp);
        setTimeout(() => setLastXpGain(null), 800);

        const newTotalXp = stats.totalXp + xp;
        const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
        
        await fetch('/api/stats', {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ totalXp: newTotalXp, level: newLevel })
        });
        
        setStats({ totalXp: newTotalXp, level: newLevel });
      }
      
      setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
    } catch (err) {
      toast.error('Failed to toggle habit');
    }
  }, [user, habits, stats]);

  return { habits, stats, lastXpGain, loading, addHabit, editHabit, deleteHabit, toggleCompletion };
}
