import { getUserId } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    return NextResponse.json({ userId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get user' },
      { status: 500 }
    );
  }
}