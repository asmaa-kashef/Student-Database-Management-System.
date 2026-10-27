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

export async function GET(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    pool = await new sql.ConnectionPool(config).connect();
    
    let result;

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    // التحقق مما إذا كان المدخل رقماً (للبحث الدقيق بالمطابقة التامة للـ student_id)
    const isNumeric = /^\d+$/.test(query);

    if (isNumeric) {
      // البحث برقم الـ student_id حصراً وبمطابقة تامة لكي يظهر الطالب المقصود فقط
      result = await pool.request()
        .input('idNum', sql.Int, Number(query))
        .query(`
          SELECT student_id, matriculation_number, major, current_semester, gpa 
          FROM dbo.student 
          WHERE student_id = @idNum
        `);
    } else {
      // البحث النصي للتخصصات أو أرقام القيد
      result = await pool.request()
        .input('searchTerm', sql.VarChar, `%${query}%`)
        .query(`
          SELECT student_id, matriculation_number, major, current_semester, gpa 
          FROM dbo.student 
          WHERE matriculation_number LIKE @searchTerm 
             OR major LIKE @searchTerm
        `);
    }

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error: unknown) {
    console.error('SEARCH ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}