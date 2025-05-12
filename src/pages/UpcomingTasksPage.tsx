
import { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { TaskList } from "@/components/task/TaskList";
import { Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistance, addDays, isSameDay, isAfter, isBefore, format } from "date-fns";

export default function UpcomingTasksPage() {
  const { tasks } = useTaskContext();
  const [upcomingTasks, setUpcomingTasks] = useState<any>({
    week: [],
    month: [],
    later: []
  });
  
  useEffect(() => {
    // Get dates for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);
    
    // Filter tasks by timeframe
    const week = [];
    const month = [];
    const later = [];
    
    tasks.forEach(task => {
      if (!task.dueDate) return;
      
      const taskDate = new Date(task.dueDate);
      
      // Skip past and today's tasks
      if (!isAfter(taskDate, today)) return;
      
      if (isBefore(taskDate, nextWeek)) {
        week.push(task);
      } else if (isBefore(taskDate, nextMonth)) {
        month.push(task);
      } else {
        later.push(task);
      }
    });
    
    setUpcomingTasks({
      week,
      month,
      later
    });
  }, [tasks]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Tasks</h1>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-2 h-5 w-5" />
          <span>Plan Ahead</span>
        </div>
      </div>
      
      <Tabs defaultValue="week">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">This Week ({upcomingTasks.week.length})</TabsTrigger>
          <TabsTrigger value="month">This Month ({upcomingTasks.month.length})</TabsTrigger>
          <TabsTrigger value="later">Later ({upcomingTasks.later.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="mt-6">
          {upcomingTasks.week.length > 0 ? (
            <TaskList tasks={upcomingTasks.week} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No upcoming tasks this week</h3>
              <p className="text-muted-foreground">
                Your schedule is clear for the next 7 days
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="month" className="mt-6">
          {upcomingTasks.month.length > 0 ? (
            <TaskList tasks={upcomingTasks.month} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No tasks for this month</h3>
              <p className="text-muted-foreground">
                Your schedule is clear for the next 30 days
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="later" className="mt-6">
          {upcomingTasks.later.length > 0 ? (
            <TaskList tasks={upcomingTasks.later} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No tasks scheduled beyond a month</h3>
              <p className="text-muted-foreground">
                You're all caught up for the foreseeable future
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
