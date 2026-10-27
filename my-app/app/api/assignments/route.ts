import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

const config: sql.config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'aimap_db',
  driver: 'ODBC Driver 18 for SQL Server',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    encrypt: false,
  },
};

export async function POST(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;
  let transaction: sql.Transaction | null = null;

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const {
      title,          // من جدول academic_activity الأساسي إن وجد، أو يتم إدخاله
      description,    // وصف النشاط
      due_date,       // موعد التسليم
      subject_id,     // الكورس المرتبط به
      submission_format,
      max_file_size_mb,
      plagiarism_check_required,
    } = body ?? {};

    // التحقق من الحقول الأساسية
    if (!submission_format || !max_file_size_mb || !subject_id) {
      return NextResponse.json(
        { error: 'submission_format, max_file_size_mb, and subject_id are required fields.' },
        { status: 400 }
      );
    }

    pool = await new sql.ConnectionPool(config).connect();
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // 1. نفترض أن الواجب يتبع جدول نشاط عام (academic_activity) أو يتم إدخاله مباشرة إذا كان الجدول مستقلًا
    // إذا كان جدول academic_activity هو الأب، نقوم بإدخاله أولاً لجلب الـ ID:
    const activityResult = await new sql.Request(transaction)
      .input('title', sql.VarChar(150), title || 'Assignment')
      .input('description', sql.VarChar(sql.MAX), description || null)
      .input('dueDate', sql.DateTime, due_date ? new Date(due_date) : new Date())
      .input('subjectId', sql.Int, Number(subject_id))
      .query(`
        INSERT INTO dbo.academic_activity (title, description, due_date, subject_id, activity_type, created_at)
        OUTPUT INSERTED.activity_id
        VALUES (@title, @description, @dueDate, @subjectId, 'Assignment', GETDATE());
      `);

    const newAssignmentId = activityResult.recordset[0]?.activity_id;

    if (!newAssignmentId) {
      throw new Error('Failed to generate activity ID for assignment.');
    }

    // 2. إدخال تفاصيل الواجب في جدول dbo.assignment باستخدام نفس الـ ID (باعتباره PK, FK)
    await new sql.Request(transaction)
      .input('assignmentId', sql.Int, newAssignmentId)
      .input('subFormat', sql.VarChar(50), submission_format.trim())
      .input('maxSize', sql.Int, Number(max_file_size_mb))
      .input('plagiarism', sql.Bit, plagiarism_check_required ? 1 : 0)
      .query(`
        INSERT INTO dbo.assignment (assignment_id, submission_format, max_file_size_mb, plagiarism_check_required)
        VALUES (@assignmentId, @subFormat, @maxSize, @plagiarism);
      `);

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Assignment created successfully.',
        assignment_id: newAssignmentId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (transaction) {
      try { await transaction.rollback(); } catch (rbErr) { console.error(rbErr); }
    }
    console.error('CREATE ASSIGNMENT ERROR:', error);
    return NextResponse.json(
      {
        error: 'Failed to create assignment.',
        details: error instanceof Error ? error.message : 'Unknown database error.',
      },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close().catch((err) => console.error(err));
  }
}