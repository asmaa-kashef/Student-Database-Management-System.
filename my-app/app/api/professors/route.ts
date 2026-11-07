
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const professors = await connection.query(`
      SELECT
        p.professor_id,
        u.full_name
      FROM professor p
      INNER JOIN academic_user u
        ON p.professor_id = u.user_id
      ORDER BY u.full_name ASC
    `);

    return NextResponse.json(
      { professors },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH PROFESSORS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch professors.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
