"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ProgressBar } from "./ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  mode: "create" | "edit";
}

export function TaskDialog({ open, onOpenChange, task, mode }: TaskDialogProps) {
  const { createTask, updateTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [deadline, setDeadline] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "");
      setProgress(task.progress ?? (task.status === "done" ? 100 : task.status === "in-progress" ? 50 : 0));
    } else if (open && mode === "create") {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setDeadline("");
      setProgress(0);
    }
  }, [open, task, mode]);

  useEffect(() => {
    // Auto-update progress based on status
    if (status === "done") {
      setProgress(100);
    } else if (status === "in-progress") {
      if (progress === 0 || progress === 100) {
        setProgress(50);
      }
    } else if (status === "todo") {
      if (progress === 100) {
        setProgress(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineDate = deadline ? new Date(deadline) : null;
    
    try {
      if (mode === "create") {
        await createTask(title, description, status, deadlineDate, progress);
      } else if (task) {
        await updateTask(task.id, { 
          title, 
          description, 
          status, 
          deadline: deadlineDate,
          progress 
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving task:", error);
      // Optionally show error message to user
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <Card className="w-full max-w-md mx-4 sm:mx-0 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 shadow-2xl border-2 max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">{mode === "create" ? "Create New Task" : "Edit Task"}</CardTitle>
          <CardDescription className="mt-1">
            {mode === "create"
              ? "Add a new task to your list"
              : "Update your task details"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="progress" className="text-sm font-medium">
                Progress: {progress}%
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  id="progress"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <ProgressBar progress={progress} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Deadline <span className="text-muted-foreground text-xs">(Optional)</span>
              </label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              {mode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

