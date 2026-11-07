
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  subject_id: number;
  subject_name: string;
  course_code?: string;
}

export default function ProjectFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [deadline, setDeadline] = useState('');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch subjects
  useEffect(() => {
    let cancelled = false;

    async function fetchSubjects() {
      setLoadingSubjects(true);

      try {
        const response = await fetch('/api/subjects', {
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
          throw new Error(data.error || 'Failed to load subjects.');
        }

        const subjectList = Array.isArray(data)
          ? data
          : data.subjects || [];

        if (!cancelled) {
          setSubjects(subjectList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load subjects.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSubjects(false);
        }
      }
    }

    fetchSubjects();

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

    const numericSubjectId = Number(subjectId);

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

    if (deadline && Number.isNaN(Date.parse(deadline))) {
      setError('Please enter a valid project deadline.');
      setLoading(false);
      return;
    }

    const savedTitle = title.trim();

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: savedTitle,
          description: description.trim() || null,
          subject_id: numericSubjectId,
          deadline: deadline || null,
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
          'Failed to save project record.'
        );
      }

      setSuccessMessage(
        `Course project "${savedTitle}" added successfully!`
      );

      setSubmitted(true);

      setTitle('');
      setDescription('');
      setSubjectId('');
      setDeadline('');

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
              Add New Course Project
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Create a new course project record in the database.
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

        {/* Project Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Project Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Project Title
            </label>

            <input
              id="title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Systems Management App"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>

            <textarea
              id="description"
              rows={3}
              maxLength={5000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project requirements or guidelines..."
              className={inputClass}
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subjectId" className={labelClass}>
              Associated Subject / Course (Required)
            </label>

            <select
              id="subjectId"
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={loadingSubjects || subjects.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingSubjects
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
                  {subject.course_code
                    ? `${subject.course_code} - ${subject.subject_name}`
                    : `${subject.subject_name} (ID: ${subject.subject_id})`}
                </option>
              ))}
            </select>

            {!loadingSubjects && subjects.length === 0 && (
              <p className="text-xs text-amber-400 mt-2">
                Add a subject before creating a project.
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className={labelClass}>
              Deadline Date
            </label>

            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingSubjects ||
              subjects.length === 0
            }
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Project...' : 'Save Project Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
