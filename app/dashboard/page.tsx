"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Task, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskFilters } from "@/components/TaskFilters";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, LogOut, CheckCircle2, Clock, Circle } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { tasks, isLoading } = useTasks();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const filteredTasks = useMemo(() => {
    let filtered: Task[] = tasks;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Redirecting...</div>
      </div>
    );
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
              Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! 👋
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} className="shadow-sm text-xs sm:text-sm">
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 icon-3d" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Circle className="h-5 w-5 text-primary icon-3d" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All tasks</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-gray-500/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">To Do</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                <Circle className="h-5 w-5 text-gray-500 icon-3d" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{taskStats.todo}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500 icon-3d" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{taskStats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Done</CardTitle>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 icon-3d" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{taskStats.done}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <div className="flex-1">
            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2 icon-3d" />
            Create Task
          </Button>
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="border-dashed border-2 animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Plus className="h-12 w-12 text-muted-foreground icon-3d-large" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
              </h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                {tasks.length === 0
                  ? "Get started by creating your first task and stay organized!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {tasks.length === 0 && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2 icon-3d" />
                  Create Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        )}

        {/* Create Task Dialog */}
        <TaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          mode="create"
        />
      </div>
    </div>
  );
}

