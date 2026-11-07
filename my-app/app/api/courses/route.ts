
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-session';

// =====================================================
// GET: Fetch all courses (Admin only)
// =====================================================

export async function GET() {
  let connection: Awaited<ReturnType<typeof getConnection>> | undefined;

  try {
    // 1. Verify administrator session
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator login is required.' },
        { status: 401 }
      );
    }

    // 2. Connect to database
    connection = await getConnection();

    // 3. Fetch courses
    const courses = await connection.query(`
      SELECT
        subject_id,
        course_code,
        subject_name
      FROM subject
      ORDER BY subject_id DESC
    `);

    return NextResponse.json(
      { courses },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (error: unknown) {
    console.error('FETCH COURSES ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch courses.' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// =====================================================
// POST: Create a new course (Admin only)
// =====================================================

export async function POST(request: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | undefined;

  try {
    // 1. Verify administrator session
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator login is required.' },
        { status: 401 }
      );
    }

    // 2. Parse JSON request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    // 3. Validate request body
    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: 'Request body must be a valid object.' },
        { status: 400 }
      );
    }

    const courseData = body as Record<string, unknown>;

    const {
      course_code,
      subject_name,
      professor_id,
      credits,
      semester,
    } = courseData;

    // 4. Validate required fields
    if (
      typeof course_code !== 'string' ||
      !course_code.trim() ||
      typeof subject_name !== 'string' ||
      !subject_name.trim() ||
      professor_id === undefined ||
      professor_id === null ||
      credits === undefined ||
      credits === null ||
      typeof semester !== 'string' ||
      !semester.trim()
    ) {
      return NextResponse.json(
        { error: 'All required fields must be provided.' },
        { status: 400 }
      );
    }

    // 5. Validate numeric fields
    const professorId = Number(professor_id);
    const courseCredits = Number(credits);

    if (!Number.isSafeInteger(professorId) || professorId <= 0) {
      return NextResponse.json(
        { error: 'Invalid professor_id.' },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(courseCredits) ||
      courseCredits <= 0 ||
      courseCredits > 99.9
    ) {
      return NextResponse.json(
        { error: 'Invalid credits value.' },
        { status: 400 }
      );
    }

    // 6. Connect to MariaDB
    connection = await getConnection();

    // 7. Insert course using parameterized query
    const result = await connection.query(
      `
      INSERT INTO subject
      (
        course_code,
        subject_name,
        professor_id,
        credits,
        semester,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [
        course_code.trim(),
        subject_name.trim(),
        professorId,
        courseCredits,
        semester.trim(),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Course created successfully.',
        subject_id: Number(result.insertId),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('CREATE COURSE ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to create course.' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
