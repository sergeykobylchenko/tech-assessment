import { useNavigate } from 'react-router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserAvatar } from '@/components/users/UserAvatar';

export function Header() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center border-b px-4">
      <div className="flex-1" />
      <h1 className="flex-1 text-center text-lg font-semibold">Task board</h1>
      <div className="flex-1 flex justify-end">
        {user && (
          <button className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings")}>
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <UserAvatar name={user.name} />
          </button>
        )}
      </div>
    </header>
  );
}
