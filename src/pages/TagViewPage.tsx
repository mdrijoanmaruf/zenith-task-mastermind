
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTaskContext } from "@/context/TaskContext";
import { TaskList } from "@/components/task/TaskList";
import { Tag } from "lucide-react";
import { TaskTag } from "@/types/task";

export default function TagViewPage() {
  const { id } = useParams();
  const { tasks, tags } = useTaskContext();
  const [taggedTasks, setTaggedTasks] = useState([]);
  const [currentTag, setCurrentTag] = useState<TaskTag | null>(null);
  
  useEffect(() => {
    // Find the tag that matches the id
    const foundTag = tags.find(tag => tag.id === id);
    if (foundTag) {
      setCurrentTag(foundTag);
      
      // Filter tasks that have this tag
      const filtered = tasks.filter(task => 
        task.tags.some(taskTag => taskTag.id === id)
      );
      
      setTaggedTasks(filtered);
    }
  }, [id, tasks, tags]);
  
  if (!currentTag) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks tagged: {currentTag.name}</h1>
        <div 
          className="h-6 w-6 rounded-full" 
          style={{ backgroundColor: currentTag.color }}
        />
      </div>
      
      <div className="bg-accent p-4 rounded-lg">
        <p className="text-accent-foreground">
          You have <span className="font-bold">{taggedTasks.length}</span> tasks with this tag.
        </p>
      </div>
      
      {taggedTasks.length > 0 ? (
        <TaskList tasks={taggedTasks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No tasks with this tag</h3>
          <p className="text-muted-foreground">
            Add some tasks with this tag to see them here
          </p>
        </div>
      )}
    </div>
  );
}
