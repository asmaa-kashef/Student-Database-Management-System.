import { NextResponse } from 'next/server';
// استوردي اتصال قاعدة البيانات لديك (مثلاً mssql أو pg أو prisma)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, subject_id, deadline } = body;

    if (!title || !subject_id) {
      return NextResponse.json(
        { error: 'Project Title and Subject ID are required.' },
        { status: 400 }
      );
    }

    // مثال للاستعلام (حسّبي اسم الجدول وحقوله طبقاً لـ aimap_db لديك):
    /*
    const result = await pool.request()
      .input('Title', title)
      .input('SubjectID', subject_id)
      .query(`
        INSERT INTO dbo.course_project (Title, ForeignSubjectKey)
        VALUES (@Title, @SubjectID)
      `);
    */

    return NextResponse.json(
      { message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Database operation failed', details: err.message },
      { status: 500 }
    );
  }
}