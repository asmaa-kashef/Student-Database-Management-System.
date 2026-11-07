
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

type ClassItem = {
  id: number;
  day: string;
  course: string;
  code: string;
  professor: string;
  startTime: string;
  endTime: string;
  room: string;
  type: string;
};

const initialClasses: ClassItem[] = [
  {
    id: 1,
    day: 'Monday',
    course: 'Data Analytics',
    code: 'MDE-CO-02',
    professor: 'Dr. Mariia Snigireva',
    startTime: '09:00',
    endTime: '11:00',
    room: 'Room 201',
    type: 'Lecture',
  },
  {
    id: 2,
    day: 'Monday',
    course: 'Python Programming',
    code: 'MDE-CO-08',
    professor: 'Prof. Li Huang',
    startTime: '13:00',
    endTime: '15:00',
    room: 'Computer Lab 1',
    type: 'Lab',
  },
  {
    id: 3,
    day: 'Wednesday',
    course: 'Python Programming',
    code: 'MDE-CO-08',
    professor: 'Prof. Li Huang',
    startTime: '11:00',
    endTime: '13:00',
    room: 'Room 105',
    type: 'Lecture',
  },
  {
    id: 4,
    day: 'Wednesday',
    course: 'Databases',
    code: 'MDE-CO-07',
    professor: 'Prof. Peter Baumann',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Computer Lab 2',
    type: 'Lab',
  },
  {
    id: 5,
    day: 'Friday',
    course: 'Databases',
    code: 'MDE-CO-07',
    professor: 'Prof. Peter Baumann',
    startTime: '09:00',
    endTime: '11:00',
    room: 'Room 302',
    type: 'Lecture',
  },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const cardStyle =
  'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:border-sky-500/40';

export default function SchedulePage() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [selectedDay, setSelectedDay] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const [newClass, setNewClass] = useState({
    day: 'Monday',
    course: '',
    code: '',
    professor: '',
    startTime: '',
    endTime: '',
    room: '',
    type: 'Lecture',
  });

  const totalClasses = classes.length;
  const totalDays = new Set(classes.map((item) => item.day)).size;
  const labClasses = classes.filter((item) => item.type === 'Lab').length;

  const filteredClasses =
    selectedDay === 'All'
      ? classes
      : classes.filter((item) => item.day === selectedDay);

  function handleAddClass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !newClass.course.trim() ||
      !newClass.startTime ||
      !newClass.endTime ||
      !newClass.room.trim()
    ) {
      return;
    }

    if (newClass.endTime <= newClass.startTime) {
      alert('End time must be later than start time.');
      return;
    }

    const item: ClassItem = {
      ...newClass,
      id: Date.now(),
      course: newClass.course.trim(),
      code: newClass.code.trim(),
      professor: newClass.professor.trim(),
      room: newClass.room.trim(),
    };

    setClasses((previous) => [...previous, item]);
    setNewClass({
      day: 'Monday',
      course: '',
      code: '',
      professor: '',
      startTime: '',
      endTime: '',
      room: '',
      type: 'Lecture',
    });
    setShowForm(false);
  }

  function deleteClass(id: number) {
    setClasses((previous) => previous.filter((item) => item.id !== id));
  }

  function typeStyle(type: string) {
    return type === 'Lab'
      ? 'bg-purple-400/10 text-purple-400'
      : 'bg-sky-400/10 text-sky-400';
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
                  item.href === '/schedule'
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
              <p className="text-sm text-slate-400">
                Student Portal / Class Schedule
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Class Schedule
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                View and organize your weekly classes and lectures.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Class
            </button>
          </header>

          {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-[#173b60] to-[#244c70] border border-sky-400/20 rounded-2xl p-7 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-calendar-week text-3xl text-sky-200"></i>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Your Weekly Schedule
                </h2>
                <p className="text-sm text-slate-300 mt-2">
                  Stay organized and never miss a class.
                </p>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            {[
              {
                label: 'Total Classes',
                value: totalClasses,
                icon: 'fa-calendar-check',
                color: 'text-sky-400',
                bg: 'bg-sky-400/10',
              },
              {
                label: 'Active Days',
                value: totalDays,
                icon: 'fa-calendar-day',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
              },
              {
                label: 'Lab Sessions',
                value: labClasses,
                icon: 'fa-laptop-code',
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

          {/* Add Class Form */}
          {showForm && (
            <section className={`${cardStyle} mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Add New Class
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Close form"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Course Name</label>
                  <input
                    required
                    value={newClass.course}
                    onChange={(e) => setNewClass({ ...newClass, course: e.target.value })}
                    placeholder="Enter course name"
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Course Code</label>
                  <input
                    value={newClass.code}
                    onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                    placeholder="e.g. MDE-CO-02"
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Professor</label>
                  <input
                    value={newClass.professor}
                    onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                    placeholder="Professor name"
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Day</label>
                  <select
                    value={newClass.day}
                    onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  >
                    {days.map((day) => <option key={day}>{day}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Start Time</label>
                  <input
                    required
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">End Time</label>
                  <input
                    required
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Room</label>
                  <input
                    required
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    placeholder="Room number"
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Class Type</label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Save Class
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Day Filter */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Weekly Timetable
            </h2>

            <div className="flex flex-wrap gap-2">
              {['All', ...days].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-xl text-sm transition ${
                    selectedDay === day
                      ? 'bg-sky-500 text-white'
                      : 'bg-[#202d40] text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </section>

          {/* Schedule List */}
          <section className="space-y-5 mb-10">

            {filteredClasses.length > 0 ? (
              days
                .filter((day) => selectedDay === 'All' || selectedDay === day)
                .map((day) => {
                  const dayClasses = filteredClasses
                    .filter((item) => item.day === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  if (dayClasses.length === 0) return null;

                  return (
                    <div key={day} className={cardStyle}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                          <i className="fa-solid fa-calendar-day text-sky-400"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{day}</h3>
                          <p className="text-xs text-slate-400">
                            {dayClasses.length} class session(s)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {dayClasses.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row md:items-center gap-4 bg-[#111b2e] border border-slate-700/70 rounded-xl p-4"
                          >
                            <div className="md:w-36 shrink-0">
                              <p className="text-sky-400 font-semibold text-sm">
                                {item.startTime} - {item.endTime}
                              </p>
                              <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${typeStyle(item.type)}`}>
                                {item.type}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold">
                                {item.course}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1">
                                {item.code}
                              </p>
                              <p className="text-sm text-slate-400 mt-2">
                                <i className="fa-solid fa-user-tie mr-2"></i>
                                {item.professor || 'Professor not specified'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm text-slate-300">
                                <i className="fa-solid fa-location-dot text-sky-400 mr-2"></i>
                                {item.room}
                              </span>

                              <button
                                onClick={() => deleteClass(item.id)}
                                className="w-9 h-9 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
                                aria-label="Delete class"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className={`${cardStyle} text-center py-12`}>
                <i className="fa-regular fa-calendar-xmark text-4xl text-slate-500"></i>
                <h3 className="text-white font-semibold mt-4">
                  No Classes Scheduled
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  There are no classes scheduled for this day.
                </p>
              </div>
            )}
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
