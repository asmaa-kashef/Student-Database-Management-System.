
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Professor {
  professor_id: number;
  full_name: string;
}

export default function CourseFormPage() {
  const [courseCode, setCourseCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [credits, setCredits] = useState('5');
  const [semester, setSemester] = useState('Fall 2026');

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch professors when the page loads
  useEffect(() => {
    let cancelled = false;

    async function fetchProfessors() {
      setLoadingProfessors(true);
      setError('');

      try {
        const response = await fetch('/api/professors', {
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
          throw new Error(
            data.error || 'Failed to load professors.'
          );
        }

        if (!cancelled) {
          setProfessors(data.professors || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load professors.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProfessors(false);
        }
      }
    }

    fetchProfessors();

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

    if (!professorId) {
      setError('Please select a professor.');
      setLoading(false);
      return;
    }

    const numericCredits = Number(credits);
    const numericProfessorId = Number(professorId);

    if (
      !Number.isFinite(numericCredits) ||
      numericCredits <= 0 ||
      !Number.isSafeInteger(numericProfessorId) ||
      numericProfessorId <= 0
    ) {
      setError('Please provide valid course information.');
      setLoading(false);
      return;
    }

    const savedCourseCode = courseCode.trim();
    const savedSubjectName = subjectName.trim();

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          course_code: savedCourseCode,
          subject_name: savedSubjectName,
          professor_id: numericProfessorId,
          credits: numericCredits,
          semester: semester.trim(),
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
          result.error || 'Failed to save course record.'
        );
      }

      setSuccessMessage(
        `Course ${savedCourseCode}: ${savedSubjectName} added successfully!`
      );

      setSubmitted(true);

      setCourseCode('');
      setSubjectName('');
      setProfessorId('');
      setCredits('5');
      setSemester('Fall 2026');

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
              Add New Course Form
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Register a new academic course in AIMAP platform.
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

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className={labelClass}>
              Course Code
            </label>

            <input
              id="courseCode"
              type="text"
              required
              maxLength={30}
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. CS-101 or DATA-302"
              className={inputClass}
            />
          </div>

          {/* Subject Name */}
          <div>
            <label htmlFor="subjectName" className={labelClass}>
              Course Title / Subject Name
            </label>

            <input
              id="subjectName"
              type="text"
              required
              maxLength={150}
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Databases and Web Systems"
              className={inputClass}
            />
          </div>

          {/* Professor */}
          <div>
            <label htmlFor="professorId" className={labelClass}>
              Instructor / Professor
            </label>

            <select
              id="professorId"
              required
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              disabled={loadingProfessors || professors.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingProfessors
                  ? 'Loading professors...'
                  : professors.length === 0
                    ? 'No professors available'
                    : '-- Select Professor --'}
              </option>

              {professors.map((prof) => (
                <option
                  key={prof.professor_id}
                  value={prof.professor_id}
                >
                  {prof.full_name}
                </option>
              ))}
            </select>

            {!loadingProfessors && professors.length === 0 && (
              <p className="text-xs text-amber-400 mt-2">
                Add or check professor records before creating a course.
              </p>
            )}
          </div>

          {/* Credits */}
          <div>
            <label htmlFor="credits" className={labelClass}>
              Credits (ECTS)
            </label>

            <select
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className={inputClass}
            >
              <option value="2.5">2.5 ECTS</option>
              <option value="5">5 ECTS</option>
              <option value="7.5">7.5 ECTS</option>
              <option value="10">10 ECTS</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label htmlFor="semester" className={labelClass}>
              Semester
            </label>

            <input
              id="semester"
              type="text"
              required
              maxLength={50}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2026"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingProfessors ||
              professors.length === 0
            }
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Course...' : 'Save Course Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
