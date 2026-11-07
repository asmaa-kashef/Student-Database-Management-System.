
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Authentication will be connected to the backend later.
    alert('Student Login interface is ready. Authentication will be connected next.');
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[#0b1220] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden`}>

      {/* Background Decoration */}
      <div className="absolute w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -top-32 -left-32" />
      <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -bottom-32 -right-32" />

      <div className="w-full max-w-md relative z-10">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-[#202d40] border border-slate-700/70 rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40">

          {/* Logo */}
          <div className="text-center mb-9">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-3xl text-sky-400"></i>
            </div>

            <h1 className="text-2xl font-bold text-white">
              Student Login
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Welcome back! Sign in to access your academic portal.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Student ID or Email
              </label>

              <div className="relative">
                <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>

                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your Student ID or Email"
                  required
                  className="w-full bg-[#111b2e] border border-slate-600 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#111b2e] border border-slate-600 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-400 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5"
            >
              Sign In
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Admin Login */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Are you an administrator?
            </p>

            <Link
              href="/maintenance"
              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-sky-400 hover:text-sky-300 transition"
            >
              <i className="fa-solid fa-user-shield"></i>
              Administrator Login
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-7">
          <p className="text-xs text-slate-500">
            © 2026 AIMAP · Academic Information Management System
          </p>

          <Link
            href="/imprint"
            className="inline-block text-xs text-slate-500 hover:text-sky-400 mt-3 transition"
          >
            Imprint & Disclaimer
          </Link>
        </div>

      </div>
    </main>
  );
}
