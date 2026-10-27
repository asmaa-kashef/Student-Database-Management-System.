import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

// =====================================================
// GET: Fetch all assignments
// =====================================================

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        a.assignment_id,
        act.title,
        act.description,
        act.due_date,
        act.subject_id,
        a.submission_format,
        a.max_file_size_mb,
        a.plagiarism_check_required
      FROM dbo.assignment AS a
      INNER JOIN dbo.academic_activity AS act
        ON a.assignment_id = act.activity_id
    `)

    return NextResponse.json(
      { assignments: result.recordset },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('FETCH ASSIGNMENTS ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch assignments.',
        details:
          error instanceof Error
            ? error.message
            : 'Unknown database error.',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST: Create a new assignment
// =====================================================

export async function POST(request: NextRequest) {
  let transaction: sql.Transaction | null = null;
  try {
    // 1. Parse request body
    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    // 2. Extract fields
    const {
      title,
      description,
      due_date,
      subject_id,
      submission_format,
      max_file_size_mb,
      plagiarism_check_required,
    } = body ?? {};

    // 3. Validate required fields
    if (
      typeof submission_format !== 'string' ||
      !submission_format.trim() ||
      subject_id === undefined ||
      subject_id === null ||
      max_file_size_mb === undefined ||
      max_file_size_mb === null
    ) {
      return NextResponse.json(
        {
          error:
            'submission_format, max_file_size_mb, and subject_id are required fields.',
        },
        { status: 400 }
      );
    }

    // 4. Validate numeric fields
    const subjectId = Number(subject_id);
    const maxFileSize = Number(max_file_size_mb);

    if (!Number.isInteger(subjectId)) {
      return NextResponse.json(
        { error: 'subject_id must be a valid integer.' },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(maxFileSize) ||
      maxFileSize < 0
    ) {
      return NextResponse.json(
        {
          error:
            'max_file_size_mb must be a non-negative integer.',
        },
        { status: 400 }
      );
    }

    // 5. Validate due date
    const dueDate = due_date
      ? new Date(due_date)
      : new Date();

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: 'due_date is invalid.' },
        { status: 400 }
      );
    }

    // 6. Reuse the existing SQL connection pool
    const pool = await getConnection();

    // 7. Begin transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // 8. Insert activity into academic_activity
    const activityResult = await new sql.Request(transaction)
      .input(
        'title',
        sql.VarChar(150),
        typeof title === 'string' && title.trim()
          ? title.trim()
          : 'Assignment'
      )
      .input(
        'description',
        sql.VarChar(sql.MAX),
        typeof description === 'string' && description.trim()
          ? description.trim()
          : null
      )
      .input('dueDate', sql.DateTime, dueDate)
      .input('subjectId', sql.Int, subjectId)
      .query(`
        INSERT INTO dbo.academic_activity
        (
          title,
          description,
          due_date,
          subject_id,
          activity_type,
          created_at
        )
        OUTPUT INSERTED.activity_id
        VALUES
        (
          @title,
          @description,
          @dueDate,
          @subjectId,
          'Assignment',
          GETDATE()
        );
      `);

    // 9. Get generated activity ID
    const newAssignmentId =
      activityResult.recordset[0]?.activity_id;

    if (newAssignmentId == null) {
      throw new Error(
        'Failed to generate activity ID for assignment.'
      );
    }

    // 10. Insert assignment details
    const plagiarism =
      plagiarism_check_required === true ||
      plagiarism_check_required === 1 ||
      plagiarism_check_required === 'true';

    await new sql.Request(transaction)
      .input('assignmentId', sql.Int, newAssignmentId)
      .input(
        'subFormat',
        sql.VarChar(50),
        submission_format.trim()
      )
      .input('maxSize', sql.Int, maxFileSize)
      .input('plagiarism', sql.Bit, plagiarism ? 1 : 0)
      .query(`
        INSERT INTO dbo.assignment
        (
          assignment_id,
          submission_format,
          max_file_size_mb,
          plagiarism_check_required
        )
        VALUES
        (
          @assignmentId,
          @subFormat,
          @maxSize,
          @plagiarism
        );
      `);

    // 11. Commit transaction
    await transaction.commit();
    transaction = null;

    // 12. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Assignment created successfully.',
        assignment_id: newAssignmentId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Roll back if the transaction has not been committed
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error(
          'TRANSACTION ROLLBACK ERROR:',
          rollbackError
        );
      }
    }

    console.error('CREATE ASSIGNMENT ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to create assignment.',
        details:
          error instanceof Error
            ? error.message
            : 'Unknown database error.',
      },
      { status: 500 }
    );
  }
}
