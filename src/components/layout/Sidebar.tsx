
import { Home, Calendar, ListTodo, Tag, Clock, Settings, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/context/TaskContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { tags } = useTaskContext();

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-20 transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="mb-8 mt-4">
            <Button asChild variant="default" className="w-full">
              <Link to="/new-task">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Link>
            </Button>
          </div>
          
          <nav className="space-y-2 mb-8">
            <Link
              to="/"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/tasks")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <ListTodo className="mr-3 h-4 w-4" />
              Tasks
            </Link>
            <Link
              to="/calendar"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/calendar")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Calendar
            </Link>
          </nav>
          
          <div className="mb-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </h3>
          </div>
          <div className="space-y-1 mb-8">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tags/${tag.id}`}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isLinkActive(`/tags/${tag.id}`)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <div 
                  className="mr-3 h-3 w-3 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </Link>
            ))}
            <Link
              to="/tags"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/tags")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Tag className="mr-3 h-4 w-4" />
              Manage Tags
            </Link>
          </div>
          
          <div className="mb-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Time
            </h3>
          </div>
          <div className="space-y-1 mb-8">
            <Link
              to="/today"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/today")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Clock className="mr-3 h-4 w-4" />
              Today
            </Link>
            <Link
              to="/upcoming"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/upcoming")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Clock className="mr-3 h-4 w-4" />
              Upcoming
            </Link>
          </div>
          
          <div className="border-t border-sidebar-border pt-4">
            <Link
              to="/settings"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isLinkActive("/settings")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
