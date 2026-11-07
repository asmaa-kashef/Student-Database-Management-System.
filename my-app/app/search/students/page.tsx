
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type Student = {
  student_id: number;
  matriculation_number: string;
  major: string;
};

export default function StudentSearchPage() {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a Student ID, Matriculation Number, or Major.');
      setStudents([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(
        `/api/students/search?q=${encodeURIComponent(query.trim())}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch search results.');
      }

      const data = await res.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while searching.'
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle =
    'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:border-sky-500/40';

  return (
    <main className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200 p-5 md:p-8`}>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-9">

          <div>
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-sky-400 transition"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-white mt-4">
              Student Search
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Find students by Student ID, Matriculation Number, or Major.
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass text-sky-400 text-xl"></i>
          </div>

        </header>

        {/* Search Form */}
        <section className={`${cardStyle} mb-8`}>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Search Students
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter the information you want to search for.
            </p>
          </div>

          <form onSubmit={handleSearch}>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Search Query
            </label>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Student ID, Matriculation Number, or Major..."
                  className="w-full bg-[#111b2e] border border-slate-600 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
              >
                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                {loading ? 'Searching...' : 'Search'}
              </button>

            </div>

          </form>
        </section>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-sky-400"></i>
            <p className="text-sm text-slate-400 mt-4">
              Searching students...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="bg-red-950/40 border border-red-500/30 p-5 rounded-xl text-red-300 text-sm mb-6"
          >
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && searched && !error && (

          <section>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Search Results
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {students.length} student(s) found
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 text-xs">
                Results
              </span>
            </div>

            {students.length === 0 ? (

              <div className={`${cardStyle} text-center py-12`}>
                <i className="fa-solid fa-user-slash text-4xl text-slate-500"></i>

                <h3 className="text-lg font-semibold text-white mt-5">
                  No Students Found
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  Try another Student ID, Matriculation Number, or Major.
                </p>
              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {students.map((student) => (

                  <div
                    key={student.student_id}
                    className={cardStyle}
                  >

                    <div className="flex items-center gap-4 mb-5">

                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                        <i className="fa-solid fa-user-graduate text-sky-400 text-xl"></i>
                      </div>

                      <div>
                        <h3 className="text-white font-semibold">
                          Student #{student.student_id}
                        </h3>

                        <p className="text-xs text-emerald-400 mt-1">
                          <i className="fa-solid fa-circle-check mr-1"></i>
                          Student Record
                        </p>
                      </div>

                    </div>

                    <div className="space-y-3 border-t border-slate-700 pt-4">

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Student ID
                        </span>
                        <span className="text-white font-medium">
                          {student.student_id}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Matriculation
                        </span>
                        <span className="text-white font-medium">
                          {student.matriculation_number}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Major
                        </span>
                        <span className="text-white font-medium text-right">
                          {student.major}
                        </span>
                      </div>

                    </div>

                    <Link
                      href={`/search/students/${student.student_id}`}
                      className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-all duration-300 text-sm font-medium"
                    >
                      View Details
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

        {/* Initial State */}
        {!searched && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#202d40] flex items-center justify-center">
              <i className="fa-solid fa-users text-2xl text-sky-400"></i>
            </div>

            <h3 className="text-lg font-semibold text-white mt-5">
              Find a Student
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Search using a Student ID, Matriculation Number, or Major.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-800 pt-6 mt-12 text-center text-xs text-slate-500">
          © 2026 AIMAP · Academic Information Management System
        </footer>

      </div>
    </main>
  );
}
