import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { Task } from "@/lib/models/Task";
import { TaskStatus } from "@/types";
import connectDB from "@/lib/mongodb";

export const taskRouter = router({

  list: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();
    const tasks = await Task.find({ userId: ctx.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return tasks.map((task: any) => ({
      id: String(task._id),
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deadline: task.deadline ?? null,
      progress: typeof task.progress === 'number' ? task.progress : 0,
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(["todo", "in-progress", "done"]).optional(),
        deadline: z.coerce.date().nullable().optional(),
        progress: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await connectDB();

      const task = await Task.create({
        title: input.title,
        description: input.description,
        status: input.status || "todo",
        userId: ctx.user.id,
        deadline: input.deadline ?? null,
        progress: typeof input.progress === 'number' ? input.progress : 0,
      });

      const t: any = task;
      return {
        id: t._id.toString(),
        title: t.title,
        description: t.description,
        status: t.status as TaskStatus,
        userId: t.userId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        deadline: t.deadline ?? null,
        progress: typeof t.progress === 'number' ? t.progress : 0,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        status: z.enum(["todo", "in-progress", "done"]).optional(),
        deadline: z.coerce.date().nullable().optional(),
        progress: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await connectDB();

      const { id, ...updates } = input;

      const task = await Task.findOneAndUpdate(
        { _id: id, userId: ctx.user.id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();

      if (!task) throw new Error("Task not found");

      const t: any = task;
      return {
        id: t._id.toString(),
        title: t.title,
        description: t.description,
        status: t.status as TaskStatus,
        userId: t.userId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        deadline: t.deadline ?? null,
        progress: typeof t.progress === 'number' ? t.progress : 0,
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

      if (!task) throw new Error("Task not found");

      return { success: true };
    }),
});
