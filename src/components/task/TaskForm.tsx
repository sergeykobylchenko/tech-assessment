import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '@/types/task.types';
import { useDatabase } from '@/hooks/useDatabase';
import { taskFormSchema, type TaskFormValues } from './taskFormSchema';
import { ChecklistItemView } from './ChecklistItemView';
import { ChecklistItemEdit } from './ChecklistItemEdit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  X,
} from 'lucide-react';
import { updateTaskStatus } from './utils';
import { STATUS_COLORS, STATUS_LABELS } from '@/utils/constants';

interface TaskFormProps {
  task: Task;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const db = useDatabase();
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status ?? 'not-started',
      checklist: task.checklist ?? [
        {
          id: crypto.randomUUID(),
          title: 'Check item',
          status: 'not-started',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'checklist',
  });

  const watchedChecklist = watch('checklist');
  const doneCount = watchedChecklist.filter((i) => i.status === 'done').length;

  async function onSubmit(values: TaskFormValues) {
    try {
      setError(null);
      const status = updateTaskStatus(values.checklist);
      const doc = await db.tasks.findOne(task.id).exec();
      if (doc) {
        await doc.patch({
          title: values.title,
          description: values.description,
          checklist: values.checklist,
          status,
          updatedAt: Date.now(),
        });
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save task');
    }
  }

  async function handleDelete() {
    try {
      setError(null);
      const doc = await db.tasks.findOne(task.id).exec();
      if (doc) {
        await doc.remove();
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete task');
    }
  }

  function addItem() {
    append({ id: crypto.randomUUID(), title: 'Check item', status: 'not-started', comment: '' });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <p>
            {task.authorName}
          </p>
          <p>
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="text-sm mb-2" style={{color: STATUS_COLORS[task.status]}}>
        {STATUS_LABELS[task.status]}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <Input
            {...register('title')}
            placeholder="Title"
            className="text-sm font-medium"
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <Textarea
          {...register('description')}
          placeholder="Description..."
          rows={3}
          className="resize-none text-sm"
        />
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsChecklistOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {isChecklistOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <span>
                Checklist
                {fields.length > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    ({doneCount}/{fields.length})
                  </span>
                )}
              </span>
            </button>
            {isChecklistOpen && fields.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsEditMode((v) => !v)}
                className={isEditMode ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>
          {isChecklistOpen && (
            <div className="mt-2 space-y-1">
              {fields.map((field, index) => (
                isEditMode ? (
                  <ChecklistItemEdit
                    key={field.id}
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    onRemove={() => remove(index)}
                  />
                ) : (
                  <ChecklistItemView
                    key={field.id}
                    index={index}
                    control={control}
                    title={watchedChecklist[index]?.title}
                    status={watchedChecklist[index]?.status}
                    comment={watchedChecklist[index]?.comment}
                  />
                )
              ))}
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={addItem}
                className="mt-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add item
              </Button>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
        <div className="mt-3 flex justify-between">
          <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <Button type="submit" size="sm">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
