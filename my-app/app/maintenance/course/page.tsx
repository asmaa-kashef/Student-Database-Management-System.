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

  // Reference data for professors (Referential Integrity requirement)
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  // Status management
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Fetch professors on component mount for selection list
  useEffect(() => {
    async function fetchProfessors() {
      try {
        const res = await fetch('/api/professors');
        if (res.ok) {
          const data = await res.json();
          setProfessors(data.professors || []);
        }
      } catch (err) {
        console.error('Failed to load professors:', err);
      } finally {
        setLoadingProfessors(false);
      }
    }
    fetchProfessors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_code: courseCode.trim(),
          subject_name: subjectName.trim(),
          professor_id: Number(professorId),
          credits: Number(credits),
          semester: semester.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save course record.');
      }

      setSubmitted(true);

      // Reset form fields after successful save
      setCourseCode('');
      setSubjectName('');
      setProfessorId('');
      setCredits('5');
      setSemester('Fall 2026');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';

  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Add New Course Form</h1>
            <p className="text-xs text-slate-400 mt-1">Register a new academic course in AIMAP platform.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Course <span className="font-bold text-white">{courseCode}: {subjectName}</span> added successfully!
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div role="alert" className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl">
          
          {/* Course Code */}
          <div>
            <label className={labelClass}>Course Code</label>
            <input 
              type="text" 
              required
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. CS-101 or DATA-302"
              className={inputClass}
            />
          </div>

          {/* Subject Name */}
          <div>
            <label className={labelClass}>Course Title / Subject Name</label>
            <input 
              type="text" 
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Databases and Web Systems"
              className={inputClass}
            />
          </div>

          {/* Instructor / Professor (Referential Integrity Dropdown) */}
          <div>
            <label className={labelClass}>Instructor / Professor</label>
            <select 
              required
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              className={inputClass}
            >
              <option value="">
                {loadingProfessors ? 'Loading professors...' : '-- Select Professor --'}
              </option>
              {professors.map((prof) => (
                <option key={prof.professor_id} value={prof.professor_id}>
                  {prof.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Credits */}
          <div>
            <label className={labelClass}>Credits (ECTS)</label>
            <select 
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
            <label className={labelClass}>Semester</label>
            <input 
              type="text" 
              required
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2026"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Course...' : 'Save Course Record'}
          </button>

        </form>

      </div>
    </div>
  );
}