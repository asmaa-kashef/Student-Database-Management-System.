
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      let data: { error?: string; redirectTo?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response. Please try again.');
      }

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      setPassword('');

      const redirectTo =
        data.redirectTo === '/maintenance/dashboard'
          ? data.redirectTo
          : '/maintenance/dashboard';

      router.replace(redirectTo);
      router.refresh();

    } catch (err) {
      console.error('LOGIN REQUEST ERROR:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="mb-6">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-sky-400 transition"
          >
            â† Back to Main Dashboard
          </Link>
        </div>

        <div className="bg-[#111723] border border-[#212d40] rounded-2xl p-8 shadow-xl">

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#172b43] border border-[#254568] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v3h8z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white">
              Administrator Login
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Sign in to access the Database Maintenance Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-slate-300 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter administrator username"
                autoComplete="username"
                required
                disabled={loading}
                className="w-full bg-[#0b0f17] border border-[#29364b] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-sky-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full bg-[#0b0f17] border border-[#29364b] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-sky-500 transition disabled:opacity-50"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-950/40 border border-red-800/60 rounded-lg px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition shadow-lg shadow-sky-950/30"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>

          <div className="mt-7 pt-5 border-t border-[#212d40] text-center">
            <p className="text-xs text-slate-500">
              Restricted access Â· Authorized administrators only
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Database Management System
        </p>

      </div>
    </main>
  );
}

