import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, subject_id, enrollment_date, final_grade, attendance_rate } = body;

    if (!student_id || !subject_id || !enrollment_date) {
      return NextResponse.json(
        { error: 'Student ID, Subject ID, and Enrollment Date are required.' },
        { status: 400 }
      );
    }

    /* مثال للربط بقاعدة البيانات (SQL Server):
    await pool.request()
      .input('StudentID', student_id)
      .input('SubjectID', subject_id)
      .input('EnrollmentDate', enrollment_date)
      .input('FinalGrade', final_grade ?? null)
      .input('AttendanceRate', attendance_rate ?? null)
      .query(`
        INSERT INTO dbo.student_enrols_subject (student_id, subject_id, enrollment_date, final_grade, attendance_rate)
        VALUES (@StudentID, @SubjectID, @EnrollmentDate, @FinalGrade, @AttendanceRate)
      `);
    */

    return NextResponse.json(
      { success: true, message: 'Enrollment record saved successfully' },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Database operation failed', details: err.message },
      { status: 500 }
    );
  }
}