import type { Task } from '@/types/task.types';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { STATUS_COLORS } from '@/utils/constants';

interface TaskPinProps {
  task: Task;
  isSelected: boolean;
}

export function TaskPin({ task, isSelected }: TaskPinProps) {
  const color = STATUS_COLORS[task.status];

  return (
    <div
      className={cn(isSelected && 'scale-110')}
      style={{ color }}
    >
      <MapPin
        className="h-10 w-10"
        style={{ fill: isSelected ? 'white' : color }}
      />
    </div>
  );
}
