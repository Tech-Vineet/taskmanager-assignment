"use client";

import React, { createContext, useContext } from "react";
import { Task, TaskStatus } from "@/types";
import { useAuth } from "./AuthContext";
import { trpc } from "@/lib/trpc";

interface TaskContextType {
  tasks: Task[];
  createTask: (title: string, description: string, status: TaskStatus, deadline?: Date | null, progress?: number) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const { data: tasks = [], isLoading, refetch } = trpc.task.list.useQuery(undefined, {
    enabled: !!user,
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
    },
  });

  const updateMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
    },
  });

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
    },
  });

  const createTask = async (
    title: string,
    description: string,
    status: TaskStatus = "todo",
    deadline?: Date | null,
    progress?: number
  ): Promise<void> => {
    if (!user) return;
    await createMutation.mutateAsync({
      title,
      description,
      status,
      deadline: deadline || null,
      progress,
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    if (!user) return;
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.progress !== undefined) updateData.progress = updates.progress;

    await updateMutation.mutateAsync({
      id,
      ...updateData,
    });
  };

  const deleteTask = async (id: string): Promise<void> => {
    if (!user) return;
    await deleteMutation.mutateAsync({ id });
  };

  // Convert tasks to match Task type with proper date handling
  const formattedTasks: Task[] = tasks.map((task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    deadline: task.deadline ? new Date(task.deadline) : null,
  }));

  return (
    <TaskContext.Provider
      value={{
        tasks: formattedTasks,
        createTask,
        updateTask,
        deleteTask,
        isLoading: isLoading || !user,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}

