import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let connection;

  try {
    const params = await context.params;
    const studentId = Number(params.id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid student ID.' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const rows = await connection.query(
      `
      SELECT
        s.student_id,
        s.matriculation_number,
        s.major,
        s.current_semester,
        s.gpa,
        u.user_id,
        u.full_name,
        u.email,
        u.user_role
      FROM student s
      LEFT JOIN academic_user u
        ON s.student_id = u.user_id
      WHERE s.student_id = ?
      `,
      [studentId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });

  } catch (error: unknown) {
    console.error('FETCH STUDENT DETAIL ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch student details.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}