import { useUserStore } from '@/stores/useUserStore';
import type { User } from '@/types/user.types';

export function useCurrentUser(): User | null {
  const activeUserId = useUserStore((s) => s.activeUserId);
  const users = useUserStore((s) => s.users);

  if (!activeUserId) return null;
  return users[activeUserId] ?? null;
}
