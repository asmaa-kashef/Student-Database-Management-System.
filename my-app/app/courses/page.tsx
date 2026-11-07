
'use client';

import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const cardStyle =
  'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-[#2b405a] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-sky-500/40';

const courses = [
  {
    code: 'MDE-CO-02',
    name: 'Data Analytics',
    professor: 'Dr. Mariia Snigireva',
    description: 'Learn data analysis techniques, statistical methods, and data visualization.',
    progress: 75,
    icon: 'fa-chart-line',
  },
  {
    code: 'MDE-CO-08',
    name: 'Python Programming',
    professor: 'Prof. Li Huang',
    description: 'Develop programming skills using Python and solve practical problems.',
    progress: 85,
    icon: 'fa-code',
  },
  {
    code: 'MDE-CO-07',
    name: 'Databases',
    professor: 'Prof. Peter Baumann',
    description: 'Study database design, SQL queries, and database management systems.',
    progress: 60,
    icon: 'fa-database',
  },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
      <div
        className="bg-sky-400 h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200`}>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#111b2e] border-r border-slate-800 p-5">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AIMAP</h1>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </div>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2 flex-1">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-chart-pie w-5 text-center"></i>
              Overview
            </Link>

            <Link href="/#profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-user w-5 text-center"></i>
              My Profile
            </Link>

            <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-sky-500/15 text-sky-400 border border-sky-500/20">
              <i className="fa-solid fa-book w-5 text-center"></i>
              My Courses
            </Link>

            <Link href="/#assignments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-file-lines w-5 text-center"></i>
              Assignments
            </Link>

            <Link href="/#tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-list-check w-5 text-center"></i>
              My Tasks
            </Link>

            <Link href="/#schedule" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-calendar-days w-5 text-center"></i>
              Class Schedule
            </Link>

            <Link href="/#projects" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-diagram-project w-5 text-center"></i>
              Projects
            </Link>

            <Link href="/#progress" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-chart-line w-5 text-center"></i>
              Academic Progress
            </Link>

            <Link href="/search/students" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-[#202d40] hover:text-white transition">
              <i className="fa-solid fa-magnifying-glass w-5 text-center"></i>
              Student Search
            </Link>
          </nav>

          <div className="border-t border-slate-700 pt-5 mt-5 space-y-3">
            <Link href="/imprint" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition">
              <i className="fa-solid fa-scale-balanced w-5"></i>
              Imprint & Disclaimer
            </Link>

            <Link href="/maintenance" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition">
              <i className="fa-solid fa-user-shield w-5"></i>
              Administrator Login
            </Link>

            <Link href="/login" className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition">
              <i className="fa-solid fa-right-from-bracket w-5"></i>
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-slate-400">
                Student Portal / My Courses
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                My Courses
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                View your enrolled courses and academic information.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#202d40] border border-slate-700 hover:bg-[#2b405a] px-5 py-3 rounded-xl text-sm transition"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Dashboard
            </Link>
          </header>

          {/* Summary */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              {
                label: 'Enrolled Courses',
                value: '03',
                icon: 'fa-book-open',
                color: 'text-sky-400',
                bg: 'bg-sky-400/10',
              },
              {
                label: 'Average Progress',
                value: '73%',
                icon: 'fa-chart-line',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
              },
              {
                label: 'Current Semester',
                value: '03',
                icon: 'fa-calendar-days',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
              },
            ].map((item) => (
              <div key={item.label} className={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-3">
                      {item.value}
                    </h3>
                  </div>

                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${item.icon} ${item.color} text-xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Course List */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Enrolled Courses
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Your current academic courses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div key={course.code} className={cardStyle}>

                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-sky-400/10 flex items-center justify-center">
                      <i className={`fa-solid ${course.icon} text-sky-400 text-2xl`}></i>
                    </div>

                    <span className="text-xs text-sky-400 bg-sky-400/10 px-3 py-2 rounded-full">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {course.name}
                  </h3>

                  <p className="text-sm text-slate-400 leading-6 min-h-[72px]">
                    {course.description}
                  </p>

                  <div className="border-t border-slate-700 my-5"></div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <i className="fa-solid fa-user-tie text-slate-300"></i>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Course Professor</p>
                      <p className="text-sm text-slate-200 font-medium">
                        {course.professor}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Course Progress</span>
                    <span className="text-sky-400 font-semibold">
                      {course.progress}%
                    </span>
                  </div>

                  <ProgressBar value={course.progress} />

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-xl text-sm font-medium transition"
                    >
                      <i className="fa-solid fa-arrow-right mr-2"></i>
                      View Course
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800 pt-6 mt-12 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 AIMAP - Student Database Management System</p>

            <div className="flex gap-5">
              <Link href="/imprint" className="hover:text-sky-400 transition">
                Imprint & Disclaimer
              </Link>
              <Link href="/maintenance" className="hover:text-sky-400 transition">
                Administrator Portal
              </Link>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
