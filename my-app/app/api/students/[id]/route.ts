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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let pool: sql.ConnectionPool | null = null;
  try {
    const params = await context.params;
    const studentId = params.id;

    pool = await new sql.ConnectionPool(config).connect();

    const result = await pool.request()
      .input('studentId', sql.VarChar, studentId)
      .query(`
        SELECT * FROM dbo.student WHERE student_id = @studentId
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Student not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset[0], { status: 200 });
  } catch (error: unknown) {
    console.error('FETCH STUDENT DETAIL ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student details.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}