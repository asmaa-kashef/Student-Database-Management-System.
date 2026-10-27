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

export async function GET() {
  let pool: sql.ConnectionPool | null = null;
  try {
    pool = await new sql.ConnectionPool(config).connect();
    const result = await pool.request().query(`
      SELECT task_id, task_type, title, due_date, priority, status, student_id, project_id, category, estimated_hours, created_at
      FROM dbo.academic_task;
    `);

    return NextResponse.json({ tasks: result.recordset }, { status: 200 });
  } catch (error: unknown) {
    console.error('FETCH TASKS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}

export async function POST(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { task_type, title, due_date, priority, status, student_id, project_id, category, estimated_hours } = body ?? {};

    if (!title || !task_type) {
      return NextResponse.json(
        { error: 'title and task_type are required fields.' },
        { status: 400 }
      );
    }

    // معالجة الـ IDs لتكون null إذا كانت فارغة أو غير صفرية لتجنب أخطاء المفاتيح الأجنبية
    const parsedStudentId = student_id && !isNaN(Number(student_id)) && Number(student_id) > 0 ? Number(student_id) : null;
    const parsedProjectId = project_id && !isNaN(Number(project_id)) && Number(project_id) > 0 ? Number(project_id) : null;

    pool = await new sql.ConnectionPool(config).connect();

    const result = await pool.request()
      .input('taskType', sql.VarChar(50), String(task_type).trim())
      .input('title', sql.VarChar(200), String(title).trim())
      .input('dueDate', sql.Date, due_date ? new Date(due_date) : null)
      .input('priority', sql.VarChar(20), priority ? String(priority).trim() : 'Medium')
      .input('status', sql.VarChar(20), status ? String(status).trim() : 'Pending')
      .input('studentId', sql.Int, parsedStudentId)
      .input('projectId', sql.Int, parsedProjectId)
      .input('category', sql.VarChar(50), category ? String(category).trim() : null)
      .input('estimatedHours', sql.Decimal(5, 2), estimated_hours ? Number(estimated_hours) : null)
      .query(`
        INSERT INTO dbo.academic_task (
          task_type,
          title,
          due_date,
          priority,
          status,
          student_id,
          project_id,
          category,
          estimated_hours,
          created_at
        )
        OUTPUT INSERTED.task_id
        VALUES (
          @taskType,
          @title,
          @dueDate,
          @priority,
          @status,
          @studentId,
          @projectId,
          @category,
          @estimatedHours,
          GETDATE()
        );
      `);

    return NextResponse.json(
      { success: true, task_id: result.recordset[0]?.task_id, message: 'Task created successfully.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('CREATE TASK ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to create task.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}