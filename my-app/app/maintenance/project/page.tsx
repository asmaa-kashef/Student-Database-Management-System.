'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  subject_id: number;
  subject_name: string;
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

  // جلب قائمة المواد الدراسية لربط المشروع بالمادة المفتاحية
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/subjects');
        if (res.ok) {
          const data = await res.json();
          setSubjects(data.subjects || data || []);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          subject_id: subjectId ? Number(subjectId) : null,
          deadline: deadline || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.details || 'Failed to save project record.');

      setSubmitted(true);
      setTitle('');
      setDescription('');
      setSubjectId('');
      setDeadline('');
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
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Add New Course Project</h1>
            <p className="text-xs text-slate-400 mt-1">Create a new course project record in the database.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Course project added successfully!
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
          
          {/* Project Title */}
          <div>
            <label className={labelClass}>Project Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Database Systems Management App" 
              className={inputClass} 
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea 
              rows={3}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter project requirements or guidelines..." 
              className={inputClass} 
            />
          </div>

          {/* Associated Subject / Course */}
          <div>
            <label className={labelClass}>Associated Subject / Course (Required)</label>
            <select 
              required
              value={subjectId} 
              onChange={(e) => setSubjectId(e.target.value)} 
              className={inputClass}
            >
              <option value="">{loadingSubjects ? 'Loading subjects...' : '-- Select Subject --'}</option>
              {subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name} (ID: {sub.subject_id})
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className={labelClass}>Deadline Date</label>
            <input 
              type="datetime-local" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Project...' : 'Save Project Record'}
          </button>

        </form>
      </div>
    </div>
  );
}