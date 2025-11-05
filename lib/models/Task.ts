import mongoose, { Schema, models, model } from 'mongoose';
import { TaskStatus } from '@/types';

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date | null;
  progress?: number;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = models.Task || model<ITask>('Task', TaskSchema);

