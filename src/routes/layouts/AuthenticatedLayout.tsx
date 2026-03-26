import { Navigate, Outlet } from 'react-router';
import { useUserStore } from '@/stores/useUserStore';
import { DatabaseProvider } from '@/db/DatabaseProvider';
import { Header } from '@/components/shared/Header';

export function AuthenticatedLayout() {
  const activeUserId = useUserStore((s) => s.activeUserId);

  if (!activeUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DatabaseProvider userId={activeUserId}>
      <Header />
      <main>
        <Outlet />
      </main>
    </DatabaseProvider>
  );
}
