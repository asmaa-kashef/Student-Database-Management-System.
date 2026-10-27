import { NextResponse } from 'next/server';
import sql from 'mssql';

// إعدادات الاتصال بقاعدة البيانات SQL Server
const dbConfig = {
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_SERVER || 'localhost',
  database: 'aimap_db',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// دالة مساعدة للاتصال بقاعدة البيانات
async function getPool() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// POST: حفظ بيانات تسليم الواجب في جدول dbo.student_submits_activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, assignment_id, submission_date, grade, status } = body;

    // التحقق من الحقول الإجبارية
    if (!student_id || !assignment_id || !submission_date) {
      return NextResponse.json(
        { error: 'Student ID, Assignment ID, and Submission Date are required.' },
        { status: 400 }
      );
    }

    const pool = await getPool();
    await pool.request()
      .input('StudentID', sql.Int, student_id)
      .input('AssignmentID', sql.Int, assignment_id)
      .input('SubmissionDate', sql.DateTime, new Date(submission_date))
      .input('Grade', sql.Decimal(5, 2), grade !== null && grade !== '' ? Number(grade) : null)
      .input('Status', sql.NVarChar, status || 'Submitted')
      .query(`
        INSERT INTO dbo.student_submits_activity (student_id, assignment_id, submission_date, grade, status)
        VALUES (@StudentID, @AssignmentID, @SubmissionDate, @Grade, @Status)
      `);

    return NextResponse.json(
      { success: true, message: 'Submission record saved successfully' },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Database operation failed', details: err.message },
      { status: 500 }
    );
  }
}

// GET: جلب قائمة الواجبات الحقيقية من جدول dbo.assignment لعرضها في القائمة المنسدلة
export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT assignment_id, submission_format, max_file_size_mb, plagiarism_check_required 
      FROM dbo.assignment
    `);

    return NextResponse.json({ assignments: result.recordset }, { status: 200 });

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch assignments', details: err.message },
      { status: 500 }
    );
  }
}