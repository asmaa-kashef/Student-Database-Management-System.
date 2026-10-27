'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentSearchPage() {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch search results.');
      }
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';
  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* رأس الصفحة وزر العودة */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Student Search</h1>
            <p className="text-xs text-slate-400 mt-1">Search students by ID, Matriculation Number, or Major.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* نموذج البحث */}
        <form onSubmit={handleSearch} className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl">
          <div>
            <label className={labelClass}>Search Query</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter ID, Matriculation Number, or Major..."
                className={inputClass}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* رسالة التحميل */}
        {loading && <p className="text-xs text-slate-400">Searching students...</p>}

        {/* رسالة الخطأ */}
        {error && (
          <div role="alert" className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* قائمة النتائج أو رسالة عدم وجود نتائج */}
        {!loading && searched && !error && (
          <div>
            {students.length === 0 ? (
              <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-amber-300 text-xs">
                ⚠️ No students found matching your search.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Found {students.length} student(s):</p>
                {students.map((student) => (
                  <div
                    key={student.student_id}
                    className="bg-[#111723] border border-[#212d40] rounded-xl p-4 flex justify-between items-center shadow-md"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-sky-400">
                        Student ID: {student.student_id}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Matriculation: <span className="text-white">{student.matriculation_number}</span> | Major: <span className="text-white">{student.major}</span>
                      </p>
                    </div>
                    <Link
                      href={`/search/students/${student.student_id}`}
                      className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] hover:bg-[#1e293b] text-sky-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}