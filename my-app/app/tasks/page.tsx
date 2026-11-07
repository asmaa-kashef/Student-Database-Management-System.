
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const navigation = [
  { icon: 'fa-chart-pie', label: 'Overview', href: '/' },
  { icon: 'fa-user', label: 'My Profile', href: '/profile' },
  { icon: 'fa-book', label: 'My Courses', href: '/courses' },
  { icon: 'fa-file-lines', label: 'Assignments', href: '/assignments' },
  { icon: 'fa-list-check', label: 'My Tasks', href: '/tasks' },
  { icon: 'fa-calendar-days', label: 'Class Schedule', href: '/schedule' },
  { icon: 'fa-diagram-project', label: 'Projects', href: '/projects' },
  { icon: 'fa-chart-line', label: 'Academic Progress', href: '/progress' },
  { icon: 'fa-magnifying-glass', label: 'Student Search', href: '/search/students' },
];

type Task = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review Python Functions',
    course: 'Python Programming',
    dueDate: '2026-11-05',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Prepare Database ER Diagram',
    course: 'Databases',
    dueDate: '2026-11-08',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Study Data Visualization',
    course: 'Data Analytics',
    dueDate: '2026-11-10',
    priority: 'Low',
    status: 'Pending',
  },
  {
    id: 4,
    title: 'Complete SQL Practice',
    course: 'Databases',
    dueDate: '2026-11-12',
    priority: 'High',
    status: 'Completed',
  },
];

const cardStyle =
  'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:border-sky-500/40';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');

  const [newTask, setNewTask] = useState({
    title: '',
    course: 'Python Programming',
    dueDate: '',
    priority: 'Medium' as Task['priority'],
  });

  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status === 'Pending'
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length;

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((task) => task.status === filter);

  function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.dueDate) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.title.trim(),
      course: newTask.course,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: 'Pending',
    };

    setTasks((previous) => [task, ...previous]);

    setNewTask({
      title: '',
      course: 'Python Programming',
      dueDate: '',
      priority: 'Medium',
    });

    setShowForm(false);
  }

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === 'Completed'
                  ? 'Pending'
                  : 'Completed',
            }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  function priorityStyle(priority: Task['priority']) {
    if (priority === 'High') return 'bg-red-400/10 text-red-400';
    if (priority === 'Medium') return 'bg-amber-400/10 text-amber-400';
    return 'bg-emerald-400/10 text-emerald-400';
  }

  function statusStyle(status: Task['status']) {
    if (status === 'Completed') return 'bg-emerald-400/10 text-emerald-400';
    if (status === 'In Progress') return 'bg-sky-400/10 text-sky-400';
    return 'bg-amber-400/10 text-amber-400';
  }

  function formatDate(date: string) {
    if (!date) return 'No date';
    return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className={`${jakarta.className} min-h-screen bg-[#0b1220] text-slate-200`}>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#111b2e] border-r border-slate-800 p-5 sticky top-0 h-screen self-start overflow-y-auto">

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
                  item.href === '/tasks'
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    : 'text-slate-400 hover:bg-[#202d40] hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-700 pt-5 mt-5 space-y-3">
            <Link href="/imprint" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white">
              <i className="fa-solid fa-scale-balanced w-5"></i>
              Imprint & Disclaimer
            </Link>

            <Link href="/maintenance" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white">
              <i className="fa-solid fa-user-shield w-5"></i>
              Administrator Login
            </Link>

            <Link href="/login" className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300">
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
              <p className="text-sm text-slate-400">Student Portal / My Tasks</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                My Tasks
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Organize your study activities and keep track of your deadlines.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add New Task
            </button>
          </header>

          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {[
              {
                label: 'Total Tasks',
                value: tasks.length,
                icon: 'fa-list-check',
                color: 'text-sky-400',
                bg: 'bg-sky-400/10',
              },
              {
                label: 'Pending',
                value: pendingCount,
                icon: 'fa-clock',
                color: 'text-amber-400',
                bg: 'bg-amber-400/10',
              },
              {
                label: 'In Progress',
                value: inProgressCount,
                icon: 'fa-spinner',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
              },
              {
                label: 'Completed',
                value: completedCount,
                icon: 'fa-circle-check',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
              },
            ].map((stat) => (
              <div key={stat.label} className={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-3">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${stat.icon} ${stat.color} text-xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Add Task Form */}
          {showForm && (
            <section className={`${cardStyle} mb-8`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Create New Task
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Close form"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">
                    Task Title
                  </label>
                  <input
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Course
                  </label>
                  <select
                    value={newTask.course}
                    onChange={(e) => setNewTask({ ...newTask, course: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  >
                    <option>Python Programming</option>
                    <option>Data Analytics</option>
                    <option>Databases</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Due Date
                  </label>
                  <input
                    required
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Create Task
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Task List */}
          <section className="mb-10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Task List</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Manage and update your study tasks.
                </p>
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#202d40] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-4">

              {filteredTasks.map((task) => (
                <div key={task.id} className={`${cardStyle} flex flex-col lg:flex-row lg:items-center gap-5`}>

                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-7 h-7 shrink-0 rounded-lg border flex items-center justify-center transition ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-500 hover:border-sky-400 text-transparent'
                    }`}
                    aria-label="Toggle task completion"
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-white ${
                      task.status === 'Completed' ? 'line-through opacity-60' : ''
                    }`}>
                      {task.title}
                    </h3>

                    <p className="text-sm text-slate-400 mt-2">
                      <i className="fa-solid fa-book-open mr-2"></i>
                      {task.course}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full ${priorityStyle(task.priority)}`}>
                      {task.priority} Priority
                    </span>

                    <span className={`text-xs px-3 py-1.5 rounded-full ${statusStyle(task.status)}`}>
                      {task.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      <i className="fa-regular fa-calendar mr-2"></i>
                      {formatDate(task.dueDate)}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="w-9 h-9 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
                      aria-label="Delete task"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className={`${cardStyle} text-center py-12`}>
                  <i className="fa-solid fa-clipboard-check text-4xl text-slate-500"></i>
                  <h3 className="text-white font-semibold mt-4">No Tasks Found</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    There are no tasks in this category.
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800 pt-6 mt-12 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 AIMAP - Student Database Management System</p>

            <Link href="/imprint" className="hover:text-sky-400">
              Imprint & Disclaimer
            </Link>
          </footer>

        </main>
      </div>
    </div>
  );
}
