
import { NextRequest, NextResponse } from 'next/server';

import { verifyUser } from '@/lib/auth';
import { createAdminSession } from '@/lib/admin-session';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = body?.username;
    const password = body?.password;

    // Validate input
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Verify administrator credentials
    const admin = await verifyUser(
      username.trim(),
      password
    );

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Create secure administrator session
    await createAdminSession(admin);

    return NextResponse.json(
      {
        message: 'Login successful.',
        redirectTo: '/maintenance/dashboard',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );

  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error);

    return NextResponse.json(
      { error: 'Unable to sign in right now.' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
