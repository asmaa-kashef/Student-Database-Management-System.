
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const subjects = await connection.query(`
      SELECT *
      FROM subject
      ORDER BY subject_id ASC
    `);

    return NextResponse.json(
      { subjects },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH SUBJECTS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch subjects.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
