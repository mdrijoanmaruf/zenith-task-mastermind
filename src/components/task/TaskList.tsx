
import { TaskCard } from './TaskCard';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskList({ tasks, emptyMessage = "No tasks found" }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
