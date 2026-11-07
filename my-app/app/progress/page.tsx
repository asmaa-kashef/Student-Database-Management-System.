'use client';

import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

const navigation = [
  { label: 'Dashboard', href: '/', icon: 'fa-solid fa-house' },
  { label: 'My Profile', href: '/profile', icon: 'fa-solid fa-user' },
  { label: 'My Courses', href: '/courses', icon: 'fa-solid fa-book-open' },
  { label: 'Assignments', href: '/assignments', icon: 'fa-solid fa-file-lines' },
  { label: 'My Tasks', href: '/tasks', icon: 'fa-solid fa-list-check' },
  { label: 'Schedule', href: '/schedule', icon: 'fa-solid fa-calendar-days' },
  { label: 'Projects', href: '/projects', icon: 'fa-solid fa-diagram-project' },
  { label: 'Academic Progress', href: '/progress', icon: 'fa-solid fa-chart-line' },
  { label: 'Student Search', href: '/search/students', icon: 'fa-solid fa-users' },
];

const courses = [
  {
    name: 'Data Analytics',
    code: 'MDE-CO-02',
    professor: 'Dr. Mariia Snigireva',
    grade: 'A-',
    score: 88,
    progress: 88,
    status: 'On Track',
  },
  {
    name: 'Python Programming',
    code: 'MDE-CO-08',
    professor: 'Prof. Li Huang',
    grade: 'B+',
    score: 85,
    progress: 85,
    status: 'On Track',
  },
  {
    name: 'Databases',
    code: 'MDE-CO-07',
    professor: 'Prof. Peter Baumann',
    grade: 'B',
    score: 78,
    progress: 78,
    status: 'In Progress',
  },
];

const activities = [
  {
    title: 'Python Functions Assignment',
    course: 'Python Programming',
    date: 'Oct 28, 2026',
    score: '92 / 100',
    icon: 'fa-solid fa-code',
  },
  {
    title: 'Database Design Exercise',
    course: 'Databases',
    date: 'Oct 25, 2026',
    score: '85 / 100',
    icon: 'fa-solid fa-database',
  },
  {
    title: 'Data Visualization Quiz',
    course: 'Data Analytics',
    date: 'Oct 20, 2026',
    score: '88 / 100',
    icon: 'fa-solid fa-chart-column',
  },
];

export default function ProgressPage() {
  const overallProgress = Math.round(
    courses.reduce((total, course) => total + course.progress, 0) /
      courses.length
  );

  return (
    <div className={`${jakarta.className} min-h-screen bg-[#0b1220] text-slate-200`}>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#111b2e] border-r border-slate-800 p-5 sticky top-0 h-screen self-start overflow-y-auto">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-white text-lg"></i>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Student Portal</h1>
              <p className="text-xs text-slate-400">Academic Management</p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-3 mb-3">
            Main Menu
          </p>

          <nav className="space-y-1 flex-1">
            {navigation.map((item) => {
              const active = item.href === '/progress';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-[#202d40]'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center`}></i>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 pt-5 mt-5">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sky-400 text-sm font-semibold mb-2">
                  ACADEMIC PERFORMANCE
                </p>
                <h2 className="text-3xl font-bold text-white">
                  Academic Progress
                </h2>
                <p className="text-slate-400 mt-2">
                  Track your grades, course performance, and academic achievements.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#202d40] border border-slate-700/70 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center">
                  <i className="fa-solid fa-user text-sky-400"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Student A.</p>
                  <p className="text-xs text-slate-400">Student ID: 2014</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Current GPA</p>
                    <h3 className="text-3xl font-bold text-white mt-2">3.40</h3>
                    <p className="text-xs text-emerald-400 mt-2">
                      <i className="fa-solid fa-arrow-trend-up mr-1"></i>
                      Good standing
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-award text-sky-400 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Completed Courses</p>
                    <h3 className="text-3xl font-bold text-white mt-2">6</h3>
                    <p className="text-xs text-slate-400 mt-2">Out of 9 courses</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-book-open text-emerald-400 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Average Score</p>
                    <h3 className="text-3xl font-bold text-white mt-2">84%</h3>
                    <p className="text-xs text-slate-400 mt-2">Across current courses</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-chart-pie text-purple-400 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Overall Progress</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {overallProgress}%
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">Current semester</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-bullseye text-amber-400 text-xl"></i>
                  </div>
                </div>
              </div>

            </div>

            {/* Overall Academic Progress */}
            <section className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Semester Overview
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Your overall academic performance
                  </p>
                </div>

                <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-3 py-2 rounded-lg w-fit">
                  Fall Semester 2026
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex justify-center">
                  <div className="relative w-44 h-44 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(#0ea5e9 ${overallProgress * 3.6}deg, #334155 0deg)`,
                    }}
                  >
                    <div className="w-36 h-36 rounded-full bg-[#202d40] flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {overallProgress}%
                      </span>
                      <span className="text-xs text-slate-400 mt-1">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-400">Current Semester</p>
                    <p className="text-2xl font-bold text-white mt-2">Semester 3</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Academic Status</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">
                      Good Standing
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Credits Earned</p>
                    <p className="text-2xl font-bold text-white mt-2">48 ECTS</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Remaining Credits</p>
                    <p className="text-2xl font-bold text-white mt-2">72 ECTS</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Course Performance */}
            <section>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">
                  Course Performance
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Individual progress in each course
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {courses.map((course) => (
                  <div
                    key={course.code}
                    className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 hover:border-sky-500/30 transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-bold text-white">{course.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {course.code}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {course.professor}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-bold text-sky-400">
                          {course.grade}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {course.score}/100
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="text-white font-semibold">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#111b2e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs text-emerald-400">
                        <i className="fa-solid fa-circle-check mr-1"></i>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Academic Activities */}
            <section>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">
                  Recent Academic Activities
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Your latest grades and submissions
                </p>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl overflow-hidden">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 ${
                      index !== activities.length - 1
                        ? 'border-b border-slate-700/70'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                        <i className={`${activity.icon} text-sky-400`}></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {activity.course}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.date}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-lg font-bold text-emerald-400">
                        {activity.score}
                      </p>
                      <p className="text-xs text-slate-500">Final Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-slate-800 pt-6 text-center">
              <p className="text-xs text-slate-500">
                Student Portal © 2026 — Academic Performance
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}