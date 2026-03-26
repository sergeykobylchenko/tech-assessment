import type { RxJsonSchema } from 'rxdb';
import type { Plan } from '@/types/plan.types';

export const planSchema: RxJsonSchema<Plan> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
  },
  required: ['id', 'name'],
};