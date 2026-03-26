import { useCallback, useRef } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useDatabase } from '@/hooks/useDatabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasImage } from './CanvasImage';
import { TaskPin } from '@/components/task/TaskPin';
import { TaskForm } from '@/components/task/TaskForm';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import type { Task } from '@/types/task.types';

export function Canvas() {
  const { tasks } = useTasks();
  const db = useDatabase();
  const user = useCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);

  const isAddingTask = useCanvasStore((s) => s.isAddingTask);
  const setAddingTask = useCanvasStore((s) => s.setAddingTask);
  const selectedTaskId = useCanvasStore((s) => s.selectedTaskId);
  const selectTask = useCanvasStore((s) => s.selectTask);

  const handleCanvasClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAddingTask || !user || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;
      const now = Date.now();
      const newTask = {
        id: crypto.randomUUID(),
        planId: '',
        x,
        y,
        xRatio,
        yRatio,
        title: '',
        description: '',
        status: 'not-started',
        priority: 'medium',
        authorId: user.id,
        authorName: user.name,
        createdAt: now,
        updatedAt: now,
      } as Task;

      try {
        await db.tasks.insert(newTask);
        selectTask(newTask.id);
      } catch (error) {
        console.error(error)
      }
      setAddingTask(false);
    },
    [isAddingTask, user, db, setAddingTask, selectTask],
  );

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-2">
        <button
          onClick={() => setAddingTask(!isAddingTask)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isAddingTask
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {isAddingTask ? 'Click on image to place...' : 'Add Task'}
        </button>
      </div>
      <div
        ref={containerRef}
        className={`relative flex-1 overflow-hidden ${isAddingTask ? 'cursor-crosshair' : ''}`}
        onClick={handleCanvasClick}
      >
        <CanvasImage />
        {tasks.map((task) => (
          <div
            key={task.id}
            className="absolute flex -translate-x-1/2 -translate-y-full"
            style={{ left: `${task.x}%`, top: `${task.y}%` }}
          >
            <Popover
              open={task.id === selectedTaskId}
              onOpenChange={(open) => selectTask(open ? task.id : null)}
            >
              <PopoverTrigger asChild>
                <TaskPin
                  task={task}
                  isSelected={task.id === selectedTaskId}
                />
              </PopoverTrigger>
              <PopoverContent sideOffset={8} className="w-96 p-4">
                <TaskForm
                  task={task}
                  onClose={() => selectTask(null)}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  );
}
