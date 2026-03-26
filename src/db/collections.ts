import type { RxCollection, RxDatabase } from 'rxdb';
import type { Task } from '@/types/task.types';
import type { Plan } from '@/types/plan.types';
import { taskSchema } from './schemas/task.schema';
import { planSchema } from './schemas/plan.schema';

export type TaskCollection = RxCollection<Task>;
export type PlanCollection = RxCollection<Plan>;

export interface AppCollections {
  tasks: TaskCollection;
  plans: PlanCollection;
}

export async function addCollections(db: RxDatabase<AppCollections>): Promise<void> {
  await db.addCollections({
    tasks: { schema: taskSchema },
    plans: { schema: planSchema}
  });
}
