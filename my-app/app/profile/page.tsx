
'use client';

import { useEffect, useState } from 'react';
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

const cardStyle =
  'bg-[#202d40] border border-slate-700/70 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2b405a] hover:border-sky-500/40';

const inputStyle =
  'w-full bg-[#111b2e] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-400 transition';

type StudentData = {
  student_id: number;
  matriculation_number: string;
  major: string;
  current_semester: number;
  gpa: string | number;
  user_id: number | null;
  full_name: string | null;
  email: string | null;
  user_role: string | null;
};

type InfoFieldProps = {
  label: string;
  value: string;
  editing: boolean;
  editable?: boolean;
  onChange?: (value: string) => void;
};

function InfoField({
  label,
  value,
  editing,
  editable = false,
  onChange,
}: InfoFieldProps) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-2">
        {label}
      </label>

      {editing && editable ? (
        <input
          className={inputStyle}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <p className="text-sm font-medium text-white">
          {value || 'Not provided'}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [phone, setPhone] = useState('Not provided');

  // Temporary test ID until student authentication and session are implemented.
  const studentId = 2016;

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const response = await fetch(
          `/api/students/${studentId}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Student profile not found.'
              : 'Failed to load student profile.'
          );
        }

        const data: StudentData = await response.json();

        if (isMounted) {
          setStudent(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while loading your profile.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSave() {
    // Phone changes are currently local only.
    // A database update API will be added separately.
    setEditing(false);
    alert('Changes are not saved to the database yet.');
  }

  function handleCancel() {
    setPhone('Not provided');
    setEditing(false);
  }

  const fullName = student?.full_name || 'Not provided';
  const displayedStudentId = student?.matriculation_number || 'Not provided';
  const email = student?.email || 'Not provided';
  const major = student?.major || 'Not provided';
  const semester = student?.current_semester?.toString() || 'Not provided';
  const gpa = student?.gpa?.toString() || 'Not provided';

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
                  item.href === '/profile'
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
                Student Portal / My Profile
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                My Profile
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                View and manage your personal and academic information.
              </p>
            </div>

            {!loading && !error && student && (
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
                  editing
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                <i className={`fa-solid ${editing ? 'fa-check' : 'fa-pen'} mr-2`}></i>
                {editing ? 'Save Changes' : 'Edit Profile'}
              </button>
            )}
          </header>

          {loading ? (
            <div className={`${cardStyle} text-center py-16`}>
              <i className="fa-solid fa-spinner fa-spin text-3xl text-sky-400"></i>
              <p className="text-slate-300 mt-4">Loading your profile...</p>
            </div>
          ) : error ? (
            <div className={`${cardStyle} text-center py-12`}>
              <i className="fa-solid fa-circle-exclamation text-3xl text-red-400"></i>
              <p className="text-red-300 mt-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm"
              >
                Try Again
              </button>
            </div>
          ) : student ? (
            <>
              {/* Profile Banner */}
              <section className="bg-gradient-to-r from-[#173b60] to-[#244c70] border border-sky-400/20 rounded-2xl p-7 md:p-9 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                  <div className="w-24 h-24 rounded-2xl bg-sky-400/20 border border-sky-300/30 flex items-center justify-center">
                    <i className="fa-solid fa-user-graduate text-5xl text-sky-200"></i>
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold text-white">
                      {fullName}
                    </h2>

                    <p className="text-sky-200 mt-2">{major}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                      <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                        <i className="fa-solid fa-id-card mr-2"></i>
                        ID: {displayedStudentId}
                      </span>

                      <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                        <i className="fa-solid fa-graduation-cap mr-2"></i>
                        Semester {semester}
                      </span>
                    </div>
                  </div>

                  <div className="text-center bg-white/10 rounded-xl p-5 min-w-28">
                    <p className="text-xs text-sky-200">Current GPA</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {gpa}
                    </h3>
                  </div>
                </div>
              </section>

              {/* Personal Information */}
              <section className={`${cardStyle} mb-7`}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                    <i className="fa-solid fa-user text-sky-400"></i>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Personal Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your personal contact details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <InfoField label="Full Name" value={fullName} editing={editing} />
                  <InfoField label="Student ID" value={displayedStudentId} editing={editing} />
                  <InfoField label="Email Address" value={email} editing={editing} />
                  <InfoField
                    label="Phone Number"
                    value={phone}
                    editing={editing}
                    editable
                    onChange={setPhone}
                  />
                </div>
              </section>

              {/* Academic Information */}
              <section className={`${cardStyle} mb-7`}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-purple-400"></i>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Academic Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your current academic status
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <InfoField label="Major / Program" value={major} editing={editing} />
                  <InfoField label="Current Semester" value={semester} editing={editing} />
                  <InfoField label="Current GPA" value={gpa} editing={editing} />
                  <InfoField label="Enrollment Year" value="Not available" editing={editing} />
                </div>
              </section>

              {/* Account Information */}
              <section className={`${cardStyle} mb-7`}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                    <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Account Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your portal account status
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Account Role</p>
                    <p className="text-sm font-medium text-white">
                      {student.user_role || 'Student'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2">Account Status</p>
                    <span className="inline-flex items-center gap-2 text-xs bg-emerald-400/10 text-emerald-400 px-3 py-2 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2">Portal</p>
                    <p className="text-sm font-medium text-white">
                      AIMAP Student Portal
                    </p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-10">
                {editing && (
                  <button
                    onClick={handleCancel}
                    className="px-5 py-3 rounded-xl bg-[#202d40] border border-slate-700 text-slate-300 hover:bg-[#2b405a] transition text-sm"
                  >
                    <i className="fa-solid fa-xmark mr-2"></i>
                    Cancel Editing
                  </button>
                )}

                <Link
                  href="/"
                  className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition text-sm"
                >
                  <i className="fa-solid fa-house mr-2"></i>
                  Back to Dashboard
                </Link>
              </div>
            </>
          ) : null}

          {/* Footer */}
          <footer className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
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
