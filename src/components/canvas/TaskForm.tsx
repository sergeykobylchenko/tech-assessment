import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '@/types/task.types';
import { useDatabase } from '@/hooks/useDatabase';
import { taskFormSchema, type TaskFormValues } from './taskFormSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';

interface TaskFormProps {
  task: Task;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const db = useDatabase();
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

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
      checklist: task.checklist ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'checklist',
  });

  const watchedChecklist = watch('checklist');
  const doneCount = watchedChecklist.filter((i) => i.status === 'done').length;

  async function onSubmit(values: TaskFormValues) {
    const doc = await db.tasks.findOne(task.id).exec();
    if (doc) {
      await doc.patch({
        title: values.title,
        description: values.description,
        checklist: values.checklist,
        updatedAt: Date.now(),
      });
    }
    onClose();
  }

  async function handleDelete() {
    const doc = await db.tasks.findOne(task.id).exec();
    if (doc) {
      await doc.remove();
    }
    onClose();
  }

  function addItem() {
    append({ id: crypto.randomUUID(), title: '', status: 'pending', comment: '' });
  }

  return (
    <div className="w-96 -translate-x-1/2 rounded-lg border bg-popover p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {task.authorName} &middot;{' '}
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

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

        {/* Checklist */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsChecklistOpen((v) => !v)}
            className="flex w-full items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
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

          {isChecklistOpen && (
            <div className="mt-2 space-y-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-1">
                  <Controller
                    control={control}
                    name={`checklist.${index}.status`}
                    render={({ field: statusField }) => (
                      <Checkbox
                        checked={statusField.value === 'done'}
                        onCheckedChange={(checked) =>
                          statusField.onChange(checked ? 'done' : 'pending')
                        }
                        className="shrink-0"
                      />
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
                    onClick={() => remove(index)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
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
