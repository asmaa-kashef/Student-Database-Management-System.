
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

const validTaskTypes = ['PERSONAL', 'PROJECT'] as const;
const validPriorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
const validStatuses = [
  'BLOCKED',
  'COMPLETED',
  'IN_PROGRESS',
  'PENDING',
] as const;

function isPositiveInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  );
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// GET: Fetch all tasks
export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const tasks = await connection.query(`
      SELECT
        task_id,
        task_type,
        title,
        due_date,
        priority,
        status,
        student_id,
        project_id,
        category,
        reminder_time,
        milestone_id,
        assigned_student_id,
        estimated_hours,
        created_at
      FROM academic_task
      ORDER BY due_date ASC, task_id DESC
    `);

    return NextResponse.json(
      { tasks },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('FETCH TASKS ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to fetch tasks.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}

// POST: Create a new task
export async function POST(request: NextRequest) {
  let connection;

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const {
      task_type,
      title,
      due_date,
      priority,
      status,
      student_id,
      project_id,
      category,
      estimated_hours,
      reminder_time,
      milestone_id,
      assigned_student_id,
    } = body as Record<string, unknown>;

    // Validate required fields
    if (
      typeof task_type !== 'string' ||
      !validTaskTypes.includes(
        task_type as (typeof validTaskTypes)[number]
      ) ||
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 150 ||
      !isValidDate(due_date)
    ) {
      return NextResponse.json(
        {
          error:
            'A valid task type, title (maximum 150 characters), and due date are required.',
        },
        { status: 400 }
      );
    }

    // Validate priority and status
    const normalizedPriority =
      priority == null ? 'MEDIUM' : priority;

    const normalizedStatus =
      status == null ? 'PENDING' : status;

    if (
      typeof normalizedPriority !== 'string' ||
      !validPriorities.includes(
        normalizedPriority as (typeof validPriorities)[number]
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid task priority.' },
        { status: 400 }
      );
    }

    if (
      typeof normalizedStatus !== 'string' ||
      !validStatuses.includes(
        normalizedStatus as (typeof validStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid task status.' },
        { status: 400 }
      );
    }

    // Validate task type and its required relationship
    if (task_type === 'PERSONAL') {
      if (
        !isPositiveInteger(student_id) ||
        project_id != null
      ) {
        return NextResponse.json(
          {
            error:
              'A personal task requires a valid student ID and must not have a project ID.',
          },
          { status: 400 }
        );
      }
    }

    if (task_type === 'PROJECT') {
      if (
        !isPositiveInteger(project_id) ||
        student_id != null
      ) {
        return NextResponse.json(
          {
            error:
              'A project task requires a valid project ID and must not have a personal student ID.',
          },
          { status: 400 }
        );
      }
    }

    // Validate optional IDs
    if (
      student_id != null &&
      !isPositiveInteger(student_id)
    ) {
      return NextResponse.json(
        { error: 'Invalid student ID.' },
        { status: 400 }
      );
    }

    if (
      project_id != null &&
      !isPositiveInteger(project_id)
    ) {
      return NextResponse.json(
        { error: 'Invalid project ID.' },
        { status: 400 }
      );
    }

    if (
      milestone_id != null &&
      !isPositiveInteger(milestone_id)
    ) {
      return NextResponse.json(
        { error: 'Invalid milestone ID.' },
        { status: 400 }
      );
    }

    if (
      assigned_student_id != null &&
      !isPositiveInteger(assigned_student_id)
    ) {
      return NextResponse.json(
        { error: 'Invalid assigned student ID.' },
        { status: 400 }
      );
    }

    // Validate optional category
    if (
      category != null &&
      (
        typeof category !== 'string' ||
        category.trim().length === 0 ||
        category.trim().length > 50
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid task category.' },
        { status: 400 }
      );
    }

    // Validate estimated hours: DECIMAL(4,1)
    let estimatedHours: number | null = null;

    if (estimated_hours != null) {
      if (
        typeof estimated_hours !== 'number' ||
        !Number.isFinite(estimated_hours) ||
        estimated_hours < 0 ||
        estimated_hours > 999.9 ||
        Math.round(estimated_hours * 10) !==
          estimated_hours * 10
      ) {
        return NextResponse.json(
          {
            error:
              'Estimated hours must be a number between 0 and 999.9 with at most one decimal place.',
          },
          { status: 400 }
        );
      }

      estimatedHours = estimated_hours;
    }

    // Validate optional reminder date
    if (
      reminder_time != null &&
      (
        typeof reminder_time !== 'string' ||
        Number.isNaN(Date.parse(reminder_time))
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid reminder date and time.' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Verify referenced records exist
    if (student_id != null) {
      const students = await connection.query(
        'SELECT student_id FROM student WHERE student_id = ?',
        [student_id]
      );

      if (students.length === 0) {
        return NextResponse.json(
          { error: 'The selected student does not exist.' },
          { status: 404 }
        );
      }
    }

    if (project_id != null) {
      const projects = await connection.query(
        'SELECT project_id FROM course_project WHERE project_id = ?',
        [project_id]
      );

      if (projects.length === 0) {
        return NextResponse.json(
          { error: 'The selected project does not exist.' },
          { status: 404 }
        );
      }
    }

    if (milestone_id != null) {
      const milestones = await connection.query(
        'SELECT milestone_id FROM project_milestone WHERE milestone_id = ?',
        [milestone_id]
      );

      if (milestones.length === 0) {
        return NextResponse.json(
          { error: 'The selected milestone does not exist.' },
          { status: 404 }
        );
      }
    }

    if (assigned_student_id != null) {
      const assignedStudents = await connection.query(
        'SELECT student_id FROM student WHERE student_id = ?',
        [assigned_student_id]
      );

      if (assignedStudents.length === 0) {
        return NextResponse.json(
          { error: 'The assigned student does not exist.' },
          { status: 404 }
        );
      }
    }

    // Insert task using parameterized query
    const result = await connection.query(
      `
      INSERT INTO academic_task (
        task_type,
        title,
        due_date,
        priority,
        status,
        student_id,
        project_id,
        category,
        estimated_hours,
        reminder_time,
        milestone_id,
        assigned_student_id,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        task_type,
        title.trim(),
        due_date,
        normalizedPriority,
        normalizedStatus,
        student_id ?? null,
        project_id ?? null,
        category == null ? null : category.trim(),
        estimatedHours,
        reminder_time ?? null,
        milestone_id ?? null,
        assigned_student_id ?? null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        task_id: Number(result.insertId),
        message: 'Task created successfully.',
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('CREATE TASK ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to create task.' },
      { status: 500 }
    );

  } finally {
    if (connection) connection.release();
  }
}
