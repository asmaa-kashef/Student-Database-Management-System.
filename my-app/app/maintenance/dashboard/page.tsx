
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { getAdminSession } from '@/lib/admin-session';
import AdminLogoutButton from './AdminLogoutButton';

const entities = [
  {
    name: 'Students',
    description: 'Manage student records',
    icon: '🎓',
    href: '/maintenance/student',
  },
  {
    name: 'Courses',
    description: 'Manage academic courses',
    icon: '📚',
    href: '/maintenance/course',
  },
  {
    name: 'Assignments',
    description: 'Manage student assignments',
    icon: '📝',
    href: '/maintenance/assignment',
  },
  {
    name: 'Tasks',
    description: 'Manage academic tasks',
    icon: '📋',
    href: '/maintenance/task',
  },
  {
    name: 'Schedules',
    description: 'Manage class schedules',
    icon: '📅',
    href: '/maintenance/schedule',
  },
  {
    name: 'Projects',
    description: 'Manage course projects',
    icon: '💻',
    href: '/maintenance/project',
  },
];

const relationships = [
  {
    name: 'Enrollments',
    description: 'Connect students with courses',
    icon: '🔗',
    href: '/maintenance/enrollment',
  },
  {
    name: 'Submissions',
    description: 'Connect students with assignments',
    icon: '📤',
    href: '/maintenance/submission',
  },
];

async function ProtectedDashboard() {
  await connection();

  const admin = await getAdminSession();

  if (!admin) {
    redirect('/maintenance');
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#212d40] pb-6">
          <div>
            <p className="text-xs text-sky-400 uppercase tracking-widest font-semibold mb-2">
              Administrator Panel
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Database Management
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Manage entities, relationships and database records.
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Signed in as: {admin.username}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/"
              className="px-4 py-2 text-xs rounded-lg border border-[#29364b] bg-[#111723] hover:bg-[#1e293b] transition"
            >
              ← Main Dashboard
            </Link>

            <AdminLogoutButton />
          </div>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Managed Entities', value: '06', icon: '🗂️' },
            { label: 'Relationships', value: '02', icon: '🔗' },
            { label: 'Management Operations', value: 'CRUD', icon: '⚡' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111723] border border-[#212d40] rounded-xl p-5"
            >
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>

              <p className="text-2xl font-bold text-white mt-3">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Entities */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Entity Management
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Manage the main database entities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entities.map((entity) => (
              <div
                key={entity.name}
                className="bg-[#111723] border border-[#212d40] rounded-xl p-5 hover:border-sky-700 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#1a2638] flex items-center justify-center text-xl">
                    {entity.icon}
                  </div>

                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Entity
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mt-4">
                  {entity.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {entity.description}
                </p>

                <Link
                  href={entity.href}
                  className="inline-flex items-center gap-2 mt-5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  Manage Records <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Relationships */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Relationship Management
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Manage connections between database entities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationships.map((relationship) => (
              <div
                key={relationship.name}
                className="bg-[#111723] border border-[#245044] rounded-xl p-5 hover:border-emerald-600 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    {relationship.icon}
                  </span>

                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
                    Relationship
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mt-4">
                  {relationship.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {relationship.description}
                </p>

                <Link
                  href={relationship.href}
                  className="inline-flex items-center gap-2 mt-5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Manage Relationship <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#212d40] pt-5 text-center">
          <p className="text-xs text-slate-500">
            Database Management System · Administrator Workspace
          </p>
        </footer>

      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400 text-sm">
          Loading administrator dashboard...
        </main>
      }
    >
      <ProtectedDashboard />
    </Suspense>
  );
}
