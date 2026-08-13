import { createNeonAuth } from '@neondatabase/auth/next/server';
import { logger } from '../logger';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});

export async function getSession() {
  try {
    const session = await auth.getSession();
    if (session.data?.user) {
      logger.debug("Active user session resolved", "AuthServer", { userId: session.data.user.id, email: session.data.user.email });
    } else {
      logger.debug("No active user session found", "AuthServer");
    }
    return session;
  } catch (err) {
    logger.error("Failed to retrieve user session", "AuthServer", err);
    throw err;
  }
}