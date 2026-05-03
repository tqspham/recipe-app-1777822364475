import { supabase } from '@/lib/supabase';
import { hashPassword, validateEmail, validatePasswordStrength, createSessionToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] || 'Password is too weak' },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from('recipe_app_1777822364475_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const userId = uuidv4();
    const hashedPassword = await hashPassword(password);

    const { error: insertError } = await supabase
      .from('recipe_app_1777822364475_users')
      .insert([
        {
          id: userId,
          email,
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) throw insertError;

    try {
      const sessionToken = createSessionToken({ id: userId, email });

      const response = NextResponse.json(
        { success: true, userId },
        { status: 201 }
      );

      response.cookies.set('auth_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    } catch (tokenError) {
      const errorMessage = tokenError instanceof Error ? tokenError.message : 'Token creation failed';
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
