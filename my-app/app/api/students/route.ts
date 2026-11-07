
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-session';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';


// GET: Fetch students
export async function GET() {
  let connection;

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

    // 3. Fetch students
    const students = await connection.query(`
      SELECT
        s.student_id,
        u.full_name
      FROM student s
      INNER JOIN academic_user u
        ON s.student_id = u.user_id
      ORDER BY u.full_name ASC
    `);

    return NextResponse.json(
      { students },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH STUDENTS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch students.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// POST: Create a student account
export async function POST(request: NextRequest) {
  let connection;
  let transactionStarted = false;

  try {
    // 1. Verify administrator session
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in as administrator.' },
        { status: 401 }
      );
    }

    // 2. Validate JSON body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      matriculation_number,
      major,
      current_semester,
      gpa,
    } = body as Record<string, unknown>;

    // 3. Validate required student fields
    const requiredFields = [
      ['fullName', fullName],
      ['email', email],
      ['matriculation_number', matriculation_number],
      ['major', major],
    ] as const;

    for (const [field, value] of requiredFields) {
      if (
        typeof value !== 'string' ||
        !value.trim()
      ) {
        return NextResponse.json(
          { error: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    // 4. Normalize input
    const normalizedName = (fullName as string).trim();
    const normalizedEmail = (email as string).trim().toLowerCase();
    const normalizedMatriculation =
      (matriculation_number as string).trim();
    const normalizedMajor = (major as string).trim();

    // 5. Validate field lengths
    if (
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      return NextResponse.json(
        { error: 'Name must contain 2 to 100 characters.' },
        { status: 400 }
      );
    }

    if (
      normalizedEmail.length > 120
    ) {
      return NextResponse.json(
        { error: 'Email must not exceed 120 characters.' },
        { status: 400 }
      );
    }

    if (
      normalizedMatriculation.length > 20
    ) {
      return NextResponse.json(
        { error: 'Matriculation number must not exceed 20 characters.' },
        { status: 400 }
      );
    }

    if (
      normalizedMajor.length > 100
    ) {
      return NextResponse.json(
        { error: 'Major must not exceed 100 characters.' },
        { status: 400 }
      );
    }

    // 6. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 7. Validate semester and GPA
    const semester =
      typeof current_semester === 'number' ||
      (typeof current_semester === 'string' &&
        current_semester.trim() !== '')
        ? Number(current_semester)
        : NaN;

    const grade =
      typeof gpa === 'number' ||
      (typeof gpa === 'string' && gpa.trim() !== '')
        ? Number(gpa)
        : NaN;

    if (
      !Number.isSafeInteger(semester) ||
      semester < 1 ||
      semester > 12
    ) {
      return NextResponse.json(
        { error: 'Semester must be an integer between 1 and 12.' },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(grade) ||
      grade < 0 ||
      grade > 4 ||
      Math.round(grade * 100) !== grade * 100
    ) {
      return NextResponse.json(
        { error: 'GPA must be between 0 and 4 with at most 2 decimal places.' },
        { status: 400 }
      );
    }

    // 8. Generate a random temporary student password
    const temporaryPassword = randomUUID();

    const passwordHash = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // 9. Connect to MariaDB
    connection = await getConnection();

    // 10. Check duplicate email
    const existingEmail = await connection.query(
      `
      SELECT user_id
      FROM academic_user
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists.' },
        { status: 409 }
      );
    }

    // 11. Check duplicate matriculation number
    const existingMatriculation = await connection.query(
      `
      SELECT student_id
      FROM student
      WHERE matriculation_number = ?
      LIMIT 1
      `,
      [normalizedMatriculation]
    );

    if (existingMatriculation.length > 0) {
      return NextResponse.json(
        { error: 'Matriculation number already exists.' },
        { status: 409 }
      );
    }

    // 12. Start transaction
    await connection.beginTransaction();
    transactionStarted = true;

    // 13. Insert academic user
    const userResult = await connection.query(
      `
      INSERT INTO academic_user (
        full_name,
        email,
        password_hash,
        user_role,
        created_at,
        is_active
      )
      VALUES (?, ?, ?, ?, NOW(), ?)
      `,
      [
        normalizedName,
        normalizedEmail,
        passwordHash,
        'student',
        1,
      ]
    );

    const userId = Number(userResult.insertId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error('Failed to create user record.');
    }

    // 14. Insert student record
    await connection.query(
      `
      INSERT INTO student (
        student_id,
        matriculation_number,
        major,
        current_semester,
        gpa
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        normalizedMatriculation,
        normalizedMajor,
        semester,
        grade,
      ]
    );

    // 15. Commit transaction
    await connection.commit();
    transactionStarted = false;

    return NextResponse.json(
      {
        success: true,
        message: 'Student created successfully.',
        user_id: userId,
        student_id: userId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          'STUDENT TRANSACTION ROLLBACK ERROR:',
          rollbackError
        );
      }
    }

    console.error('CREATE STUDENT ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to create student.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
