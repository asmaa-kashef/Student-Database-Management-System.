
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  student_id: number;
  full_name: string;
}

interface Assignment {
  assignment_id: number;
  submission_format: string;
  max_file_size_mb: number;
}

const ALLOWED_STATUSES = [
  'Submitted',
  'Graded',
  'Late',
  'Returned',
];

export default function SubmissionFormPage() {
  const [studentId, setStudentId] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('Submitted');

  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load students and assignments
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoadingData(true);
      setError('');

      try {
        const [studentsRes, assignmentsRes] = await Promise.all([
          fetch('/api/students', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
          }),
          fetch('/api/assignments', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
          }),
        ]);

        if (
          studentsRes.status === 401 ||
          studentsRes.status === 403 ||
          assignmentsRes.status === 401 ||
          assignmentsRes.status === 403
        ) {
          throw new Error(
            'Your administrator session has expired. Please sign in again.'
          );
        }

        if (!studentsRes.ok || !assignmentsRes.ok) {
          throw new Error(
            'Failed to load students or assignments.'
          );
        }

        const [studentsData, assignmentsData] = await Promise.all([
          studentsRes.json(),
          assignmentsRes.json(),
        ]);

        const studentList = Array.isArray(studentsData)
          ? studentsData
          : studentsData.students || [];

        const assignmentList = Array.isArray(assignmentsData)
          ? assignmentsData
          : assignmentsData.assignments || [];

        if (!cancelled) {
          setStudents(studentList);
          setAssignments(assignmentList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load dropdown data.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    }

    fetchData();

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
    const numericAssignmentId = Number(assignmentId);
    const numericGrade =
      grade.trim() === '' ? null : Number(grade);

    if (
      !Number.isSafeInteger(numericStudentId) ||
      numericStudentId <= 0 ||
      !students.some(
        (student) => student.student_id === numericStudentId
      )
    ) {
      setError('Please select a valid student.');
      setLoading(false);
      return;
    }

    if (
      !Number.isSafeInteger(numericAssignmentId) ||
      numericAssignmentId <= 0 ||
      !assignments.some(
        (assignment) =>
          assignment.assignment_id === numericAssignmentId
      )
    ) {
      setError('Please select a valid assignment.');
      setLoading(false);
      return;
    }

    if (
      !submissionDate ||
      Number.isNaN(Date.parse(submissionDate))
    ) {
      setError('Please enter a valid submission date and time.');
      setLoading(false);
      return;
    }

    if (
      numericGrade !== null &&
      (!Number.isFinite(numericGrade) ||
        numericGrade < 0 ||
        numericGrade > 100)
    ) {
      setError('Grade must be between 0 and 100.');
      setLoading(false);
      return;
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      setError('Please select a valid submission status.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          student_id: numericStudentId,
          assignment_id: numericAssignmentId,
          submission_date: submissionDate,
          grade: numericGrade,
          status,
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
          'Failed to save submission record.'
        );
      }

      const selectedStudent = students.find(
        (student) => student.student_id === numericStudentId
      );

      const selectedAssignment = assignments.find(
        (assignment) =>
          assignment.assignment_id === numericAssignmentId
      );

      setSuccessMessage(
        `Submission for ${selectedStudent?.full_name || 'student'} (Assignment #${selectedAssignment?.assignment_id}) saved successfully!`
      );

      setSubmitted(true);

      setStudentId('');
      setAssignmentId('');
      setSubmissionDate('');
      setGrade('');
      setStatus('Submitted');

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
    'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4ade80]';

  const labelClass =
    'block text-xs font-semibold text-slate-300 mb-1';

  const noOptions =
    !loadingData &&
    (students.length === 0 || assignments.length === 0);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              2. Submission (Student & Assignment)
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Record student assignment submissions and grades.
            </p>
          </div>

          <Link
            href="/maintenance/dashboard"
            className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-[#4ade80] hover:bg-[#1e293b] transition-colors whitespace-nowrap"
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

        {/* Missing Data Warning */}
        {noOptions && !error && (
          <div
            role="alert"
            className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-amber-300 text-xs"
          >
            Students and assignments must be available before recording a submission.
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Student */}
          <div>
            <label htmlFor="studentId" className={labelClass}>
              Select Student (Required) *
            </label>

            <select
              id="studentId"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={loadingData || students.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingData
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
          </div>

          {/* Assignment */}
          <div>
            <label htmlFor="assignmentId" className={labelClass}>
              Select Assignment (Required) *
            </label>

            <select
              id="assignmentId"
              required
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              disabled={loadingData || assignments.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingData
                  ? 'Loading assignments...'
                  : assignments.length === 0
                    ? 'No assignments available'
                    : '-- Select Assignment --'}
              </option>

              {assignments.map((assignment) => (
                <option
                  key={assignment.assignment_id}
                  value={assignment.assignment_id}
                >
                  Assignment ID: {assignment.assignment_id} — (
                  {assignment.submission_format})
                </option>
              ))}
            </select>
          </div>

          {/* Submission Date */}
          <div>
            <label htmlFor="submissionDate" className={labelClass}>
              Submission Date & Time (Required) *
            </label>

            <input
              id="submissionDate"
              type="datetime-local"
              required
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className={labelClass}>
              Grade (Optional)
            </label>

            <input
              id="grade"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 88.50"
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>
              Submission Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {ALLOWED_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingData ||
              students.length === 0 ||
              assignments.length === 0
            }
            className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading
              ? 'Processing Submission...'
              : 'Save Submission Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
