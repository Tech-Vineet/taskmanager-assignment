import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { Task } from '@/lib/models/Task';
import { TaskStatus } from '@/types';
import connectDB from '@/lib/mongodb';

export const taskRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();
    const tasks = await Task.find({ userId: ctx.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deadline: task.deadline || null,
      progress: task.progress ?? (task.status === 'done' ? 100 : task.status === 'in-progress' ? 50 : 0),
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(['todo', 'in-progress', 'done']).optional(),
        deadline: z.union([z.date(), z.string()]).nullable().optional().transform((val) => {
          if (!val) return null;
          if (val instanceof Date) return val;
          return new Date(val);
        }),
        progress: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await connectDB();

      const defaultProgress =
        input.status === 'done' ? 100 : input.status === 'in-progress' ? 50 : 0;

      const task = await Task.create({
        title: input.title,
        description: input.description,
        status: input.status || 'todo',
        userId: ctx.user.id,
        deadline: input.deadline || null,
        progress: input.progress ?? defaultProgress,
      });

      return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deadline: task.deadline || null,
        progress: task.progress ?? defaultProgress,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        status: z.enum(['todo', 'in-progress', 'done']).optional(),
        deadline: z.union([z.date(), z.string()]).nullable().optional().transform((val) => {
          if (!val) return null;
          if (val instanceof Date) return val;
          return new Date(val);
        }),
        progress: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await connectDB();

      const { id, ...updates } = input;
      
      const updateData: any = { ...updates, updatedAt: new Date() };

      const task = await Task.findOneAndUpdate(
        { _id: id, userId: ctx.user.id },
        updateData,
        { new: true }
      ).lean();

      if (!task) {
        throw new Error('Task not found');
      }

      return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deadline: task.deadline || null,
        progress: task.progress ?? (task.status === 'done' ? 100 : task.status === 'in-progress' ? 50 : 0),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await connectDB();

      const task = await Task.findOneAndDelete({
        _id: input.id,
        userId: ctx.user.id,
      }).lean();

      if (!task) {
        throw new Error('Task not found');
      }

      return { success: true };
    }),
});

