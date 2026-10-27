'use client';

import { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';

function StudentDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) {
          throw new Error('Student not found.');
        }
        const data = await res.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message || 'Error loading details.');
      } finally {
        setLoading(false);
      }
    }

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans flex items-center justify-center">
        <p className="text-xs text-slate-400">Loading student details...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
        <div className="max-w-xl mx-auto space-y-4">
          <div role="alert" className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error || 'Student not found.'}</p>
          </div>
          <Link
            href="/search/students"
            className="inline-block px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors"
          >
            &larr; Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* رأس الصفحة وزر العودة */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Student Details</h1>
            <p className="text-xs text-slate-400 mt-1">Complete profile and academic status.</p>
          </div>
          <Link
            href="/search/students"
            className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap"
          >
            &larr; Back to Search
          </Link>
        </div>

        {/* صندوق تفاصيل الطالب */}
        <div className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-sky-400 border-b border-[#212d40] pb-3">
            Student ID: {student.student_id}
          </h2>

          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="bg-[#161e2e] p-3 rounded-lg border border-[#212d40] flex justify-between items-center">
              <span className="text-slate-400">Matriculation Number:</span>
              <span className="text-white font-semibold">{student.matriculation_number}</span>
            </div>

            <div className="bg-[#161e2e] p-3 rounded-lg border border-[#212d40] flex justify-between items-center">
              <span className="text-slate-400">Major:</span>
              <span className="text-white font-semibold">{student.major}</span>
            </div>

            <div className="bg-[#161e2e] p-3 rounded-lg border border-[#212d40] flex justify-between items-center">
              <span className="text-slate-400">Current Semester:</span>
              <span className="text-white font-semibold">{student.current_semester}</span>
            </div>

            <div className="bg-[#161e2e] p-3 rounded-lg border border-[#212d40] flex justify-between items-center">
              <span className="text-slate-400">GPA:</span>
              <span className="text-emerald-400 font-semibold">{student.gpa}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function StudentDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans flex items-center justify-center">
        <p className="text-xs text-slate-400">Loading page...</p>
      </div>
    }>
      <StudentDetailContent params={props.params} />
    </Suspense>
  );
}