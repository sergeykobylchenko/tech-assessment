import type { Task } from '@/types/task.types';
import { cn } from '@/lib/utils';

interface TaskPinProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskPin({ task, isSelected, onClick }: TaskPinProps) {
  return (
    <button
      className={cn(
        'flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow-md transition-transform hover:scale-110',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground scale-110'
          : 'border-primary/70 bg-background text-foreground',
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={task.title || 'Empty Task'}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
    </button>
  );
}
