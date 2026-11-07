
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();

    const {
      student_id,
      subject_id,
      enrollment_date,
      final_grade,
      attendance_rate,
    } = body;

    // 1. Validate required fields
    if (
      student_id == null ||
      subject_id == null ||
      !enrollment_date
    ) {
      return NextResponse.json(
        { error: 'Student ID, Subject ID, and Enrollment Date are required.' },
        { status: 400 }
      );
    }

    // 2. Validate IDs
    if (
      !Number.isInteger(Number(student_id)) ||
      !Number.isInteger(Number(subject_id)) ||
      Number(student_id) <= 0 ||
      Number(subject_id) <= 0
    ) {
      return NextResponse.json(
        { error: 'Student ID and Subject ID must be positive integers.' },
        { status: 400 }
      );
    }

    // 3. Validate grade
    if (
      final_grade != null &&
      (
        typeof final_grade !== 'number' ||
        !Number.isFinite(final_grade) ||
        final_grade < 0 ||
        final_grade > 100
      )
    ) {
      return NextResponse.json(
        { error: 'Final grade must be between 0 and 100.' },
        { status: 400 }
      );
    }

    // 4. Validate attendance
    if (
      attendance_rate != null &&
      (
        typeof attendance_rate !== 'number' ||
        !Number.isFinite(attendance_rate) ||
        attendance_rate < 0 ||
        attendance_rate > 100
      )
    ) {
      return NextResponse.json(
        { error: 'Attendance rate must be between 0 and 100.' },
        { status: 400 }
      );
    }

    // 5. Validate date format
    if (
      typeof enrollment_date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(enrollment_date) ||
      Number.isNaN(Date.parse(enrollment_date))
    ) {
      return NextResponse.json(
        { error: 'Enrollment date must use YYYY-MM-DD format.' },
        { status: 400 }
      );
    }

    // 6. Connect to MariaDB
    connection = await getConnection();

    // 7. Insert using parameterized query
    const result = await connection.query(
      `
        INSERT INTO student_enrolls_subject
        (
          student_id,
          subject_id,
          enrollment_date,
          final_grade,
          attendance_rate
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        Number(student_id),
        Number(subject_id),
        enrollment_date,
        final_grade ?? null,
        attendance_rate ?? null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Enrollment record saved successfully.',
        enrollment_id: result.insertId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Enrollment creation failed:', error);

    return NextResponse.json(
      { error: 'Unable to save enrollment record.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
