import { useNavigate, useLocation } from 'react-router';
import { PanelLeft, PanelLeftClose, ArrowLeft } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserAvatar } from '@/components/users/UserAvatar';
import { useSidebar } from '@/components/ui/sidebar';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/canvas')}
      className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent"
    >
      <ArrowLeft className="size-5" />
    </button>
  );
}

function SidebarToggle() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent"
    >
      {open ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
    </button>
  );
}

const ROUTE_CONFIG: Record<string, { title: string; LeftButton: React.FC }> = {
  '/settings': { title: 'Settings', LeftButton: BackButton },
  '/canvas': { title: 'Task board', LeftButton: SidebarToggle },
};

const DEFAULT_CONFIG = ROUTE_CONFIG['/canvas'];

export function Header() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const { title, LeftButton } = ROUTE_CONFIG[location.pathname] ?? DEFAULT_CONFIG;

  return (
    <header className="flex h-14 items-center border-b px-4">
      <div className="flex flex-1 items-center">
        <LeftButton />
      </div>
      <h1 className="flex-1 text-center text-lg font-semibold">{title}</h1>
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
