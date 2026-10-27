import { NextResponse } from 'next/server';
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
    
    // استعلام يربط جدول الأساتذة بجدول المستخدمين لجلب الـ ID والاسم الحقيقي
    const result = await pool.request().query(`
      SELECT 
        p.professor_id, 
        u.full_name 
      FROM dbo.professor p
      JOIN dbo.academic_user u ON p.professor_id = u.user_id
    `);

    return NextResponse.json({ professors: result.recordset }, { status: 200 });
  } catch (error) {
    console.error('FETCH PROFESSORS ERROR:', error);
    return NextResponse.json({ professors: [], error: 'Failed to fetch professors' }, { status: 500 });
  } finally {
    if (pool) await pool.close();
  }
}