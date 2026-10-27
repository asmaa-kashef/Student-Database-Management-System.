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

  // Reference data for courses (Referential Integrity)
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses'); // تأكد من توفر مسار جلب الكورسات أو تعديله حسب مشروعك
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || data || []);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          due_date: dueDate,
          subject_id: Number(subjectId),
          submission_format: submissionFormat.trim(),
          max_file_size_mb: Number(maxFileSizeMb),
          plagiarism_check_required: plagiarismCheck,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save assignment record.');

      setSubmitted(true);
      setTitle('');
      setDescription('');
      setDueDate('');
      setSubjectId('');
      setSubmissionFormat('PDF');
      setMaxFileSizeMb('20');
      setPlagiarismCheck(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';
  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Add New Assignment Form</h1>
            <p className="text-xs text-slate-400 mt-1">Create a new academic assignment and link it to a course.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Assignment added successfully!
          </div>
        )}

        {error && (
          <div role="alert" className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl">
          
          <div>
            <label className={labelClass}>Assignment Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Homework 5: Databases" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Course / Subject (Referential Integrity)</label>
            <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={inputClass}>
              <option value="">{loadingCourses ? 'Loading courses...' : '-- Select Course --'}</option>
              {courses.map((c) => (
                <option key={c.subject_id} value={c.subject_id}>
                  {c.course_code} - {c.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Submission Format</label>
            <select value={submissionFormat} onChange={(e) => setSubmissionFormat(e.target.value)} className={inputClass}>
              <option value="PDF">PDF Document</option>
              <option value="ZIP">ZIP Archive (Source Code)</option>
              <option value="URL">GitHub Repository URL</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Max File Size (MB)</label>
            <input type="number" min="1" max="500" required value={maxFileSizeMb} onChange={(e) => setMaxFileSizeMb(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Due Date & Time</label>
            <input type="datetime-local" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="plagiarism" checked={plagiarismCheck} onChange={(e) => setPlagiarismCheck(e.target.checked)} className="w-4 h-4 rounded bg-[#161e2e] border-[#212d40]" />
            <label htmlFor="plagiarism" className="text-xs text-slate-300 select-none cursor-pointer">Require Plagiarism / Similarity Check</label>
          </div>

          <div>
            <label className={labelClass}>Description / Instructions</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter assignment details..." className={inputClass} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4">
            {loading ? 'Saving Assignment...' : 'Save Assignment Record'}
          </button>

        </form>
      </div>
    </div>
  );
}