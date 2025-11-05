"use client";

import { Task } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTasks } from "@/contexts/TaskContext";
import { useState } from "react";
import { TaskDialog } from "./TaskDialog";
import { ProgressBar } from "./ProgressBar";
import { DeadlineCountdown } from "./DeadlineCountdown";

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
  todo: { label: "To Do", icon: Circle, color: "bg-gray-500" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-blue-500" },
  done: { label: "Done", icon: CheckCircle2, color: "bg-green-500" },
};

export function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTask } = useTasks();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const StatusIcon = statusConfig[task.status].icon;

  const handleStatusChange = async (newStatus: Task["status"]) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getNextStatus = (): Task["status"] => {
    if (task.status === "todo") return "in-progress";
    if (task.status === "in-progress") return "done";
    return "todo";
  };

  const statusColors = {
    todo: "border-l-gray-500 bg-gray-500/5 hover:bg-gray-500/10",
    "in-progress": "border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10",
    done: "border-l-green-500 bg-green-500/5 hover:bg-green-500/10",
  };

  const badgeColors = {
    todo: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20 hover:bg-gray-500/20",
    "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 hover:bg-blue-500/20",
    done: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 hover:bg-green-500/20",
  };

  const taskProgress = task.progress ?? (task.status === "done" ? 100 : task.status === "in-progress" ? 50 : 0);

  return (
    <>
      <Card className={`group border-l-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] card-3d relative overflow-hidden backdrop-blur-sm h-full flex flex-col ${statusColors[task.status]}`}>
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-primary/5 transition-all duration-300 pointer-events-none"></div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        
        <CardHeader className="pb-3 relative z-10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {task.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs sm:text-sm mb-3">
                {task.description || "No description"}
              </CardDescription>
            </div>
            
            {/* Edit and Delete buttons - always visible with enhanced styling */}
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 hover:scale-110 transition-all rounded-full shadow-sm hover:shadow-md"
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 icon-3d" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this task?")) {
                    try {
                      await deleteTask(task.id);
                    } catch (error) {
                      console.error("Error deleting task:", error);
                    }
                  }
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10 hover:scale-110 transition-all rounded-full shadow-sm hover:shadow-md"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 icon-3d" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Content area with fixed spacing */}
        <div className="flex-1 flex flex-col justify-between px-6 pb-6 relative z-10 min-h-0">
          <div className="space-y-3 flex-shrink-0">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
                <span className="text-xs font-semibold text-primary">{taskProgress}%</span>
              </div>
              <ProgressBar progress={taskProgress} />
            </div>

            {/* Deadline Countdown - Always reserve space for consistent height */}
            <div className="min-h-[1.5rem]">
              {task.deadline ? (
                <DeadlineCountdown deadline={new Date(task.deadline)} />
              ) : (
                <div className="h-[1.5rem]"></div>
              )}
            </div>
          </div>
          
          {/* Footer with status badge and date */}
          <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-3 border-t">
            <Badge
              variant="outline"
              className={`cursor-pointer transition-all duration-200 badge-3d hover:scale-105 ${badgeColors[task.status]}`}
              onClick={() => handleStatusChange(getNextStatus())}
            >
              <StatusIcon className="h-3 w-3 mr-1.5 icon-3d" />
              {statusConfig[task.status].label}
            </Badge>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {format(task.updatedAt, "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </Card>
      <TaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={task}
        mode="edit"
      />
    </>
  );
}

