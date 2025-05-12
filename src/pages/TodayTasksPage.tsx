
import { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { TaskList } from "@/components/task/TaskList";
import { CalendarDays } from "lucide-react";
import { formatDistance } from "date-fns";

export default function TodayTasksPage() {
  const { tasks } = useTaskContext();
  const [todayTasks, setTodayTasks] = useState([]);
  
  useEffect(() => {
    // Get today's date with time set to midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter tasks that are due today
    const filtered = tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === today.getTime();
    });
    
    setTodayTasks(filtered);
  }, [tasks]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Today's Tasks</h1>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="mr-2 h-5 w-5" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="bg-accent p-4 rounded-lg">
        <p className="text-accent-foreground">
          You have <span className="font-bold">{todayTasks.length}</span> tasks scheduled for today.
        </p>
      </div>
      
      {todayTasks.length > 0 ? (
        <TaskList tasks={todayTasks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No tasks for today</h3>
          <p className="text-muted-foreground">
            Enjoy your day or add some tasks to get started
          </p>
        </div>
      )}
    </div>
  );
}
