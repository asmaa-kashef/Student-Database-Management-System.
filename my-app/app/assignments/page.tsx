
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type Assignment = {
  id: number;
  title: string;
  course: string;
  courseCode: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Overdue' | 'In Progress';
  submissionFormat: string;
};

const assignments: Assignment[] = [
  {
    id: 1,
    title: 'Data Analytics Assignment',
    course: 'Data Analytics',
    courseCode: 'MDE-CO-02',
    description: 'Analyze a dataset and present your findings using appropriate visualization techniques.',
    dueDate: '17 Nov 2026',
    status: 'Pending',
    submissionFormat: 'PDF',
  },
  {
    id: 2,
    title: 'Python Programming Project',
    course: 'Python Programming',
    courseCode: 'MDE-CO-08',
    description: 'Develop a Python application using functions, data structures, and object-oriented programming.',
    dueDate: '20 Nov 2026',
    status: 'In Progress',
    submissionFormat: 'ZIP',
  },
  {
    id: 3,
    title: 'Database Design',
    course: 'Databases',
    courseCode: 'MDE-CO-07',
    description: 'Design a relational database schema and implement the required SQL queries.',
    dueDate: '23 Nov 2026',
    status: 'Pending',
    submissionFormat: 'PDF',
  },
  {
    id: 4,
    title: 'Data Cleaning Exercise',
    course: 'Data Analytics',
    courseCode: 'MDE-CO-02',
    description: 'Clean and prepare a dataset for further analysis.',
    dueDate: '25 Oct 2026',
    status: 'Overdue',
    submissionFormat: 'PDF',
  },
  {
    id: 5,
    title: 'Python Lab Exercises',
    course: 'Python Programming',
    courseCode: 'MDE-CO-08',
    description: 'Complete the practical programming exercises from the lab sessions.',
    dueDate: '28 Oct 2026',
    status: 'Submitted',
    submissionFormat: 'ZIP',
  },
];

const navigation = [
  { icon: 'fa-chart-pie', label: 'Overview', href: '/' },
  { icon: 'fa-user', label: 'My Profile', href: '/#profile' },
  { icon: 'fa-book', label: 'My Courses', href: '/courses' },
  { icon: 'fa-file-lines', label: 'Assignments', href: '/assignments' },
  { icon: 'fa-list-check', label: 'My Tasks', href: '/#tasks' },
  { icon: 'fa-calendar-days', label: 'Class Schedule', href: '/#schedule' },
  { icon: 'fa-diagram-project', label: 'Projects', href: '/#projects' },
  { icon: 'fa-chart-line', label: 'Academic Progress', href: '/#progress' },
  { icon: 'fa-magnifying-glass', label: 'Student Search', href: '/search/students' },
];

function StatusBadge({ status }: { status: Assignment['status'] }) {
  const styles = {
    Pending: 'bg-amber-400/10 text-amber-400',
    Submitted: 'bg-emerald-400/10 text-emerald-400',
    Overdue: 'bg-red-400/10 text-red-400',
    'In Progress': 'bg-sky-400/10 text-sky-400',
  };

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

export default function AssignmentsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Pending', 'In Progress', 'Submitted', 'Overdue'];

  const filteredAssignments =
    activeFilter === 'All'
      ? assignments
      : assignments.filter((assignment) => assignment.status === activeFilter);

  const stats = [
    {
      label: 'Total Assignments',
      value: assignments.length,
      icon: 'fa-file-lines',
      color: 'text-sky-400',
      bg: 'bg-sky-400/10',
    },
    {
      label: 'Pending',
      value: assignments.filter((a) => a.status === 'Pending').length,
      icon: 'fa-clock',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Submitted',
      value: assignments.filter((a) => a.status === 'Submitted').length,
      icon: 'fa-circle-check',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Overdue',
      value: assignments.filter((a) => a.status === 'Overdue').length,
      icon: 'fa-triangle-exclamation',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
  ];

  const cardStyle =
    'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:shadow-xl hover:border-sky-500/40';

  return (
    <div className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200`}>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#111b2e] border-r border-slate-800 p-5">

          <Link href="/" className="mb-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AIMAP</h1>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </div>
          </Link>

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  item.label === 'Assignments'
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    : 'text-slate-400 hover:bg-[#202d40] hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-700 pt-5 mt-5 space-y-4">
            <Link
              href="/imprint"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-scale-balanced w-5"></i>
              Imprint & Disclaimer
            </Link>

            <Link
              href="/maintenance"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-user-shield w-5"></i>
              Administrator Login
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300"
            >
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
                Student Portal / Assignments
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Assignments & Deadlines
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Manage your assignments and keep track of upcoming deadlines.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative w-11 h-11 rounded-xl bg-[#202d40] border border-slate-700 hover:bg-[#2b405a]">
                <i className="fa-regular fa-bell text-slate-300"></i>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400"></span>
              </button>

              <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                SA
              </div>
            </div>
          </header>

          {/* Welcome Banner */}
          <section className="rounded-2xl p-7 mb-8 bg-gradient-to-r from-[#173b60] to-[#244c70] border border-sky-400/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-sky-300 text-sm font-medium mb-2">
                  Stay on Track
                </p>
                <h2 className="text-2xl font-bold text-white">
                  Your Assignments
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-xl leading-6">
                  Keep an eye on your deadlines, complete your coursework,
                  and submit your assignments on time.
                </p>
              </div>

              <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/10 items-center justify-center">
                <i className="fa-solid fa-file-circle-check text-4xl text-sky-200"></i>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-3">
                      {String(stat.value).padStart(2, '0')}
                    </h3>
                  </div>

                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${stat.icon} ${stat.color} text-xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Assignment List */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <SectionTitle
                title="All Assignments"
                subtitle="View and manage your coursework"
              />

              <span className="text-xs text-slate-400 bg-[#202d40] border border-slate-700 px-4 py-2 rounded-xl">
                {filteredAssignments.length} Assignments
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm transition ${
                    activeFilter === filter
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-[#202d40] text-slate-400 border border-slate-700 hover:text-white hover:bg-[#2b405a]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-[#202d40]">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-[#29394e] text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Assignment</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-t border-slate-700 hover:bg-[#2b405a] transition"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-white">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {assignment.description}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-200">{assignment.course}</p>
                        <p className="text-xs text-slate-500 mt-1">{assignment.courseCode}</p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300 whitespace-nowrap">
                        <i className="fa-regular fa-calendar mr-2 text-slate-400"></i>
                        {assignment.dueDate}
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs bg-slate-700/70 text-slate-300 px-3 py-1.5 rounded-lg">
                          {assignment.submissionFormat}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={assignment.status} />
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => alert(`Assignment details: ${assignment.title}`)}
                          className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap"
                        >
                          View Details
                          <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No assignments found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Information */}
          <section className="mt-8">
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 flex items-start gap-4">
              <i className="fa-solid fa-circle-info text-sky-400 text-xl mt-1"></i>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Submission Information
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-6">
                  Please check the required submission format and deadline
                  before submitting your work. Late submissions may not be accepted.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800 pt-6 mt-12 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 AIMAP - Student Database Management System</p>
            <div className="flex gap-5">
              <Link href="/imprint" className="hover:text-sky-400">
                Imprint & Disclaimer
              </Link>
              <Link href="/maintenance" className="hover:text-sky-400">
                Administrator Portal
              </Link>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
