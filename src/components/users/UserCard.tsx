import type { User } from '@/types/user.types';
import { UserAvatar } from './UserAvatar';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
    >
      <UserAvatar name={user.name} />
      <span className="text-sm font-medium">{user.name}</span>
    </button>
  );
}
