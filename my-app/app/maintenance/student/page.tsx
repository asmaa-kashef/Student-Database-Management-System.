'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentFormPage() {
  // Academic User fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Student table fields
  const [matriculationNumber, setMatriculationNumber] = useState('');
  const [major, setMajor] = useState(
    'Computer Science & Data Engineering'
  );
  const [currentSemester, setCurrentSemester] = useState('1');
  const [gpa, setGpa] = useState('');

  // Form status
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          matriculation_number: matriculationNumber.trim(),
          major: major.trim(),
          current_semester: Number(currentSemester),
          gpa: Number(gpa),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Failed to save student record.'
        );
      }

      setSubmitted(true);

      // Reset the form after successful saving
      setFullName('');
      setEmail('');
      setMatriculationNumber('');
      setMajor('Computer Science & Data Engineering');
      setCurrentSemester('1');
      setGpa('');
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
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4 gap-4">
          <h1 className="text-xl font-bold text-white">
            Add New Student
          </h1>

          <Link
            href="/maintenance"
            className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] whitespace-nowrap"
          >
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* Success Message */}
        {submitted && (
          <div
            role="status"
            className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs"
          >
            <p className="font-bold">
              Student added successfully!
            </p>
            <p className="text-slate-400 mt-1">
              The student record was saved successfully.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs"
          >
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Student Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4"
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className={labelClass}
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Nishitha R."
              className={inputClass}
            />
          </div>

          {/* University Email */}
          <div>
            <label
              htmlFor="email"
              className={labelClass}
            >
              University Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@constructor.university"
              className={inputClass}
            />
          </div>

          {/* matriculation_number */}
          <div>
            <label
              htmlFor="matriculationNumber"
              className={labelClass}
            >
              Matriculation Number
            </label>

            <input
              id="matriculationNumber"
              type="text"
              required
              value={matriculationNumber}
              onChange={(e) =>
                setMatriculationNumber(e.target.value)
              }
              placeholder="e.g. CU2026-8841"
              className={inputClass}
            />
          </div>

          {/* major */}
          <div>
            <label
              htmlFor="major"
              className={labelClass}
            >
              Major
            </label>

            <input
              id="major"
              type="text"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Data Engineering"
              className={inputClass}
            />
          </div>

          {/* current_semester */}
          <div>
            <label
              htmlFor="currentSemester"
              className={labelClass}
            >
              Current Semester (1-12)
            </label>

            <input
              id="currentSemester"
              type="number"
              min="1"
              max="12"
              step="1"
              required
              value={currentSemester}
              onChange={(e) =>
                setCurrentSemester(e.target.value)
              }
              className={inputClass}
            />
          </div>

          {/* gpa */}
          <div>
            <label
              htmlFor="gpa"
              className={labelClass}
            >
              GPA
            </label>

            <input
              id="gpa"
              type="number"
              min="0"
              max="4"
              step="0.01"
              required
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="e.g. 3.75"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Student...' : 'Save Student Record'}
          </button>
        </form>
      </div>
    </div>
  );
}