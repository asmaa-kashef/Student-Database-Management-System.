
import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/admin-session';


export async function POST() {
  try {
    await clearAdminSession();

    return NextResponse.json(
      { message: 'Logout successful.' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('ADMIN LOGOUT ERROR:', error);

    return NextResponse.json(
      { error: 'Unable to log out right now.' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}
