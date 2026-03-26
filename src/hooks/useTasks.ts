import { useEffect, useState } from 'react';
import type { Task } from '@/types/task.types';
import { useDatabase } from './useDatabase';

export function useTasks() {
  const db = useDatabase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = db.tasks.find().$.subscribe((docs) => {
      setTasks(docs.map((doc) => doc.toJSON() as Task));
      setLoading(false);
    });

    return () => sub.unsubscribe();
  }, [db]);

  return { tasks, loading };
}
