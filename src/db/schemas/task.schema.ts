import type { RxJsonSchema } from 'rxdb';
import type { Task } from '@/types/task.types';

export const taskSchema: RxJsonSchema<Task> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    planId: { type: 'string', maxLength: 100 },
    x: { type: 'number' },
    y: { type: 'number' },
    xRatio: { type: 'number' },
    yRatio: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    status: { type: 'string', enum: ['not-started', 'in-progress', 'blocked', 'final-check', 'done'] },
    priority: { type: 'string', enum: ['low','medium','high'] },
    authorId: { type: 'string' },
    authorName: { type: 'string' },
    checklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['not-started', 'in-progress', 'blocked', 'final-check', 'done'] },
          comment: { type: ['string', 'null'] },
        },
      },
    },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
  },
  required: ['id', 'planId', 'x', 'y', 'xRatio', 'yRatio', 'title', 'authorId', 'authorName', 'createdAt', 'updatedAt'],
  indexes: ['planId']
};
