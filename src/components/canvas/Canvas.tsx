import { useCallback, useEffect, useRef, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useDatabase } from '@/hooks/useDatabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasImage } from './CanvasImage';
import { TaskPin } from '@/components/task/TaskPin';
import { TaskForm } from '@/components/task/TaskForm';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import type { Task } from '@/types/task.types';

const getImageSizeData = (container: Element, image: HTMLImageElement) => {
  const rect = container.getBoundingClientRect();
  const scale = Math.min(
    rect.width / (image.naturalWidth || 1),
    rect.height / (image.naturalHeight || 1),
  );
  const imageWidth = (image.naturalWidth || 1) * scale;
  const imageHeight = (image.naturalHeight || 1) * scale;

  return {
    imageHeight,
    imageWidth,
    containerWidth: rect.width,
    containerHeight: rect.height,
  };
};

export function Canvas() {
  const { tasks } = useTasks();
  const db = useDatabase();
  const user = useCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isAddingTask = useCanvasStore((s) => s.isAddingTask);
  const setAddingTask = useCanvasStore((s) => s.setAddingTask);
  const selectedTaskId = useCanvasStore((s) => s.selectedTaskId);
  const selectTask = useCanvasStore((s) => s.selectTask);

  const [imageRect, setImageRect] = useState({
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
  });

  const updateImageRect = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const data = getImageSizeData(containerRef.current, imageRef.current);
    setImageRect({
      offsetX: (data.containerWidth - data.imageWidth) / 2,
      offsetY: (data.containerHeight - data.imageHeight) / 2,
      width: data.imageWidth,
      height: data.imageHeight,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => updateImageRect());
    observer.observe(container);
    return () => observer.disconnect();
  }, [updateImageRect]);

  const handleCanvasClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAddingTask || !user || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - imageRect.offsetX) / imageRect.width;
      const y = (e.clientY - rect.top - imageRect.offsetY) / imageRect.height;

      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      const now = Date.now();
      const newTask = {
        id: crypto.randomUUID(),
        planId: '',
        x,
        y,
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
        console.error(error);
      }
      setAddingTask(false);
    },
    [isAddingTask, user, db, setAddingTask, selectTask, imageRect],
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
        <CanvasImage ref={imageRef} onLoad={updateImageRect} />
        <div
          className="absolute"
          style={{
            left: imageRect.offsetX,
            top: imageRect.offsetY,
            width: imageRect.width,
            height: imageRect.height,
          }}
        >
          {tasks.map((task) => (
            <div
              key={task.id}
              className="absolute flex -translate-x-1/2 -translate-y-full"
              style={{
                left: `${task.x * 100}%`,
                top: `${task.y * 100}%`,
              }}
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
    </div>
  );
}
