
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Calendar } from '@/components/ui/calendar';
import { TaskList } from '@/components/task/TaskList';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

export default function CalendarPage() {
  const { tasks } = useTaskContext();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get tasks for the selected date
  const tasksForSelectedDate = date
    ? tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Function to determine if a date has tasks
  const hasTaskOnDate = (day: Date) => {
    return tasks.some((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Button variant="outline" onClick={() => setDate(new Date())}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Today
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <div className="bg-card rounded-lg border p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="pointer-events-auto"
            modifiers={{
              hasTask: (date) => hasTaskOnDate(date),
            }}
            modifiersStyles={{
              hasTask: { 
                fontWeight: 'bold',
                textDecoration: 'underline',
                textDecorationColor: 'hsl(var(--primary))',
                textDecorationThickness: '2px',
                textUnderlineOffset: '4px'
              }
            }}
          />
        </div>
        
        <div>
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4">
              {date ? format(date, "EEEE, MMMM d, yyyy") : "No date selected"}
            </h2>
            
            <TaskList 
              tasks={tasksForSelectedDate} 
              emptyMessage={
                date 
                  ? `No tasks scheduled for ${format(date, "MMMM d, yyyy")}`
                  : "Select a date to view tasks"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
