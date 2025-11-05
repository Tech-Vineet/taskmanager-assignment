import { httpBatchLink } from '@trpc/client';
import { createTRPCClient } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function createTRPCClientProxy() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const userId = typeof window !== 'undefined' ? localStorage.getItem('user-id') : null;
          return userId ? { 'x-user-id': userId } : {};
        },
      }),
    ],
  });
}

