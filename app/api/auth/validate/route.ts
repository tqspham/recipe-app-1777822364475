import { verifySessionToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const user = verifySessionToken(token);

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: error instanceof Error ? error.message : 'Validation failed' },
      { status: 401 }
    );
  }
}
