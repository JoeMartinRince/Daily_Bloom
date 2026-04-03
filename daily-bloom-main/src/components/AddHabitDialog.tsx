import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HabitCategory, CATEGORY_CONFIG } from '@/lib/types';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (habit: { name: string; category: HabitCategory; icon: string; reminderTime?: string }) => void;
  editData?: { name: string; category: HabitCategory; icon: string; reminderTime?: string } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (updates: { name: string; category: HabitCategory; icon: string; reminderTime?: string }) => void;
}

export function AddHabitDialog({ onAdd, editData, open, onOpenChange, onSave }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState(editData?.name || '');
  const [category, setCategory] = useState<HabitCategory>(editData?.category || 'health');
  const [reminderTime, setReminderTime] = useState(editData?.reminderTime || '');

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const icon = CATEGORY_CONFIG[category].icon;
    if (editData && onSave) {
      onSave({ name: name.trim(), category, icon, reminderTime: reminderTime || undefined });
    } else {
      onAdd({ name: name.trim(), category, icon, reminderTime: reminderTime || undefined });
    }
    setName('');
    setCategory('health');
    setReminderTime('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if (v && !editData) { setName(''); setCategory('health'); setReminderTime(''); } if (v && editData) { setName(editData.name); setCategory(editData.category); setReminderTime(editData.reminderTime || ''); } }}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Habit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{editData ? 'Edit Habit' : 'New Habit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input id="habit-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Morning Run" className="mt-1" autoFocus />
          </div>
          <div>
            <Label htmlFor="reminder-time">Daily Reminder Time (optional)</Label>
            <Input id="reminder-time" type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(Object.keys(CATEGORY_CONFIG) as HabitCategory[]).map(key => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                    category === key ? 'bg-primary/10 border-primary border' : 'bg-secondary border border-transparent hover:border-border'
                  }`}
                >
                  <span>{CATEGORY_CONFIG[key].icon}</span>
                  <span>{CATEGORY_CONFIG[key].label}</span>
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">{editData ? 'Save Changes' : 'Create Habit'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
