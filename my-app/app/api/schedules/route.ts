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

// GET: Fetch all class schedules
export async function GET() {
  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await new sql.ConnectionPool(config).connect();

    const result = await pool.request().query(`
      SELECT
        schedule_id,
        subject_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
        lecture_type
      FROM dbo.class_schedule;
    `);

    return NextResponse.json(
      { schedules: result.recordset },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('FETCH SCHEDULES ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch class schedules.',
        details:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}

// POST: Create a new class schedule
export async function POST(request: NextRequest) {
  let pool: sql.ConnectionPool | null = null;

  try {
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
      subject_id,
      day_of_week,
      start_time,
      end_time,
      room_number,
      lecture_type,
    } = body ?? {};

    // Validate required fields
    if (
      subject_id === undefined ||
      subject_id === null ||
      subject_id === '' ||
      !Number.isInteger(Number(subject_id)) ||
      Number(subject_id) <= 0 ||
      !day_of_week ||
      !start_time ||
      !end_time ||
      !room_number
    ) {
      return NextResponse.json(
        {
          error:
            'Valid subject_id, day_of_week, start_time, end_time, and room_number are required.',
        },
        { status: 400 }
      );
    }

    // Validate time format: HH:mm or HH:mm:ss
    const timeRegex =
      /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

    const startTime = String(start_time).trim();
    const endTime = String(end_time).trim();

    const startMatch = startTime.match(timeRegex);
    const endMatch = endTime.match(timeRegex);

    if (!startMatch || !endMatch) {
      return NextResponse.json(
        {
          error: 'Invalid time format. Use HH:mm or HH:mm:ss.',
          example: {
            start_time: '09:00',
            end_time: '10:30',
          },
        },
        { status: 400 }
      );
    }

    // Ensure the end time is later than the start time
    const startSeconds =
      Number(startMatch[1]) * 3600 +
      Number(startMatch[2]) * 60 +
      Number(startMatch[3] ?? 0);

    const endSeconds =
      Number(endMatch[1]) * 3600 +
      Number(endMatch[2]) * 60 +
      Number(endMatch[3] ?? 0);

    if (endSeconds <= startSeconds) {
      return NextResponse.json(
        {
          error: 'end_time must be later than start_time.',
        },
        { status: 400 }
      );
    }

    pool = await new sql.ConnectionPool(config).connect();

    const result = await pool
      .request()
      .input('subjectId', sql.Int, Number(subject_id))
      .input(
        'dayOfWeek',
        sql.VarChar(15),
        String(day_of_week).trim()
      )
      .input('startTime', sql.VarChar(8), startTime)
      .input('endTime', sql.VarChar(8), endTime)
      .input(
        'roomNumber',
        sql.VarChar(50),
        String(room_number).trim()
      )
      .input(
        'lectureType',
        sql.VarChar(20),
        lecture_type ? String(lecture_type).trim() : null
      )
      .query(`
        INSERT INTO dbo.class_schedule (
          subject_id,
          day_of_week,
          start_time,
          end_time,
          room_number,
          lecture_type
        )
        OUTPUT INSERTED.schedule_id
        VALUES (
          @subjectId,
          @dayOfWeek,
          CONVERT(time, @startTime),
          CONVERT(time, @endTime),
          @roomNumber,
          @lectureType
        );
      `);

    return NextResponse.json(
      {
        success: true,
        schedule_id: result.recordset[0]?.schedule_id,
        message: 'Class schedule added successfully.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('CREATE SCHEDULE ERROR:', error);

    return NextResponse.json(
      {
        error: 'Failed to create class schedule.',
        details:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}
