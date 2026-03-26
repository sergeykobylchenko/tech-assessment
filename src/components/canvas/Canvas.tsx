import { useCallback, useRef } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useDatabase } from '@/hooks/useDatabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasImage } from './CanvasImage';
import { TaskPin } from './TaskPin';
import { TaskForm } from './TaskForm';

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
      await db.tasks.insert({
        id: crypto.randomUUID(),
        planId: '',
        x,
        y,
        xRatio,
        yRatio,
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        authorId: user.id,
        authorName: user.name,
        createdAt: now,
        updatedAt: now,
      });

      setAddingTask(false);
    },
    [isAddingTask, user, db, setAddingTask],
  );

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

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
          <div className={`absolute flex-1`}
            style={{ left: `${task.x}%`, top: `${task.y}%` }}
          >
            <TaskPin
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onClick={() => selectTask(task.id === selectedTaskId ? null : task.id)}
            />
            {selectedTask?.id === task.id && (
              <TaskForm
                task={selectedTask}
                onClose={() => selectTask(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
