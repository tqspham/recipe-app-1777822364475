import bcrypt from 'bcryptjs';
import { jwtSign, jwtVerify } from '@/lib/jwt';

export interface AuthUser {
  id: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createSessionToken(user: AuthUser): string {
  return jwtSign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);
}

export function verifySessionToken(token: string): AuthUser | null {
  try {
    const payload = jwtVerify(token, process.env.JWT_SECRET!);
    return { id: payload.id as string, email: payload.email as string };
  } catch (error) {
    return null;
  }
}
