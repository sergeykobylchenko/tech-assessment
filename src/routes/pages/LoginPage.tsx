import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores/useUserStore';
import { UserCard } from '@/components/users/UserCard';
import { CreateUserForm } from '@/components/users/CreateUserForm';

export function LoginPage() {
  const navigate = useNavigate();
  const users = useUserStore((s) => s.users);
  const login = useUserStore((s) => s.login);
  const createUser = useUserStore((s) => s.createUser);

  const userList = Object.values(users);

  function handleSelectUser(userId: string) {
    login(userId);
    navigate('/canvas');
  }

  function handleCreateUser(name: string) {
    const id = createUser(name);
    login(id);
    navigate('/canvas');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-3xl font-semibold">Welcome</h1>
      {userList.length > 0 && (
        <div className="w-full max-w-sm space-y-3">
          <p className="text-sm text-muted-foreground">Select a user</p>
          {userList.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => handleSelectUser(user.id)}
            />
          ))}
        </div>
      )}
      <div className="w-full max-w-sm">
        <p className="mb-3 text-sm text-muted-foreground">
          {userList.length > 0 ? 'Or create a new user' : 'Create a user to get started'}
        </p>
        <CreateUserForm onSubmit={handleCreateUser} />
      </div>
    </div>
  );
}
