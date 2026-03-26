import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores/useUserStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const updateUser = useUserStore((s) => s.updateUser);
  const logout = useUserStore((s) => s.logout);
  const deleteUser = useUserStore((s) => s.deleteUser);

  const [name, setName] = useState(user?.name ?? '');

  if (!user) return null;

  function handleSaveName() {
    updateUser(user!.id, { name });
  }

  function handleSwitchUser() {
    logout();
    navigate('/login');
  }

  function handleDeleteUser() {
    deleteUser(user!.id);
    navigate('/login');
  }

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="user-name">
          Display name
        </label>
        <div className="flex gap-2">
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button onClick={handleSaveName} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-3 border-t pt-6">
        <Button variant="outline" className="w-full" onClick={handleSwitchUser}>
          Switch user
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDeleteUser}
        >
          Delete user
        </Button>
      </div>
    </div>
  );
}
