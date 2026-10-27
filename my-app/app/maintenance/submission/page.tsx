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

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, assignmentsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/assignment2')
        ]);

        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(data.students || data || []);
        }

        if (assignmentsRes.ok) {
          const data = await assignmentsRes.json();
          setAssignments(data.assignments || data || []);
        }
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: Number(studentId),
          assignment_id: Number(assignmentId),
          submission_date: submissionDate,
          grade: grade ? Number(grade) : null,
          status: status.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.details || 'Failed to save submission record.');

      setSubmitted(true);
      setStudentId('');
      setAssignmentId('');
      setSubmissionDate('');
      setGrade('');
      setStatus('Submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4ade80]';
  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">2. Submission (Student & Assignment)</h1>
            <p className="text-xs text-slate-400 mt-1">Record student assignment submissions and grades.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-[#4ade80] hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Relationships
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Assignment submission added successfully!
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
          
          {/* Select Student */}
          <div>
            <label className={labelClass}>Select Student (Required)*</label>
            <select 
              required
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              className={inputClass}
            >
              <option value="">{loadingData ? 'Loading students...' : '-- Select Student --'}</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.full_name} (ID: {s.student_id})
                </option>
              ))}
            </select>
          </div>

          {/* Select Assignment */}
          <div>
            <label className={labelClass}>Select Assignment (Required)*</label>
            <select 
              required
              value={assignmentId} 
              onChange={(e) => setAssignmentId(e.target.value)} 
              className={inputClass}
            >
              <option value="">{loadingData ? 'Loading assignments...' : '-- Select Assignment --'}</option>
              {assignments.map((a) => (
                <option key={a.assignment_id} value={a.assignment_id}>
                  Assignment ID: {a.assignment_id} — ({a.submission_format})
                </option>
              ))}
            </select>
          </div>

          {/* Submission Date */}
          <div>
            <label className={labelClass}>Submission Date & Time (Required)*</label>
            <input 
              type="datetime-local" 
              required
              value={submissionDate} 
              onChange={(e) => setSubmissionDate(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* Grade */}
          <div>
            <label className={labelClass}>Grade (Optional)</label>
            <input 
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
            <label className={labelClass}>Submission Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              <option value="Submitted">Submitted</option>
              <option value="Graded">Graded</option>
              <option value="Late">Late</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Processing Submission...' : 'Save Submission Record'}
          </button>

        </form>
      </div>
    </div>
  );
}