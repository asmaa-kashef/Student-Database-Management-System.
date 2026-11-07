
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET: Fetch assignments for the submission dropdown
export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const assignments = await connection.query(`
      SELECT
        a.assignment_id,
        aa.title,
        aa.description,
        aa.subject_id,
        aa.due_date,
        a.submission_format,
        a.max_file_size_mb,
        a.plagiarism_check_required
      FROM assignment a
      INNER JOIN academic_activity aa
        ON a.assignment_id = aa.activity_id
      ORDER BY aa.due_date ASC
    `);

    return NextResponse.json(
      { assignments },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH ASSIGNMENTS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch assignments.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}

// POST: Save a student submission
export async function POST(request: NextRequest) {
  let connection;

  try {
    // 1. Validate JSON
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
      student_id,
      assignment_id,
      submission_date,
      grade,
      status,
      file_attachment_url,
      submission_text,
    } = body as Record<string, unknown>;

    // 2. Validate IDs
    const studentId = Number(student_id);
    const activityId = Number(assignment_id);

    if (
      student_id == null ||
      !Number.isSafeInteger(studentId) ||
      studentId <= 0 ||
      assignment_id == null ||
      !Number.isSafeInteger(activityId) ||
      activityId <= 0
    ) {
      return NextResponse.json(
        { error: 'Valid student ID and assignment ID are required.' },
        { status: 400 }
      );
    }

    // 3. Validate submission date
    if (
      typeof submission_date !== 'string' ||
      !submission_date.trim()
    ) {
      return NextResponse.json(
        { error: 'Submission date is required.' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(submission_date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid submission date.' },
        { status: 400 }
      );
    }

    // Convert to a MariaDB-compatible datetime
    const submissionTime = parsedDate
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    // 4. Validate optional grade
    let gradeAwarded: number | null = null;

    if (grade !== undefined && grade !== null && grade !== '') {
      if (
        (typeof grade !== 'number' && typeof grade !== 'string') ||
        (typeof grade === 'string' && !grade.trim())
      ) {
        return NextResponse.json(
          { error: 'Invalid grade.' },
          { status: 400 }
        );
      }

      gradeAwarded = Number(grade);

      if (
        !Number.isFinite(gradeAwarded) ||
        gradeAwarded < 0 ||
        gradeAwarded > 999.99 ||
        Math.round(gradeAwarded * 100) !== gradeAwarded * 100
      ) {
        return NextResponse.json(
          { error: 'Grade must be a valid number with at most 2 decimal places.' },
          { status: 400 }
        );
      }
    }

    // 5. Validate status against the database CHECK constraint
    const validStatuses = [
      'SUBMITTED',
      'LATE',
      'GRADED',
      'RESUBMISSION_REQUESTED',
    ];

    const submissionStatus =
      status == null || status === ''
        ? 'SUBMITTED'
        : status;

    if (
      typeof submissionStatus !== 'string' ||
      !validStatuses.includes(submissionStatus)
    ) {
      return NextResponse.json(
        { error: 'Invalid submission status.' },
        { status: 400 }
      );
    }

    // 6. Validate optional attachment URL
    if (
      file_attachment_url != null &&
      (
        typeof file_attachment_url !== 'string' ||
        file_attachment_url.length > 255
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid attachment URL.' },
        { status: 400 }
      );
    }

    // 7. Validate optional submission text
    if (
      submission_text != null &&
      typeof submission_text !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Submission text must be a string.' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // 8. Verify student exists
    const students = await connection.query(
      'SELECT student_id FROM student WHERE student_id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return NextResponse.json(
        { error: 'Student not found.' },
        { status: 404 }
      );
    }

    // 9. Verify the assignment exists
    const assignments = await connection.query(
      `
      SELECT assignment_id
      FROM assignment
      WHERE assignment_id = ?
      `,
      [activityId]
    );

    if (assignments.length === 0) {
      return NextResponse.json(
        { error: 'Assignment not found.' },
        { status: 404 }
      );
    }

    // 10. Insert submission
    const result = await connection.query(
      `
      INSERT INTO student_submits_activity (
        student_id,
        activity_id,
        submission_time,
        file_attachment_url,
        submission_text,
        grade_awarded,
        submission_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        studentId,
        activityId,
        submissionTime,
        file_attachment_url ?? null,
        submission_text ?? null,
        gradeAwarded,
        submissionStatus,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Submission record saved successfully.',
        submission_id: result.insertId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('CREATE SUBMISSION ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to save submission.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}
