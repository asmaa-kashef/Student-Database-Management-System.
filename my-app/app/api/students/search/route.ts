
import { NextRequest, NextResponse, connection } from 'next/server';
import { getConnection } from '@/lib/db';
import type { PoolConnection } from 'mariadb';

export async function GET(request: NextRequest) {
  await connection();

  let dbConnection: PoolConnection | undefined;

  try {
    const query = request.nextUrl.searchParams.get('q')?.trim() || '';

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    dbConnection = await getConnection();

    let students;

    const isNumeric = /^\d+$/.test(query);

    if (isNumeric) {
      const studentId = Number(query);

      if (!Number.isSafeInteger(studentId) || studentId <= 0) {
        return NextResponse.json([], { status: 200 });
      }

      students = await dbConnection.query(
        `
        SELECT
          student_id,
          matriculation_number,
          major,
          current_semester,
          gpa
        FROM student
        WHERE student_id = ?
        `,
        [studentId]
      );
    } else {
      students = await dbConnection.query(
        `
        SELECT
          student_id,
          matriculation_number,
          major,
          current_semester,
          gpa
        FROM student
        WHERE matriculation_number LIKE ?
           OR major LIKE ?
        ORDER BY student_id ASC
        `,
        [`%${query}%`, `%${query}%`]
      );
    }

    return NextResponse.json(students, { status: 200 });
  } catch (error: unknown) {
    console.error('SEARCH STUDENTS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch search results.' },
      { status: 500 }
    );
  } finally {
    if (dbConnection) {
      dbConnection.release();
    }
  }
}
