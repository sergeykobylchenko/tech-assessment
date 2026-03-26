import { z } from 'zod';

const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Item title is required'),
  status: z.enum(['pending', 'done']),
  comment: z.string(),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  checklist: z.array(checklistItemSchema),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
