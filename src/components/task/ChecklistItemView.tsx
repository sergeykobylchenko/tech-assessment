import { Controller, type Control } from 'react-hook-form';
import type { ChecklistItemStatus } from '@/types/task.types';
import type { TaskFormValues } from './taskFormSchema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Circle } from 'lucide-react';
import { STATUS_COLORS, STATUS_ICONS, STATUS_LABELS } from '@/utils/constants';

interface ChecklistItemViewProps {
  index: number;
  control: Control<TaskFormValues>;
  title?: string;
  status?: string;
  comment?: string;
}

export function ChecklistItemView({ index, control, title, status, comment }: ChecklistItemViewProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <Controller
          control={control}
          name={`checklist.${index}.status`}
          render={({ field: statusField }) => {
            const StatusIcon = STATUS_ICONS[statusField.value as ChecklistItemStatus] ?? Circle;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    role="button"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <StatusIcon className="h-4 w-4" style={{ color: STATUS_COLORS[statusField.value] }}/>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {(Object.entries(STATUS_LABELS) as [ChecklistItemStatus, string][]).map(([value, label]) => {
                    const Icon = STATUS_ICONS[value];
                    return (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => statusField.onChange(value)}
                        style={{ '--accent-foreground': STATUS_COLORS[value], color: STATUS_COLORS[value] } as React.CSSProperties}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
        <span className="min-w-0 flex-1 truncate text-xs">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1.5 pl-6">
        <span className="text-[10px] text-muted-foreground">
          {STATUS_LABELS[status as ChecklistItemStatus] ?? ''}
        </span>
        {comment && (
          <span className="text-[10px] text-muted-foreground">
            · {comment}
          </span>
        )}
      </div>
    </div>
  );
}
