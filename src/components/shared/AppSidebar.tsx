import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTasks } from '@/hooks/useTasks';
import { STATUS_ICONS, STATUS_COLORS, STATUS_LABELS } from '@/utils/constants';
import { useCanvasStore } from '@/stores/useCanvasStore';
import type { TaskStatus } from '@/types/task.types';

export function AppSidebar() {
  const { tasks, loading } = useTasks();
  const selectTask = useCanvasStore((s) => s.selectTask);
  const { setOpenMobile, isMobile } = useSidebar();

  const handleTaskClick = (taskId: string) => {
    selectTask(taskId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold">Tasks List</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>All Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu
              className="flex gap-2"
            >
              {loading ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No tasks yet
                </div>
              ) : (
                tasks.map((task) => {
                  const Icon = STATUS_ICONS[task.status as TaskStatus];
                  const color = STATUS_COLORS[task.status as TaskStatus];
                  const label = STATUS_LABELS[task.status as TaskStatus];
                  return (
                    <SidebarMenuItem key={task.id}
                      className="w-full cursor-pointer rounded-md border-l-3 bg-card py-3 px-1 text-left transition-colors hover:bg-accent"
                      style={{ borderLeftColor: color }}
                    >
                      <SidebarMenuButton
                        onClick={() => handleTaskClick(task.id)}
                        className="h-auto flex flex-col items-start gap-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon
                            style={{ color }}
                            className="size-3.5 shrink-0"
                          />
                          <span className="text-xs text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium leading-snug">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
