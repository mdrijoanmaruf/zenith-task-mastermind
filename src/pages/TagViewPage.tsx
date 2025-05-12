
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTaskContext } from "@/context/TaskContext";
import { TaskList } from "@/components/task/TaskList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, ArrowLeft } from "lucide-react";

export default function TagViewPage() {
  const { id } = useParams<{ id: string }>();
  const { tasks, tags } = useTaskContext();
  const [tag, setTag] = useState<any>(null);
  const [taggedTasks, setTaggedTasks] = useState([]);

  useEffect(() => {
    if (id) {
      const foundTag = tags.find(t => t.id === id);
      setTag(foundTag);

      if (foundTag) {
        const filtered = tasks.filter(task => 
          task.tags && task.tags.includes(id)
        );
        setTaggedTasks(filtered);
      }
    }
  }, [id, tasks, tags]);

  if (!tag) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Tag not found</h3>
        <p className="text-muted-foreground mb-4">
          The tag you're looking for doesn't exist or has been deleted
        </p>
        <Button asChild>
          <Link to="/tags">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tags
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/tags">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Tags
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <h1 className="text-3xl font-bold">{tag.name}</h1>
        </div>
        <div className="text-muted-foreground">
          {taggedTasks.length} {taggedTasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <div
        className="h-1 rounded-full"
        style={{ backgroundColor: tag.color }}
      />

      {taggedTasks.length > 0 ? (
        <TaskList tasks={taggedTasks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No tasks with this tag</h3>
          <p className="text-muted-foreground mb-4">
            Add this tag to tasks to see them here
          </p>
          <Button asChild>
            <Link to="/new-task">
              Create a task with this tag
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
