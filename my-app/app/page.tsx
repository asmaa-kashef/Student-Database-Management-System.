
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const cardStyle =
  'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-[#2b405a] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-sky-500/40';

const courses = [
  { code: 'MDE-CO-02', name: 'Data Analytics', professor: 'Dr. Mariia Snigireva', progress: 75 },
  { code: 'MDE-CO-08', name: 'Python Programming', professor: 'Prof. Li Huang', progress: 85 },
  { code: 'MDE-CO-07', name: 'Databases', professor: 'Prof. Peter Baumann', progress: 60 },
];

const assignments = [
  { title: 'Data Analytics Assignment', course: 'Data Analytics', date: '17 Nov 2026', status: 'Pending' },
  { title: 'Python Programming Project', course: 'Python Programming', date: '20 Nov 2026', status: 'In Progress' },
  { title: 'Database Design', course: 'Databases', date: '23 Nov 2026', status: 'Pending' },
];

const tasks = [
  { title: 'Review Python Functions', course: 'Python Programming', priority: 'High' },
  { title: 'Prepare Database ER Diagram', course: 'Databases', priority: 'Medium' },
  { title: 'Study Data Visualization', course: 'Data Analytics', priority: 'Low' },
];

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

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

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

export default function Home() {
  const router = useRouter();

  function handleLogout() {
    router.push('/login');
  }

  return (
    <div className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200`}>
      <div className="flex min-h-screen">

        {/* Sticky Sidebar */}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  item.href === '/'
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
            <Link
              href="/imprint"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition"
            >
              <i className="fa-solid fa-scale-balanced w-5"></i>
              Imprint & Disclaimer
            </Link>

            <Link
              href="/maintenance"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition"
            >
              <i className="fa-solid fa-user-shield w-5"></i>
              Administrator Login
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition pt-2"
            >
              <i className="fa-solid fa-right-from-bracket w-5"></i>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-slate-400">Student Portal / Overview</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Student Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-11 h-11 rounded-xl bg-[#202d40] border border-slate-700 hover:bg-[#2b405a] transition">
                <i className="fa-regular fa-bell text-slate-300"></i>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                  SA
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Student A.</p>
                  <p className="text-xs text-slate-400">Student</p>
                </div>
              </div>
            </div>
          </header>

          {/* Welcome Banner */}
          <section className="rounded-2xl p-7 md:p-9 mb-8 bg-gradient-to-r from-[#173b60] to-[#244c70] border border-sky-400/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sky-300 text-sm font-medium mb-2">
                  Welcome back!
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Hello, Student A. 👋
                </h2>
                <p className="text-slate-300 mt-3 max-w-xl text-sm leading-6">
                  Welcome to your student dashboard. Track your courses,
                  assignments, projects, and academic progress in one place.
                </p>
              </div>

              <div className="hidden md:flex w-24 h-24 rounded-2xl bg-white/10 items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-5xl text-sky-200"></i>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Enrolled Courses', value: '06', icon: 'fa-book-open', color: 'text-sky-400', bg: 'bg-sky-400/10', href: '/courses' },
              { label: 'Pending Assignments', value: '03', icon: 'fa-file-circle-exclamation', color: 'text-amber-400', bg: 'bg-amber-400/10', href: '/assignments' },
              { label: 'Pending Tasks', value: '05', icon: 'fa-list-check', color: 'text-purple-400', bg: 'bg-purple-400/10', href: '/tasks' },
              { label: 'Project Progress', value: '75%', icon: 'fa-diagram-project', color: 'text-emerald-400', bg: 'bg-emerald-400/10', href: '/projects' },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-3">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${stat.icon} ${stat.color} text-xl`}></i>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Profile Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="My Profile" subtitle="Your academic information" />
              <Link href="/profile" className="text-sm text-sky-400 hover:text-sky-300">
                View Profile <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className={`${cardStyle} flex flex-col md:flex-row md:items-center gap-6`}>
              <div className="w-20 h-20 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-400 text-3xl">
                <i className="fa-solid fa-user-graduate"></i>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-1">
                {[
                  ['Full Name', 'Student A.'],
                  ['Student ID', '2014'],
                  ['Major', 'Data Engineering'],
                  ['Current Semester', 'Semester 3'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    <p className="font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Courses Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="My Courses" subtitle="Your currently enrolled courses" />
              <Link href="/courses" className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap">
                View All Courses <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <Link href="/courses" key={course.code} className={cardStyle}>
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-11 h-11 rounded-xl bg-sky-400/10 flex items-center justify-center">
                      <i className="fa-solid fa-book text-sky-400"></i>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-700/60 px-3 py-1 rounded-full">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{course.professor}</p>

                  <div className="flex justify-between text-xs text-slate-400 mt-6">
                    <span>Course Progress</span>
                    <span className="text-sky-400 font-semibold">{course.progress}%</span>
                  </div>
                  <ProgressBar value={course.progress} />
                </Link>
              ))}
            </div>
          </section>

          {/* Assignments Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="Assignments & Deadlines" subtitle="Your upcoming submissions" />
              <Link href="/assignments" className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap">
                View All <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-[#202d40]">
              <table className="w-full text-left min-w-[650px]">
                <thead className="bg-[#29394e] text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Assignment</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((item) => (
                    <tr key={item.title} className="border-t border-slate-700 hover:bg-[#2b405a] transition">
                      <td className="px-6 py-5 text-sm font-medium text-white">{item.title}</td>
                      <td className="px-6 py-5 text-sm text-slate-300">{item.course}</td>
                      <td className="px-6 py-5 text-sm text-slate-300">{item.date}</td>
                      <td className="px-6 py-5">
                        <span className={`text-xs px-3 py-1.5 rounded-full ${
                          item.status === 'Pending'
                            ? 'bg-amber-400/10 text-amber-400'
                            : 'bg-sky-400/10 text-sky-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tasks Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="My Study Tasks" subtitle="Your current study tasks" />
              <Link href="/tasks" className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap">
                View All Tasks <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <Link href="/tasks" key={task.title} className={cardStyle}>
                  <div className="flex justify-between items-center mb-5">
                    <i className="fa-solid fa-list-check text-sky-400 text-xl"></i>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      task.priority === 'High'
                        ? 'bg-red-400/10 text-red-400'
                        : task.priority === 'Medium'
                        ? 'bg-amber-400/10 text-amber-400'
                        : 'bg-emerald-400/10 text-emerald-400'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-white font-semibold">{task.title}</h3>
                  <p className="text-sm text-slate-400 mt-2">{task.course}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Schedule Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="Class Schedule" subtitle="Your weekly learning schedule" />
              <Link href="/schedule" className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap">
                View Schedule <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { day: 'Monday', time: '09:00 - 11:00', course: 'Data Analytics', room: 'Room 201' },
                { day: 'Wednesday', time: '11:00 - 13:00', course: 'Python Programming', room: 'Room 105' },
                { day: 'Friday', time: '14:00 - 16:00', course: 'Databases', room: 'Room 302' },
              ].map((item) => (
                <Link href="/schedule" key={item.day} className={cardStyle}>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sky-400 font-semibold">{item.day}</span>
                    <i className="fa-regular fa-calendar text-slate-400 text-xl"></i>
                  </div>
                  <h3 className="text-white font-semibold">{item.course}</h3>
                  <p className="text-sm text-slate-400 mt-3">
                    <i className="fa-regular fa-clock mr-2"></i>{item.time}
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    <i className="fa-solid fa-location-dot mr-2"></i>{item.room}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Projects Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="My Projects" subtitle="Monitor your academic projects" />
              <Link href="/projects" className="text-sm text-sky-400 hover:text-sky-300">
                View Projects <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <Link href="/projects" className={`${cardStyle} block`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-400/10 flex items-center justify-center">
                      <i className="fa-solid fa-diagram-project text-purple-400"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Student Database Management System</h3>
                      <p className="text-xs text-slate-400 mt-1">Course Project</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-6">
                    Manage project activities, milestones, and academic deliverables.
                  </p>
                </div>

                <div className="md:w-64">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="text-sky-400 font-semibold">75%</span>
                  </div>
                  <ProgressBar value={75} />
                </div>
              </div>
            </Link>
          </section>

          {/* Academic Progress Preview */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle title="Academic Progress" subtitle="An overview of your academic performance" />
              <Link href="/progress" className="text-sm text-sky-400 hover:text-sky-300 whitespace-nowrap">
                View Details <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link href="/progress" className={cardStyle}>
                <p className="text-sm text-slate-400">Current GPA</p>
                <h3 className="text-4xl font-bold text-sky-400 mt-4">3.4</h3>
                <p className="text-xs text-slate-500 mt-2">Example value</p>
              </Link>

              <Link href="/progress" className={cardStyle}>
                <p className="text-sm text-slate-400">Course Completion</p>
                <h3 className="text-4xl font-bold text-emerald-400 mt-4">75%</h3>
                <ProgressBar value={75} />
              </Link>

              <Link href="/progress" className={cardStyle}>
                <p className="text-sm text-slate-400">Current Semester</p>
                <h3 className="text-4xl font-bold text-purple-400 mt-4">03</h3>
                <p className="text-xs text-slate-500 mt-2">Semester 3</p>
              </Link>
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
