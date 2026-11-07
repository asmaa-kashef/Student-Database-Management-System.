'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

type Project = {
  id: number;
  title: string;
  code: string;
  subject: string;
  description: string;
  supervisor: string;
  dueDate: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
  members: string[];
  milestones: {
    title: string;
    completed: boolean;
  }[];
};

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Student Database Management System',
    code: 'PRJ-001',
    subject: 'Databases',
    description:
      'Design and develop a database management system for handling student academic information.',
    supervisor: 'Prof. Peter Baumann',
    dueDate: '2026-11-20',
    progress: 65,
    status: 'In Progress',
    members: ['Student A.', 'Student B.', 'Student C.'],
    milestones: [
      { title: 'Requirements analysis', completed: true },
      { title: 'Database design', completed: true },
      { title: 'Frontend development', completed: true },
      { title: 'Backend integration', completed: false },
      { title: 'Testing and documentation', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Predictive Maintenance Analysis',
    code: 'PRJ-002',
    subject: 'Data Analytics',
    description:
      'Analyze industrial sensor data and develop a predictive maintenance model.',
    supervisor: 'Dr. Mariia Snigireva',
    dueDate: '2026-12-05',
    progress: 35,
    status: 'In Progress',
    members: ['Student A.', 'Student D.'],
    milestones: [
      { title: 'Dataset collection', completed: true },
      { title: 'Data cleaning', completed: true },
      { title: 'Exploratory data analysis', completed: false },
      { title: 'Model development', completed: false },
      { title: 'Final presentation', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Python Data Processing Tool',
    code: 'PRJ-003',
    subject: 'Python Programming',
    description:
      'Build a Python application to process, clean, and analyze structured datasets.',
    supervisor: 'Prof. Li Huang',
    dueDate: '2026-10-25',
    progress: 100,
    status: 'Completed',
    members: ['Student A.', 'Student E.'],
    milestones: [
      { title: 'Project planning', completed: true },
      { title: 'Python implementation', completed: true },
      { title: 'Testing', completed: true },
      { title: 'Documentation', completed: true },
    ],
  },
];

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

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('All');
  const [expandedProject, setExpandedProject] = useState<number | null>(1);

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((project) => project.status === filter);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === 'Completed'
  ).length;
  const activeProjects = projects.filter(
    (project) => project.status === 'In Progress'
  ).length;

  function getStatusStyle(status: Project['status']) {
    if (status === 'Completed') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }

    if (status === 'In Progress') {
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }

    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

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
              const active = item.href === '/projects';

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
                  STUDENT WORKSPACE
                </p>
                <h2 className="text-3xl font-bold text-white">My Projects</h2>
                <p className="text-slate-400 mt-2">
                  Manage your academic projects and track your progress.
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

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Total Projects</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {totalProjects}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-diagram-project text-sky-400 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Active Projects</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {activeProjects}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-spinner text-amber-400 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Completed Projects</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {completedProjects}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Project List */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Project Overview</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Your current and previous academic projects
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'In Progress', 'Completed', 'Not Started'].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                          filter === item
                            ? 'bg-sky-500 text-white'
                            : 'bg-[#202d40] text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-5">
                {filteredProjects.map((project) => {
                  const isExpanded = expandedProject === project.id;
                  const completedMilestones = project.milestones.filter(
                    (milestone) => milestone.completed
                  ).length;

                  return (
                    <div
                      key={project.id}
                      className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/30"
                    >
                      {/* Project Header */}
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-lg">
                              {project.code}
                            </span>
                            <span
                              className={`text-xs font-semibold border px-3 py-1 rounded-lg ${getStatusStyle(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>

                          <h4 className="text-lg md:text-xl font-bold text-white">
                            {project.title}
                          </h4>

                          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setExpandedProject(isExpanded ? null : project.id)
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111b2e] border border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-500/30 transition text-sm font-semibold"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          <i
                            className={`fa-solid ${
                              isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'
                            }`}
                          ></i>
                        </button>
                      </div>

                      {/* Project Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-700/70">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <i className="fa-solid fa-book text-slate-400"></i>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Course</p>
                            <p className="text-sm text-slate-200 font-medium">
                              {project.subject}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <i className="fa-solid fa-user-tie text-slate-400"></i>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Supervisor</p>
                            <p className="text-sm text-slate-200 font-medium">
                              {project.supervisor}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <i className="fa-solid fa-calendar text-slate-400"></i>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Due Date</p>
                            <p className="text-sm text-slate-200 font-medium">
                              {new Date(
                                `${project.dueDate}T00:00:00`
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-semibold text-slate-300">
                            Project Progress
                          </p>
                          <p className="text-sm font-bold text-sky-400">
                            {project.progress}%
                          </p>
                        </div>

                        <div className="w-full h-2.5 bg-[#111b2e] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-700/70 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h5 className="font-bold text-white mb-4 flex items-center gap-2">
                              <i className="fa-solid fa-flag-checkered text-sky-400"></i>
                              Project Milestones
                            </h5>

                            <div className="space-y-4">
                              {project.milestones.map((milestone, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                      milestone.completed
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : 'bg-slate-700 text-slate-500'
                                    }`}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        milestone.completed
                                          ? 'fa-check'
                                          : 'fa-circle'
                                      } text-xs`}
                                    ></i>
                                  </div>

                                  <span
                                    className={`text-sm ${
                                      milestone.completed
                                        ? 'text-slate-300'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {milestone.title}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <p className="text-xs text-slate-500 mt-5">
                              {completedMilestones} of {project.milestones.length}{' '}
                              milestones completed
                            </p>
                          </div>

                          <div>
                            <h5 className="font-bold text-white mb-4 flex items-center gap-2">
                              <i className="fa-solid fa-users text-sky-400"></i>
                              Project Team
                            </h5>

                            <div className="space-y-3">
                              {project.members.map((member, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 bg-[#111b2e] rounded-xl p-3"
                                >
                                  <div className="w-9 h-9 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center">
                                    <i className="fa-solid fa-user text-sm"></i>
                                  </div>
                                  <span className="text-sm text-slate-300">
                                    {member}
                                  </span>
                                  {index === 0 && (
                                    <span className="ml-auto text-xs text-sky-400">
                                      You
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-10 text-center">
                    <i className="fa-solid fa-folder-open text-4xl text-slate-600"></i>
                    <p className="text-white font-semibold mt-4">
                      No projects found
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      There are no projects with this status.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-slate-800 pt-6 text-center">
              <p className="text-xs text-slate-500">
                Student Portal © 2026 — Academic Project Management
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}