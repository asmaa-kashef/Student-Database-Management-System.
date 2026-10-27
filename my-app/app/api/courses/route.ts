import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql/msnodesqlv8';

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

// 1. GET: جلب قائمة الكورسات لتعبئة الـ Select (التكامل المرجعي)
export async function GET() {
  let pool: sql.ConnectionPool | null = null;
  try {
    pool = await new sql.ConnectionPool(config).connect();
    const result = await pool.request().query(`
      SELECT subject_id, course_code, subject_name 
      FROM dbo.subject
      ORDER BY subject_id DESC
    `);
    return NextResponse.json({ courses: result.recordset }, { status: 200 });
  } catch (error) {
    console.error('FETCH COURSES ERROR:', error);
    return NextResponse.json({ courses: [], error: 'Failed to fetch courses' }, { status: 500 });
  } finally {
    if (pool) await pool.close();
  }
}

// 2. POST: إنشاء كورس جديد (الذي أرسلناه سابقاً)
export async function POST(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { course_code, subject_name, professor_id, credits, semester } = body ?? {};

    if (!course_code || !subject_name || professor_id === undefined || credits === undefined || !semester) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    pool = await new sql.ConnectionPool(config).connect();

    const result = await pool.request()
      .input('courseCode', sql.VarChar(20), course_code.trim())
      .input('subjectName', sql.VarChar(120), subject_name.trim())
      .input('professorId', sql.Int, Number(professor_id))
      .input('credits', sql.Decimal(3, 1), Number(credits))
      .input('semester', sql.VarChar(30), semester.trim())
      .query(`
        INSERT INTO dbo.subject (course_code, subject_name, professor_id, credits, semester, created_at)
        OUTPUT INSERTED.subject_id
        VALUES (@courseCode, @subjectName, @professorId, @credits, @semester, GETDATE());
      `);

    return NextResponse.json({ success: true, subject_id: result.recordset[0]?.subject_id }, { status: 201 });
  } catch (error: unknown) {
    console.error('CREATE COURSE ERROR:', error);
    return NextResponse.json({ error: 'Failed to create course.' }, { status: 500 });
  } finally {
    if (pool) await pool.close();
  }
}