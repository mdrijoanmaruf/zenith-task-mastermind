
import { format } from 'date-fns';
import { Calendar, CheckCircle, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskContext();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-priority-low';
      case 'medium':
        return 'bg-priority-medium';
      case 'high':
        return 'bg-priority-high';
      case 'urgent':
        return 'bg-priority-urgent';
      default:
        return 'bg-gray-400';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={cn(
      "task-card group",
      task.completed && "opacity-60"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full -mt-0.5"
            onClick={() => completeTask(task.id)}
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex flex-col">
            <h3 className={cn(
              "text-base font-medium",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => completeTask(task.id)}>
              {task.completed ? "Mark as incomplete" : "Mark as complete"}
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <div className={cn("priority-indicator", getPriorityColor(task.priority))} />
        <span className="text-xs text-muted-foreground capitalize">
          {task.priority} priority
        </span>
        
        {task.dueDate && (
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={cn(
              "text-xs",
              isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              {isOverdue ? "Overdue: " : ""}
              {format(new Date(task.dueDate), "MMM dd")}
            </span>
          </div>
        )}
      </div>
      
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {task.tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              className="text-xs py-0 h-5"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
