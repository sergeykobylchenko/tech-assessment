import { Navigate, Outlet } from 'react-router';
import { useUserStore } from '@/stores/useUserStore';
import { DatabaseProvider } from '@/db/DatabaseProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/shared/Header';
import { AppSidebar } from '@/components/shared/AppSidebar';

export function AuthenticatedLayout() {
  const activeUserId = useUserStore((s) => s.activeUserId);

  if (!activeUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DatabaseProvider userId={activeUserId}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </DatabaseProvider>
  );
}
