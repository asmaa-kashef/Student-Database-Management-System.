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

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/subjects')
        ]);

        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(data.students || data || []);
        }

        if (subjectsRes.ok) {
          const data = await subjectsRes.json();
          setSubjects(data.subjects || data || []);
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
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: Number(studentId),
          subject_id: Number(subjectId),
          enrollment_date: enrollmentDate,
          final_grade: finalGrade ? Number(finalGrade) : null,
          attendance_rate: attendanceRate ? Number(attendanceRate) : null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.details || 'Failed to save enrollment record.');

      setSubmitted(true);
      setStudentId('');
      setSubjectId('');
      setEnrollmentDate('');
      setFinalGrade('');
      setAttendanceRate('');
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
            <h1 className="text-xl font-bold text-white">1. Enrollment (Student & Course)</h1>
            <p className="text-xs text-slate-400 mt-1">Enroll a student into an academic subject with record details.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-[#4ade80] hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Relationships
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Student enrollment added successfully!
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

          {/* Select Subject */}
          <div>
            <label className={labelClass}>Select Course / Subject (Required)*</label>
            <select 
              required
              value={subjectId} 
              onChange={(e) => setSubjectId(e.target.value)} 
              className={inputClass}
            >
              <option value="">{loadingData ? 'Loading subjects...' : '-- Select Subject --'}</option>
              {subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name} (ID: {sub.subject_id})
                </option>
              ))}
            </select>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className={labelClass}>Enrollment Date (Required)*</label>
            <input 
              type="date" 
              required
              value={enrollmentDate} 
              onChange={(e) => setEnrollmentDate(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* Final Grade */}
          <div>
            <label className={labelClass}>Final Grade (Optional)</label>
            <input 
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
            <label className={labelClass}>Attendance Rate (Optional)</label>
            <input 
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

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Processing Enrollment...' : 'Save Enrollment Record'}
          </button>

        </form>
      </div>
    </div>
  );
}