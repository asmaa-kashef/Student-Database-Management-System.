
'use client';

import { use, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface Student {
  student_id: number;
  matriculation_number: string;
  major: string;
  current_semester: number;
  gpa: number;
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:border-sky-500/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
          <i className={`${icon} text-sky-400 text-lg`}></i>
        </div>

        <p className="text-sm text-slate-400">{label}</p>
      </div>

      <p className="text-xl font-semibold text-white break-words">
        {value ?? 'Not available'}
      </p>
    </div>
  );
}

function StudentDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;

    let isMounted = true;

    async function fetchStudent() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `/api/students/${encodeURIComponent(studentId)}`,
          { cache: 'no-store' }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load student details.'
          );
        }

        if (isMounted) {
          setStudent(data.student ?? data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (!studentId) {
    return (
      <main className="min-h-screen bg-[#0b1220] text-red-400 flex items-center justify-center">
        Student ID is missing.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b1220] flex items-center justify-center text-slate-200">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-sky-400"></i>
          <p className="mt-4 text-slate-400">
            Loading student details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200 flex items-center justify-center p-6`}>
        <div className="max-w-md w-full bg-[#202d40] border border-slate-700 rounded-2xl p-8 text-center">
          <i className="fa-solid fa-circle-exclamation text-4xl text-red-400 mb-4"></i>

          <h1 className="text-xl font-bold text-white mb-3">
            Student Not Found
          </h1>

          <p className="text-slate-400 mb-6">
            {error || 'No student information was found.'}
          </p>

          <Link
            href="/search/students"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-xl transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Student Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200 p-6 md:p-10`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <p className="text-sky-400 text-sm font-semibold mb-2">
              STUDENT MANAGEMENT
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Student Details
            </h1>

            <p className="text-slate-400 mt-2">
              View detailed academic information about this student.
            </p>
          </div>

          <Link
            href="/search/students"
            className="inline-flex items-center justify-center gap-2 bg-[#202d40] hover:bg-[#2b405a] border border-slate-700 px-5 py-3 rounded-xl transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Search
          </Link>
        </div>

        {/* Student Header Card */}
        <div className="bg-gradient-to-r from-[#172b46] to-[#202d40] border border-slate-700/70 rounded-2xl p-7 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-sky-500/15 flex items-center justify-center">
              <i className="fa-solid fa-user-graduate text-4xl text-sky-400"></i>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                Student #{student.student_id}
              </h2>

              <p className="text-slate-400 mt-2">
                {student.major || 'Major not specified'}
              </p>

              <span className="inline-flex items-center gap-2 mt-3 text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                <i className="fa-solid fa-circle-check"></i>
                Student Record
              </span>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-5">
            Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoCard
              icon="fa-solid fa-id-card"
              label="Student ID"
              value={student.student_id}
            />

            <InfoCard
              icon="fa-solid fa-address-card"
              label="Matriculation Number"
              value={student.matriculation_number}
            />

            <InfoCard
              icon="fa-solid fa-graduation-cap"
              label="Major"
              value={student.major}
            />

            <InfoCard
              icon="fa-solid fa-calendar-days"
              label="Current Semester"
              value={student.current_semester}
            />

            <InfoCard
              icon="fa-solid fa-chart-line"
              label="GPA"
              value={student.gpa ?? 'Not available'}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-3 mt-10">
          <Link
            href="/search/students"
            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl transition"
          >
            <i className="fa-solid fa-magnifying-glass mr-2"></i>
            Search Another Student
          </Link>

          <Link
            href="/"
            className="bg-[#202d40] hover:bg-[#2b405a] border border-slate-700 text-slate-200 px-6 py-3 rounded-xl transition"
          >
            <i className="fa-solid fa-house mr-2"></i>
            Student Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0b1220] text-slate-200 flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-sky-400"></i>
            <p className="text-sm text-slate-400 mt-4">
              Loading student details...
            </p>
          </div>
        </main>
      }
    >
      <StudentDetailContent params={params} />
    </Suspense>
  );
}
