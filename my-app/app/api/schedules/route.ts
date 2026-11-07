
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET: Fetch all class schedules
export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const schedules = await connection.query(`
      SELECT
        schedule_id,
        subject_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
        lecture_type
      FROM class_schedule
      ORDER BY
        FIELD(
          day_of_week,
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ),
        start_time
    `);

    return NextResponse.json(
      { schedules },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH SCHEDULES ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch class schedules.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}

// POST: Create a new class schedule
export async function POST(request: NextRequest) {
  let connection;

  try {
    let body;

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
      subject_id == null ||
      !Number.isSafeInteger(Number(subject_id)) ||
      Number(subject_id) <= 0 ||
      typeof day_of_week !== 'string' ||
      typeof start_time !== 'string' ||
      typeof end_time !== 'string' ||
      typeof room_number !== 'string' ||
      !room_number.trim()
    ) {
      return NextResponse.json(
        { error: 'Invalid or missing required schedule fields.' },
        { status: 400 }
      );
    }

    // Validate day of week
    const validDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const day = day_of_week.trim();

    if (!validDays.includes(day)) {
      return NextResponse.json(
        { error: 'Invalid day of week.' },
        { status: 400 }
      );
    }

    // Validate time format
    const timeRegex =
      /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.(\d{1,6}))?)?$/;

    const startTime = start_time.trim();
    const endTime = end_time.trim();

    const startMatch = startTime.match(timeRegex);
    const endMatch = endTime.match(timeRegex);

    if (!startMatch || !endMatch) {
      return NextResponse.json(
        { error: 'Time must use HH:mm, HH:mm:ss, or HH:mm:ss.ffffff format.' },
        { status: 400 }
      );
    }

    // Compare times, including optional microseconds
    const toMicroseconds = (match: RegExpMatchArray) =>
      Number(match[1]) * 3600000000 +
      Number(match[2]) * 60000000 +
      Number(match[3] ?? 0) * 1000000 +
      Number((match[4] ?? '').padEnd(6, '0'));

    if (toMicroseconds(endMatch) <= toMicroseconds(startMatch)) {
      return NextResponse.json(
        { error: 'End time must be later than start time.' },
        { status: 400 }
      );
    }

    // Validate optional lecture type
    const validLectureTypes = [
      'Lecture',
      'Tutorial',
      'Lab',
      'Seminar',
    ];

    if (
      lecture_type != null &&
      !validLectureTypes.includes(lecture_type)
    ) {
      return NextResponse.json(
        { error: 'Invalid lecture type.' },
        { status: 400 }
      );
    }

    if (room_number.trim().length > 50) {
      return NextResponse.json(
        { error: 'Room number must not exceed 50 characters.' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Verify that the subject exists
    const subjects = await connection.query(
      'SELECT subject_id FROM subject WHERE subject_id = ?',
      [Number(subject_id)]
    );

    if (subjects.length === 0) {
      return NextResponse.json(
        { error: 'The selected subject does not exist.' },
        { status: 404 }
      );
    }

    // Insert schedule using parameterized query
    const result = await connection.query(
      `INSERT INTO class_schedule (
        subject_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
        lecture_type
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Number(subject_id),
        day,
        startTime,
        endTime,
        room_number.trim(),
        lecture_type ?? null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        schedule_id: result.insertId,
        message: 'Class schedule added successfully.',
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('CREATE SCHEDULE ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to create class schedule.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}
