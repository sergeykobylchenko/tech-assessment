import type { LucideIcon } from 'lucide-react';
import {
  Ban,
  Circle,
  CircleCheckBig,
  LoaderCircle,
  SearchCheck,
} from 'lucide-react';
import type { ChecklistItemStatus } from '@/types/task.types';

// Blocked → Final Check → In Progress → Not Started → Done
export const STATUS_CRITICAL_RANKING: ChecklistItemStatus[] = [
  'blocked', 'in-progress', 'final-check', 'not-started', 'done'
];

export const STATUS_ICONS: Record<ChecklistItemStatus, LucideIcon> = {
  'not-started': Circle,
  'in-progress': LoaderCircle,
  'blocked': Ban,
  'final-check': SearchCheck,
  'done': CircleCheckBig,
};

export const STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'blocked': 'Blocked',
  'final-check': 'Final Check awaiting',
  'done': 'Done',
};

export const STATUS_COLORS: Record<ChecklistItemStatus, string> = {
  'not-started': 'var(--color-grey-500, #6b7280)',
  'in-progress': 'var(--color-yellow-500, #eab308)',
  'blocked': 'var(--color-red-500, #ef4444)',
  'final-check': 'var(--color-indigo-500, #6366f1)',
  'done': 'var(--color-green-500, #22c55e)',
};