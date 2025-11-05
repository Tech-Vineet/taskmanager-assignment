import { initTRPC, TRPCError } from '@trpc/server';
import { type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';

interface Context {
  req: NextRequest;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

export async function createContext(opts: { req: NextRequest }): Promise<Context> {
  await connectDB();
  
  // For now, we'll get user from session token in headers
  // You can enhance this with JWT or session-based auth later
  const userId = opts.req.headers.get('x-user-id');
  
  let user = null;
  if (userId) {
    const userDoc = await User.findById(userId).lean<any>();
    if (userDoc) {
      user = {
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name,
      };
    }
  }

  return {
    req: opts.req,
    user,
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user, // Now user is definitely not null
    },
  });
});

