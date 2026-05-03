import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const USER_ID_COOKIE = 'recipe_app_user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (!userId) {
    userId = randomUUID();
    cookieStore.set(USER_ID_COOKIE, userId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  return userId;
}
