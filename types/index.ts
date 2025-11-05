export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date | null;
  progress?: number; // 0-100
}

export interface User {
  id: string;
  email: string;
  name: string;
}

