import { useNavigate } from 'react-router';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserAvatar } from '@/components/users/UserAvatar';
import { useSidebar } from '@/components/ui/sidebar';

export function Header() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="flex h-14 items-center border-b px-4">
      <div className="flex flex-1 items-center">
        <button
          onClick={toggleSidebar}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent"
        >
          {open ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
        </button>
      </div>
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
