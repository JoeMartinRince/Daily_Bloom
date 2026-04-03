import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { StatsBar } from '@/components/StatsBar';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { WeeklyInsights } from '@/components/WeeklyInsights';
import { HabitCategory } from '@/lib/types';
import { Leaf, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { habits, stats, lastXpGain, loading, addHabit, editHabit, deleteHabit, toggleCompletion } = useHabits();
  const { signOut, user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingHabit = habits.find(h => h.id === editingId);
  const [lastToggledId, setLastToggledId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setLastToggledId(id);
    toggleCompletion(id);
    setTimeout(() => setLastToggledId(null), 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-display">HabitFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            <AddHabitDialog onAdd={addHabit} />
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <StatsBar habits={habits} stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalendarHeatmap habits={habits} />
          <WeeklyInsights habits={habits} />
        </div>

        <div>
          <h2 className="font-display text-lg mb-3">Today's Habits</h2>
          {habits.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-body">No habits yet. Add your first one to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={handleToggle}
                    onEdit={setEditingId}
                    onDelete={deleteHabit}
                    xpGain={lastToggledId === habit.id ? lastXpGain : null}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {editingHabit && (
        <AddHabitDialog
          onAdd={addHabit}
          editData={{ name: editingHabit.name, category: editingHabit.category, icon: editingHabit.icon }}
          open={!!editingId}
          onOpenChange={(open) => { if (!open) setEditingId(null); }}
          onSave={(updates) => {
            editHabit(editingId!, updates);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
