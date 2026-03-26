import { z } from 'zod';

const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Item title is required'),
  status: z.enum(['not-started', 'in-progress', 'blocked', 'final-check', 'done']),
  comment: z.string().optional(),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['not-started', 'in-progress', 'blocked', 'final-check', 'done']),
  description: z.string(),
  checklist: z.array(checklistItemSchema),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
