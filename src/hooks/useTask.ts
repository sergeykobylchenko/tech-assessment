import { useEffect, useState } from 'react';
import type { Task } from '@/types/task.types';
import { useDatabase } from './useDatabase';

export function useTask(id: string) {
  const db = useDatabase();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = db.tasks.findOne(id).$.subscribe((doc) => {
      setTask(doc ? (doc.toJSON() as Task) : null);
      setLoading(false);
    });

    return () => sub.unsubscribe();
  }, [db, id]);

  return { task, loading };
}
