import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

  const user = verifySessionToken(token);
  if (!user) {
    throw new Error('Invalid or expired authentication token');
  }

  return user.id;
}
