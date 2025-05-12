
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, TaskTag } from '@/types/task';
import { toast } from '@/components/ui/sonner';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  tags: TaskTag[];
  addTag: (tag: Omit<TaskTag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<TaskTag>) => void;
  removeTag: (id: string) => void;
  deleteTag: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Example tags
const defaultTags: TaskTag[] = [
  { id: '1', name: 'Work', color: '#9b87f5' },
  { id: '2', name: 'Personal', color: '#4ade80' },
  { id: '3', name: 'Study', color: '#facc15' },
  { id: '4', name: 'Health', color: '#fb923c' },
];

// Example tasks
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial project proposal with budget estimates and timeline',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    createdAt: new Date(),
    tags: [defaultTags[0]], // Work
    completed: false,
  },
  {
    id: '2',
    title: 'Morning jog',
    description: 'Go for a 30-minute jog in the park',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(new Date().setHours(8, 0, 0, 0)), // Today at 8 AM
    createdAt: new Date(),
    tags: [defaultTags[3]], // Health
    completed: false,
  },
  {
    id: '3',
    title: 'Read chapter 5',
    description: 'Read chapter 5 of "Design Patterns" book',
    priority: 'low',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    createdAt: new Date(),
    tags: [defaultTags[2]], // Study
    completed: false,
  },
  {
    id: '4',
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and vegetables',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date(),
    tags: [defaultTags[1]], // Personal
    completed: false,
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks, (key, value) => {
      if (key === 'dueDate' || key === 'createdAt') {
        return value ? new Date(value) : null;
      }
      return value;
    }) : defaultTasks;
  });
  
  const [tags, setTags] = useState<TaskTag[]>(() => {
    // Load tags from localStorage if available
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : defaultTags;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success('Task created successfully');
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
    toast.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'todo' }
          : task
      )
    );
    toast.success('Task status updated');
  };

  const addTag = (tag: Omit<TaskTag, 'id'>) => {
    const newTag = {
      ...tag,
      id: crypto.randomUUID(),
    };
    setTags((prev) => [...prev, newTag]);
  };

  const updateTag = (id: string, updatedTag: Partial<TaskTag>) => {
    setTags((prev) =>
      prev.map((tag) =>
        tag.id === id ? { ...tag, ...updatedTag } : tag
      )
    );
    toast.success('Tag updated successfully');
    
    // Also update this tag in all tasks
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.map((tag) => 
          tag.id === id ? { ...tag, ...updatedTag } : tag
        ),
      }))
    );
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    // Also remove this tag from all tasks
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== id),
      }))
    );
  };
  
  const deleteTag = (id: string) => {
    removeTag(id);
    toast.success('Tag deleted successfully');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        tags,
        addTag,
        updateTag,
        removeTag,
        deleteTag,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
