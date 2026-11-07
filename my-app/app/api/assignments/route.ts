import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-session';


type AssignmentBody = {
  title?: unknown;
  description?: unknown;
  due_date?: unknown;
  subject_id?: unknown;
  submission_format?: unknown;
  max_file_size_mb?: unknown;
  plagiarism_check_required?: unknown;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number
) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

// GET: Fetch assignments
export async function GET() {
  let connection;

  try {
    const admin = await getAdminSession();

    if (!admin) {
      return jsonResponse(
        { error: 'Unauthorized. Administrator login required.' },
        401
      );
    }

    connection = await getConnection();

    const assignments = await connection.query(`
      SELECT
        a.assignment_id,
        act.title,
        act.description,
        act.due_date,
        act.subject_id,
        a.submission_format,
        a.max_file_size_mb,
        a.plagiarism_check_required
      FROM assignment AS a
      INNER JOIN academic_activity AS act
        ON a.assignment_id = act.activity_id
      ORDER BY a.assignment_id DESC
    `);

    return jsonResponse({ assignments }, 200);

  } catch (error: unknown) {
    console.error('FETCH ASSIGNMENTS ERROR:', error);

    return jsonResponse(
      { error: 'Failed to fetch assignments.' },
      500
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// POST: Create assignment
export async function POST(request: NextRequest) {
  let connection;
  let transactionStarted = false;

  try {
    const admin = await getAdminSession();

    if (!admin) {
      return jsonResponse(
        { error: 'Unauthorized. Administrator login required.' },
        401
      );
    }

    let body: AssignmentBody;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { error: 'Invalid JSON request body.' },
        400
      );
    }

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      return jsonResponse(
        { error: 'Request body must be a JSON object.' },
        400
      );
    }

    const {
      title,
      description,
      due_date,
      subject_id,
      submission_format,
      max_file_size_mb,
      plagiarism_check_required,
    } = body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 255
    ) {
      return jsonResponse(
        { error: 'A valid title is required (maximum 255 characters).' },
        400
      );
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== 'string'
    ) {
      return jsonResponse(
        { error: 'Description must be text.' },
        400
      );
    }

    if (
      typeof submission_format !== 'string' ||
      !submission_format.trim() ||
      submission_format.trim().length > 50
    ) {
      return jsonResponse(
        { error: 'A valid submission_format is required.' },
        400
      );
    }

    const subjectId = Number(subject_id);
    const maxFileSize = Number(max_file_size_mb);

    if (
      subject_id === undefined ||
      subject_id === null ||
      !Number.isSafeInteger(subjectId) ||
      subjectId <= 0
    ) {
      return jsonResponse(
        { error: 'subject_id must be a positive integer.' },
        400
      );
    }

    if (
      max_file_size_mb === undefined ||
      max_file_size_mb === null ||
      !Number.isSafeInteger(maxFileSize) ||
      maxFileSize < 1 ||
      maxFileSize > 500
    ) {
      return jsonResponse(
        { error: 'max_file_size_mb must be an integer between 1 and 500.' },
        400
      );
    }

    let dueDate: Date;

    if (due_date === undefined || due_date === null || due_date === '') {
      dueDate = new Date();
    } else {
      if (typeof due_date !== 'string' && typeof due_date !== 'number') {
        return jsonResponse(
          { error: 'Invalid due_date.' },
          400
        );
      }

      dueDate = new Date(due_date);

      if (Number.isNaN(dueDate.getTime())) {
        return jsonResponse(
          { error: 'Invalid due_date.' },
          400
        );
      }
    }

    if (
      plagiarism_check_required !== undefined &&
      typeof plagiarism_check_required !== 'boolean' &&
      plagiarism_check_required !== 0 &&
      plagiarism_check_required !== 1
    ) {
      return jsonResponse(
        { error: 'plagiarism_check_required must be boolean.' },
        400
      );
    }

    const plagiarism =
      plagiarism_check_required === true ||
      plagiarism_check_required === 1;

    connection = await getConnection();

    // Confirm the subject exists before inserting.
    const subjects = await connection.query(
      `SELECT subject_id FROM subject WHERE subject_id = ? LIMIT 1`,
      [subjectId]
    );

    if (subjects.length === 0) {
      return jsonResponse(
        { error: 'The selected subject does not exist.' },
        400
      );
    }

    await connection.beginTransaction();
    transactionStarted = true;

    const activityResult = await connection.query(
      `
      INSERT INTO academic_activity
      (
        title,
        description,
        due_date,
        subject_id,
        activity_type,
        created_at
      )
      VALUES (?, ?, ?, ?, 'Assignment', NOW())
      `,
      [
        title.trim(),
        typeof description === 'string' && description.trim()
          ? description.trim()
          : null,
        dueDate,
        subjectId,
      ]
    );

    const newAssignmentId = Number(activityResult.insertId);

    if (!Number.isSafeInteger(newAssignmentId) || newAssignmentId <= 0) {
      throw new Error('Invalid generated assignment ID.');
    }

    await connection.query(
      `
      INSERT INTO assignment
      (
        assignment_id,
        submission_format,
        max_file_size_mb,
        plagiarism_check_required
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        newAssignmentId,
        submission_format.trim(),
        maxFileSize,
        plagiarism ? 1 : 0,
      ]
    );

    await connection.commit();
    transactionStarted = false;

    return jsonResponse(
      {
        success: true,
        message: 'Assignment created successfully.',
        assignment_id: newAssignmentId,
      },
      201
    );

  } catch (error: unknown) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('ASSIGNMENT ROLLBACK ERROR:', rollbackError);
      }
    }

    console.error('CREATE ASSIGNMENT ERROR:', error);

    return jsonResponse(
      { error: 'Failed to create assignment.' },
      500
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}