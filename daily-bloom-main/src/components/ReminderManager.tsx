import { useEffect, useRef } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { getTodayStr } from '@/lib/types';
import { toast } from 'sonner';

export function ReminderManager() {
  const { habits } = useHabits();
  const notifiedHabits = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const checkReminders = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const today = getTodayStr();

      habits.forEach(habit => {
        if (!habit.reminderTime) return;
        
        const habitNotifiedKey = `${habit.id}-${today}`;
        
        if (habit.reminderTime === currentTime) {
          if (!habit.completions.includes(today) && !notifiedHabits.current.has(habitNotifiedKey)) {
            notifiedHabits.current.add(habitNotifiedKey);
            
            // In app toast
            toast(`Reminder: ${habit.name}`, {
              description: "It's time to complete your habit! " + habit.icon,
            });

            // Native Browser Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Habit Reminder: ${habit.name}`, {
                body: "It's time to complete your habit!",
                icon: '/favicon.ico' // Assuming standard vite icon path
              });
            }
          }
        }
      });
      
      // Clear out old notified keys (simple cleanup)
      // We could do this on a new day, but keeping it simple.
    };

    const interval = setInterval(checkReminders, 60000);
    // run immediately on mount
    checkReminders();

    return () => clearInterval(interval);
  }, [habits]);

  return null;
}
