import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql/msnodesqlv8';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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
    
    // جلب الطلاب مع استعلام آمن ومباشر لتجنب أخطاء 500
    const result = await pool.request().query(`
      SELECT student_id, matriculation_number AS full_name 
      FROM dbo.student;
    `);

    return NextResponse.json({ students: result.recordset }, { status: 200 });
  } catch (error: unknown) {
    console.error('FETCH STUDENTS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}

export async function POST(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;
  let transaction: sql.Transaction | null = null;

  try {
    // 1. Validate JSON
    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      matriculation_number,
      major,
      current_semester,
      gpa,
    } = body ?? {};

    // 2. Validate required fields and types
    const requiredStrings = [
      ['fullName', fullName],
      ['email', email],
      ['matriculation_number', matriculation_number],
      ['major', major],
    ] as const;

    for (const [field, value] of requiredStrings) {
      if (typeof value !== 'string' || !value.trim()) {
        return NextResponse.json(
          { error: `${field} is required and must be a non-empty string.` },
          { status: 400 }
        );
      }
    }

    if (
      current_semester === undefined ||
      current_semester === null ||
      current_semester === '' ||
      gpa === undefined ||
      gpa === null ||
      gpa === ''
    ) {
      return NextResponse.json(
        { error: 'current_semester and gpa are required.' },
        { status: 400 }
      );
    }

    // 3. Normalize strings
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMatriculation = matriculation_number.trim();
    const normalizedMajor = major.trim();

    // 4. Validate field lengths against known database columns
    if (normalizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must not exceed 100 characters.' },
        { status: 400 }
      );
    }

    if (normalizedEmail.length > 120) {
      return NextResponse.json(
        { error: 'Email must not exceed 120 characters.' },
        { status: 400 }
      );
    }

    if (normalizedMatriculation.length > 50) {
      return NextResponse.json(
        { error: 'Matriculation number must not exceed 50 characters.' },
        { status: 400 }
      );
    }

    if (normalizedMajor.length > 200) {
      return NextResponse.json(
        { error: 'Major must not exceed 200 characters.' },
        { status: 400 }
      );
    }

    // 5. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 6. Validate name and text fields
    if (normalizedName.length < 2) {
      return NextResponse.json(
        { error: 'Name must contain at least 2 characters.' },
        { status: 400 }
      );
    }

    if (normalizedMatriculation.length < 1) {
      return NextResponse.json(
        { error: 'Matriculation number is required.' },
        { status: 400 }
      );
    }

    // 7. Validate semester and GPA
    const semester = Number(current_semester);
    const grade = Number(gpa);

    if (!Number.isInteger(semester) || semester < 1) {
      return NextResponse.json(
        {
          error: 'Invalid current semester.',
          details: 'Semester must be a positive integer.',
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(grade) ||
      grade < 0 ||
      grade > 4
    ) {
      return NextResponse.json(
        {
          error: 'Invalid GPA.',
          details: 'GPA must be a number between 0 and 4.',
        },
        { status: 400 }
      );
    }

    if (Math.round(grade * 100) !== grade * 100) {
      return NextResponse.json(
        {
          error: 'Invalid GPA precision.',
          details: 'GPA can have at most 2 decimal places.',
        },
        { status: 400 }
      );
    }

    // 8. Hash a generated temporary password
    const temporaryPassword = randomUUID();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    // 9. Connect to database
    pool = await new sql.ConnectionPool(config).connect();

    // 10. Check for duplicate email or matriculation number
    const existingEmail = await pool.request()
      .input('email', sql.VarChar(120), normalizedEmail)
      .query(`
        SELECT user_id
        FROM dbo.academic_user
        WHERE email = @email
      `);

    if (existingEmail.recordset.length > 0) {
      return NextResponse.json(
        {
          error: 'Email already exists.',
          details: 'Please use an email that is not registered.',
        },
        { status: 409 }
      );
    }

    const existingMatriculation = await pool.request()
      .input(
        'matriculationNumber',
        sql.VarChar(50),
        normalizedMatriculation
      )
      .query(`
        SELECT student_id
        FROM dbo.student
        WHERE matriculation_number = @matriculationNumber
      `);

    if (existingMatriculation.recordset.length > 0) {
      return NextResponse.json(
        {
          error: 'Matriculation number already exists.',
          details: 'Please use a different matriculation number.',
        },
        { status: 409 }
      );
    }

    // 11. Insert both records atomically
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const userResult = await new sql.Request(transaction)
      .input('fullName', sql.VarChar(100), normalizedName)
      .input('email', sql.VarChar(120), normalizedEmail)
      .input('passwordHash', sql.VarChar(255), passwordHash)
      .input('userRole', sql.VarChar(20), 'student')
      .query(`
        INSERT INTO dbo.academic_user (
          full_name,
          email,
          password_hash,
          user_role,
          created_at,
          is_active
        )
        OUTPUT INSERTED.user_id
        VALUES (
          @fullName,
          @email,
          @passwordHash,
          @userRole,
          GETDATE(),
          1
        );
      `);

    const userId = userResult.recordset[0]?.user_id;

    if (userId === undefined || userId === null) {
      throw new Error('Could not retrieve the new user ID.');
    }

    await new sql.Request(transaction)
      .input('studentId', sql.Int, userId)
      .input(
        'matriculationNumber',
        sql.VarChar(50),
        normalizedMatriculation
      )
      .input('major', sql.VarChar(200), normalizedMajor)
      .input('semester', sql.Int, semester)
      .input('gpa', sql.Decimal(4, 2), grade)
      .query(`
        INSERT INTO dbo.student (
          student_id,
          matriculation_number,
          major,
          current_semester,
          gpa
        )
        VALUES (
          @studentId,
          @matriculationNumber,
          @major,
          @semester,
          @gpa
        );
      `);

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Student created successfully.',
        user_id: userId,
        student_id: userId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Transaction rollback failed:', rollbackError);
      }
    }

    console.error('CREATE STUDENT ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to create student.',
        details:
          error instanceof Error
            ? error.message
            : 'Unknown database error.',
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close().catch((error) => {
        console.error('Database pool close failed:', error);
      });
    }
  }
}