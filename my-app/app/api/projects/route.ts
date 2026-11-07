
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();

    const {
      title,
      description,
      subject_id,
      deadline,
      max_points,
      weight_percentage,
      max_team_size,
      repository_url,
      milestone_count,
      is_group_project,
    } = body;

    // 1. Validate required fields
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 150 ||
      subject_id == null ||
      !deadline ||
      max_points == null ||
      weight_percentage == null ||
      max_team_size == null ||
      milestone_count == null
    ) {
      return NextResponse.json(
        { error: 'Please provide all required project fields.' },
        { status: 400 }
      );
    }

    // 2. Validate numeric fields
    const subjectId = Number(subject_id);
    const maxPoints = Number(max_points);
    const weight = Number(weight_percentage);
    const teamSize = Number(max_team_size);
    const milestones = Number(milestone_count);

    if (
      !Number.isSafeInteger(subjectId) ||
      subjectId <= 0 ||
      !Number.isFinite(maxPoints) ||
      maxPoints <= 0 ||
      maxPoints > 999.99 ||
      !Number.isFinite(weight) ||
      weight < 0 ||
      weight > 100 ||
      !Number.isInteger(teamSize) ||
      teamSize < 1 ||
      !Number.isInteger(milestones) ||
      milestones < 0
    ) {
      return NextResponse.json(
        { error: 'One or more numeric fields are invalid.' },
        { status: 400 }
      );
    }

    // 3. Validate deadline (YYYY-MM-DD or valid datetime)
    if (
      typeof deadline !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(deadline)
    ) {
      return NextResponse.json(
        { error: 'Deadline must be a valid date or datetime.' },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: 'Deadline is invalid.' },
        { status: 400 }
      );
    }

    // 4. Validate optional fields
    if (
      description != null &&
      typeof description !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Description must be text.' },
        { status: 400 }
      );
    }

    if (
      repository_url != null &&
      (
        typeof repository_url !== 'string' ||
        repository_url.length > 255
      )
    ) {
      return NextResponse.json(
        { error: 'Repository URL is invalid.' },
        { status: 400 }
      );
    }

    if (
      is_group_project != null &&
      typeof is_group_project !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'Group project must be true or false.' },
        { status: 400 }
      );
    }

    // 5. Connect to MariaDB
    connection = await getConnection();

    // 6. Start transaction
    await connection.beginTransaction();

    // 7. Verify that the subject exists
    const subjects = await connection.query(
      'SELECT subject_id FROM subject WHERE subject_id = ?',
      [subjectId]
    );

    if (subjects.length === 0) {
      await connection.rollback();

      return NextResponse.json(
        { error: 'The selected subject does not exist.' },
        { status: 404 }
      );
    }

    // 8. Insert academic activity
    const activityResult = await connection.query(
      `INSERT INTO academic_activity
       (
         subject_id,
         title,
         description,
         activity_type,
         due_date,
         max_points,
         weight_percentage,
         created_at
       )
       VALUES (?, ?, ?, 'PROJECT', ?, ?, ?, NOW())`,
      [
        subjectId,
        title.trim(),
        description?.trim() || null,
        deadline.replace('T', ' ').length === 10
          ? `${deadline.replace('T', ' ')} 23:59:00`
          : deadline.replace('T', ' '),
        maxPoints,
        weight,
      ]
    );

    const projectId = Number(activityResult.insertId);

    // 9. Insert project details using the activity ID
    await connection.query(
      `INSERT INTO course_project
       (
         project_id,
         max_team_size,
         repository_url,
         milestone_count,
         is_group_project
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        projectId,
        teamSize,
        repository_url?.trim() || null,
        milestones,
        is_group_project ?? null,
      ]
    );

    // 10. Commit transaction
    await connection.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully.',
        project_id: projectId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('PROJECT ROLLBACK ERROR:', rollbackError);
      }
    }

    console.error('CREATE PROJECT ERROR:', error);

    return NextResponse.json(
      { error: 'Unable to create project. Please try again.' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
