import { Controller, type Control, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import type { TaskFormValues } from './taskFormSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { STATUS_LABELS } from '@/utils/constants';

interface ChecklistItemEditProps {
  index: number;
  control: Control<TaskFormValues>;
  register: UseFormRegister<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  onRemove: () => void;
}

export function ChecklistItemEdit({ index, control, register, errors, onRemove }: ChecklistItemEditProps) {
  return (
    <div className="flex items-center gap-1">
      <Controller
        control={control}
        name={`checklist.${index}.status`}
        render={({ field: statusField }) => (
          <Select
            value={statusField.value}
            onValueChange={statusField.onChange}
          >
            <SelectTrigger size="sm" className="h-6 w-auto min-w-0 gap-1 px-1.5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className="min-w-0 flex-1">
        <Input
          {...register(`checklist.${index}.title`)}
          placeholder="Item"
          className="h-6 px-2 text-xs"
          aria-invalid={!!errors.checklist?.[index]?.title}
        />
      </div>
      <Input
        {...register(`checklist.${index}.comment`)}
        placeholder="Comment"
        className="h-6 w-24 min-w-0 px-2 text-xs"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
