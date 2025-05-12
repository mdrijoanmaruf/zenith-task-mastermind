
import { useTaskContext } from '@/context/TaskContext';
import { TaskList } from '@/components/task/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { tasks } = useTaskContext();
  
  // For the dashboard, filter out completed tasks
  const todoTasks = tasks.filter(task => !task.completed);
  
  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayTasks = todoTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate < tomorrow;
  });
  
  // Get upcoming tasks (next 7 days, excluding today)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingTasks = todoTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= tomorrow && taskDate <= nextWeek;
  });
  
  // Get overdue tasks
  const overdueTasks = todoTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate < today;
  });
  
  // Get high priority tasks
  const highPriorityTasks = todoTasks.filter(
    task => task.priority === 'high' || task.priority === 'urgent'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/new-task">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasks.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {tasks.filter(task => task.completed).length} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {todayTasks.filter(task => task.completed).length} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {overdueTasks.length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Tasks need attention
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-priority-high">
              {highPriorityTasks.length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Important tasks
            </div>
          </CardContent>
        </Card>
      </div>
      
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-destructive" />
              Overdue Tasks
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/tasks">View All</Link>
            </Button>
          </div>
          <TaskList tasks={overdueTasks} />
        </div>
      )}
      
      {todayTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Due Today
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/today">View All</Link>
            </Button>
          </div>
          <TaskList tasks={todayTasks} />
        </div>
      )}
      
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Tasks
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/upcoming">View All</Link>
            </Button>
          </div>
          <TaskList tasks={upcomingTasks.slice(0, 5)} />
        </div>
      )}
    </div>
  );
}
