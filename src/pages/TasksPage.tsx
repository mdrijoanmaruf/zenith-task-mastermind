
import { useState, useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskList } from '@/components/task/TaskList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus } from '@/types/task';

export default function TasksPage() {
  const { tasks } = useTaskContext();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Filter by status
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }
    
    // Sort tasks
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Tasks with due dates first, then null due dates
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.dueDate ? -1 : b.dueDate ? 1 : 0;
      } else if (sortBy === 'priority') {
        // Order: urgent, high, medium, low
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        // Sort by created date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button asChild>
          <Link to="/new-task">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:flex">
          <div className="w-full md:w-40">
            <Select 
              value={filter} 
              onValueChange={(value) => setFilter(value as TaskStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-40">
            <Select 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <TaskList 
        tasks={filteredTasks} 
        emptyMessage={
          searchQuery
            ? "No tasks found matching your search"
            : filter !== 'all'
              ? `No ${filter} tasks found`
              : "No tasks found"
        }
      />
    </div>
  );
}
