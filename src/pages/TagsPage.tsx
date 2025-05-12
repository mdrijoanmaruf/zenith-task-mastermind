
import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tag, Plus, Trash2, PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#9b87f5");
  const { toast } = useToast();

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for your tag",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentTag) {
      updateTag(currentTag.id, { name: newTagName, color: newTagColor });
      toast({
        title: "Tag updated",
        description: `The tag "${newTagName}" has been updated`,
      });
    } else {
      addTag({ name: newTagName, color: newTagColor });
      toast({
        title: "Tag created",
        description: `The tag "${newTagName}" has been created`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditTag = (tag: { id: string; name: string; color: string }) => {
    setIsEditing(true);
    setCurrentTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsDialogOpen(true);
  };

  const handleDeleteTag = (id: string, name: string) => {
    deleteTag(id);
    toast({
      title: "Tag deleted",
      description: `The tag "${name}" has been deleted`,
    });
  };

  const resetForm = () => {
    setNewTagName("");
    setNewTagColor("#9b87f5");
    setIsEditing(false);
    setCurrentTag(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Tags</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-brand-purple hover:bg-brand-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Tag" : "Create New Tag"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update your tag details below"
                  : "Add a new tag to organize your tasks"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  placeholder="Enter tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagColor">Tag Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    id="tagColor"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: newTagColor }}
                  />
                  <Input
                    type="text"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    placeholder="#HEX"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag}>
                {isEditing ? "Update Tag" : "Create Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Card key={tag.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="h-2"
                  style={{ backgroundColor: tag.color }}
                />
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTag(tag)}
                    >
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTag(tag.id, tag.name)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No tags yet</h3>
            <p className="text-muted-foreground mb-4">
              Create tags to help organize your tasks
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-brand-purple hover:bg-brand-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first tag
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
