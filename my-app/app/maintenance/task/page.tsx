
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  student_id: number;
  full_name: string;
}

export default function TaskFormPage() {
  const [taskType, setTaskType] = useState('PERSONAL');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [studentId, setStudentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students
  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      setLoadingStudents(true);

      try {
        const response = await fetch('/api/students', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'Your administrator session has expired. Please sign in again.'
          );
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load students.');
        }

        const studentList = Array.isArray(data)
          ? data
          : data.students || [];

        if (!cancelled) {
          setStudents(studentList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load students.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingStudents(false);
        }
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setSubmitted(false);
    setError('');
    setSuccessMessage('');

    const numericStudentId = Number(studentId);
    const numericProjectId = Number(projectId);
    const numericHours = Number(estimatedHours);

    // Validate task type
    if (!['PERSONAL', 'PROJECT'].includes(taskType)) {
      setError('Please select a valid task type.');
      setLoading(false);
      return;
    }

    // Validate PERSONAL task
    if (taskType === 'PERSONAL') {
      const studentExists = students.some(
        (student) => student.student_id === numericStudentId
      );

      if (
        !studentId ||
        !Number.isSafeInteger(numericStudentId) ||
        numericStudentId <= 0 ||
        !studentExists
      ) {
        setError('Please select a valid student.');
        setLoading(false);
        return;
      }
    }

    // Validate PROJECT task
    if (
      taskType === 'PROJECT' &&
      (
        !projectId ||
        !Number.isSafeInteger(numericProjectId) ||
        numericProjectId <= 0
      )
    ) {
      setError('Please enter a valid Project ID.');
      setLoading(false);
      return;
    }

    // Validate estimated hours
    if (
      estimatedHours.trim() !== '' &&
      (
        !Number.isFinite(numericHours) ||
        numericHours < 0 ||
        !Number.isInteger(numericHours * 10)
      )
    ) {
      setError('Estimated hours must be a non-negative number with at most one decimal place.');
      setLoading(false);
      return;
    }

    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      setError('Please enter a valid due date.');
      setLoading(false);
      return;
    }

    const savedTitle = title.trim();

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          task_type: taskType,
          title: savedTitle,
          due_date: dueDate,
          priority,
          status,
          student_id:
            taskType === 'PERSONAL' ? numericStudentId : null,
          project_id:
            taskType === 'PROJECT' ? numericProjectId : null,
          category: category.trim() || null,
          estimated_hours:
            estimatedHours.trim() === ''
              ? null
              : numericHours,
        }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'Your administrator session has expired. Please sign in again.'
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
          result.details ||
          'Failed to save task record.'
        );
      }

      setSuccessMessage(
        `Academic task "${savedTitle}" added successfully!`
      );

      setSubmitted(true);

      setTitle('');
      setDueDate('');
      setCategory('');
      setEstimatedHours('2');
      setStudentId('');
      setProjectId('');
      setTaskType('PERSONAL');
      setPriority('Medium');
      setStatus('Pending');

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';

  const labelClass =
    'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              Add New Academic Task
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Create a new task record with Polymorphic validation.
            </p>
          </div>

          <Link
            href="/maintenance/dashboard"
            className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div
            role="status"
            className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs"
          >
            ✓ {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs"
          >
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Task Type */}
          <div>
            <label htmlFor="taskType" className={labelClass}>
              Task Type
            </label>

            <select
              id="taskType"
              value={taskType}
              onChange={(e) => {
                setTaskType(e.target.value);
                setStudentId('');
                setProjectId('');
                setError('');
              }}
              className={inputClass}
            >
              <option value="PERSONAL">
                PERSONAL (Requires Student)
              </option>

              <option value="PROJECT">
                PROJECT (Requires Project ID)
              </option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Task Title
            </label>

            <input
              id="title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Design Milestones"
              className={inputClass}
            />
          </div>

          {/* Student */}
          {taskType === 'PERSONAL' && (
            <div>
              <label htmlFor="studentId" className={labelClass}>
                Assigned Student (Required for PERSONAL)
              </label>

              <select
                id="studentId"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={loadingStudents || students.length === 0}
                className={inputClass}
              >
                <option value="">
                  {loadingStudents
                    ? 'Loading students...'
                    : students.length === 0
                      ? 'No students available'
                      : '-- Select Student --'}
                </option>

                {students.map((student) => (
                  <option
                    key={student.student_id}
                    value={student.student_id}
                  >
                    {student.full_name} (ID: {student.student_id})
                  </option>
                ))}
              </select>

              {!loadingStudents && students.length === 0 && (
                <p className="text-xs text-amber-400 mt-2">
                  No students available. Add a student before creating a personal task.
                </p>
              )}
            </div>
          )}

          {/* Project ID */}
          {taskType === 'PROJECT' && (
            <div>
              <label htmlFor="projectId" className={labelClass}>
                Project ID (Required for PROJECT)
              </label>

              <input
                id="projectId"
                type="number"
                required
                min="1"
                step="1"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="e.g. 1"
                className={inputClass}
              />

              <p className="text-xs text-slate-500 mt-2">
                Enter an existing project ID.
              </p>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className={labelClass}>
              Due Date
            </label>

            <input
              id="dueDate"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className={labelClass}>
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClass}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>

            <input
              id="category"
              type="text"
              maxLength={100}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Development"
              className={inputClass}
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label htmlFor="estimatedHours" className={labelClass}>
              Estimated Hours
            </label>

            <input
              id="estimatedHours"
              type="number"
              step="0.1"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              (
                taskType === 'PERSONAL' &&
                (loadingStudents || students.length === 0)
              )
            }
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Task...' : 'Save Task Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
