
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Course {
  subject_id: number;
  subject_name: string;
  course_code: string;
}

export default function AssignmentFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [submissionFormat, setSubmissionFormat] = useState('PDF');
  const [maxFileSizeMb, setMaxFileSizeMb] = useState('20');
  const [plagiarismCheck, setPlagiarismCheck] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load courses
  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      setLoadingCourses(true);

      try {
        const response = await fetch('/api/courses', {
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
          throw new Error(data.error || 'Failed to load courses.');
        }

        const courseList = Array.isArray(data)
          ? data
          : data.courses || [];

        if (!cancelled) {
          setCourses(courseList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load courses.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCourses(false);
        }
      }
    }

    fetchCourses();

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
    const numericFileSize = Number(maxFileSizeMb);

    if (
      !Number.isSafeInteger(numericSubjectId) ||
      numericSubjectId <= 0 ||
      !courses.some(
        (course) => course.subject_id === numericSubjectId
      )
    ) {
      setError('Please select a valid course.');
      setLoading(false);
      return;
    }

    if (
      !Number.isInteger(numericFileSize) ||
      numericFileSize < 1 ||
      numericFileSize > 500
    ) {
      setError('Maximum file size must be between 1 and 500 MB.');
      setLoading(false);
      return;
    }

    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      setError('Please enter a valid due date and time.');
      setLoading(false);
      return;
    }

    const savedTitle = title.trim();

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: savedTitle,
          description: description.trim(),
          due_date: dueDate,
          subject_id: numericSubjectId,
          submission_format: submissionFormat,
          max_file_size_mb: numericFileSize,
          plagiarism_check_required: plagiarismCheck,
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
          result.error || 'Failed to save assignment record.'
        );
      }

      setSuccessMessage(
        `Assignment "${savedTitle}" added successfully!`
      );

      setSubmitted(true);

      setTitle('');
      setDescription('');
      setDueDate('');
      setSubjectId('');
      setSubmissionFormat('PDF');
      setMaxFileSizeMb('20');
      setPlagiarismCheck(false);

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
              Add New Assignment Form
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Create a new academic assignment and link it to a course.
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

        {/* Assignment Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Assignment Title
            </label>

            <input
              id="title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Homework 5: Databases"
              className={inputClass}
            />
          </div>

          {/* Course */}
          <div>
            <label htmlFor="subjectId" className={labelClass}>
              Course / Subject (Referential Integrity)
            </label>

            <select
              id="subjectId"
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={loadingCourses || courses.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingCourses
                  ? 'Loading courses...'
                  : courses.length === 0
                    ? 'No courses available'
                    : '-- Select Course --'}
              </option>

              {courses.map((course) => (
                <option
                  key={course.subject_id}
                  value={course.subject_id}
                >
                  {course.course_code} - {course.subject_name}
                </option>
              ))}
            </select>

            {!loadingCourses && courses.length === 0 && (
              <p className="text-xs text-amber-400 mt-2">
                No courses found. Add a course before creating an assignment.
              </p>
            )}
          </div>

          {/* Submission Format */}
          <div>
            <label htmlFor="submissionFormat" className={labelClass}>
              Submission Format
            </label>

            <select
              id="submissionFormat"
              value={submissionFormat}
              onChange={(e) => setSubmissionFormat(e.target.value)}
              className={inputClass}
            >
              <option value="PDF">PDF Document</option>
              <option value="ZIP">ZIP Archive (Source Code)</option>
              <option value="URL">GitHub Repository URL</option>
            </select>
          </div>

          {/* Max File Size */}
          <div>
            <label htmlFor="maxFileSizeMb" className={labelClass}>
              Max File Size (MB)
            </label>

            <input
              id="maxFileSizeMb"
              type="number"
              min="1"
              max="500"
              step="1"
              required
              value={maxFileSizeMb}
              onChange={(e) => setMaxFileSizeMb(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className={labelClass}>
              Due Date & Time
            </label>

            <input
              id="dueDate"
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Plagiarism Check */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="plagiarism"
              checked={plagiarismCheck}
              onChange={(e) => setPlagiarismCheck(e.target.checked)}
              className="w-4 h-4 rounded bg-[#161e2e] border-[#212d40]"
            />

            <label
              htmlFor="plagiarism"
              className="text-xs text-slate-300 select-none cursor-pointer"
            >
              Require Plagiarism / Similarity Check
            </label>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description / Instructions
            </label>

            <textarea
              id="description"
              rows={3}
              maxLength={5000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment details..."
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingCourses ||
              courses.length === 0
            }
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading
              ? 'Saving Assignment...'
              : 'Save Assignment Record'}
          </button>

        </form>
      </div>
    </div>
  );
}
