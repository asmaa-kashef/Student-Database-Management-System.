
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  student_id: number;
  full_name: string;
}

interface Subject {
  subject_id: number;
  subject_name: string;
}

export default function EnrollmentFormPage() {
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [finalGrade, setFinalGrade] = useState('');
  const [attendanceRate, setAttendanceRate] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load students and subjects
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoadingData(true);
      setError('');

      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          fetch('/api/students', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
          }),
          fetch('/api/subjects', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
          }),
        ]);

        if (
          studentsRes.status === 401 ||
          studentsRes.status === 403 ||
          subjectsRes.status === 401 ||
          subjectsRes.status === 403
        ) {
          throw new Error(
            'Your administrator session has expired. Please sign in again.'
          );
        }

        if (!studentsRes.ok || !subjectsRes.ok) {
          throw new Error('Failed to load students or subjects.');
        }

        const [studentsData, subjectsData] = await Promise.all([
          studentsRes.json(),
          subjectsRes.json(),
        ]);

        const studentList = Array.isArray(studentsData)
          ? studentsData
          : studentsData.students || [];

        const subjectList = Array.isArray(subjectsData)
          ? subjectsData
          : subjectsData.subjects || [];

        if (!cancelled) {
          setStudents(studentList);
          setSubjects(subjectList);
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
    const numericSubjectId = Number(subjectId);
    const numericGrade =
      finalGrade.trim() === '' ? null : Number(finalGrade);
    const numericAttendance =
      attendanceRate.trim() === '' ? null : Number(attendanceRate);

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
      !Number.isSafeInteger(numericSubjectId) ||
      numericSubjectId <= 0 ||
      !subjects.some(
        (subject) => subject.subject_id === numericSubjectId
      )
    ) {
      setError('Please select a valid subject.');
      setLoading(false);
      return;
    }

    if (!enrollmentDate || Number.isNaN(Date.parse(enrollmentDate))) {
      setError('Please enter a valid enrollment date.');
      setLoading(false);
      return;
    }

    if (
      numericGrade !== null &&
      (!Number.isFinite(numericGrade) ||
        numericGrade < 0 ||
        numericGrade > 100)
    ) {
      setError('Final grade must be between 0 and 100.');
      setLoading(false);
      return;
    }

    if (
      numericAttendance !== null &&
      (!Number.isFinite(numericAttendance) ||
        numericAttendance < 0 ||
        numericAttendance > 100)
    ) {
      setError('Attendance rate must be between 0 and 100.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          student_id: numericStudentId,
          subject_id: numericSubjectId,
          enrollment_date: enrollmentDate,
          final_grade: numericGrade,
          attendance_rate: numericAttendance,
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
          'Failed to save enrollment record.'
        );
      }

      const selectedStudent = students.find(
        (student) => student.student_id === numericStudentId
      );

      const selectedSubject = subjects.find(
        (subject) => subject.subject_id === numericSubjectId
      );

      setSuccessMessage(
        `${selectedStudent?.full_name || 'Student'} enrolled in ${selectedSubject?.subject_name || 'subject'} successfully!`
      );

      setSubmitted(true);

      setStudentId('');
      setSubjectId('');
      setEnrollmentDate('');
      setFinalGrade('');
      setAttendanceRate('');

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
    !loadingData && (students.length === 0 || subjects.length === 0);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              1. Enrollment (Student & Course)
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Enroll a student into an academic subject with record details.
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
            Students and subjects must be available before creating an enrollment.
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

          {/* Subject */}
          <div>
            <label htmlFor="subjectId" className={labelClass}>
              Select Course / Subject (Required) *
            </label>

            <select
              id="subjectId"
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={loadingData || subjects.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingData
                  ? 'Loading subjects...'
                  : subjects.length === 0
                    ? 'No subjects available'
                    : '-- Select Subject --'}
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.subject_id}
                  value={subject.subject_id}
                >
                  {subject.subject_name} (ID: {subject.subject_id})
                </option>
              ))}
            </select>
          </div>

          {/* Enrollment Date */}
          <div>
            <label htmlFor="enrollmentDate" className={labelClass}>
              Enrollment Date (Required) *
            </label>

            <input
              id="enrollmentDate"
              type="date"
              required
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Final Grade */}
          <div>
            <label htmlFor="finalGrade" className={labelClass}>
              Final Grade (Optional)
            </label>

            <input
              id="finalGrade"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={finalGrade}
              onChange={(e) => setFinalGrade(e.target.value)}
              placeholder="e.g. 95.50"
              className={inputClass}
            />
          </div>

          {/* Attendance Rate */}
          <div>
            <label htmlFor="attendanceRate" className={labelClass}>
              Attendance Rate (Optional)
            </label>

            <input
              id="attendanceRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={attendanceRate}
              onChange={(e) => setAttendanceRate(e.target.value)}
              placeholder="e.g. 98.00"
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingData ||
              students.length === 0 ||
              subjects.length === 0
            }
            className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Processing Enrollment...' : 'Save Enrollment Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
