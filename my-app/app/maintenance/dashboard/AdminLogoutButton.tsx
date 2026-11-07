
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        let message = 'Unable to log out. Please try again.';

        try {
          const result = await response.json();
          if (typeof result.error === 'string') {
            message = result.error;
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      router.replace('/maintenance');
      router.refresh();

    } catch (err) {
      console.error('LOGOUT ERROR:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Server connection failed.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 text-xs rounded-lg border border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-950/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>

      {error && (
        <p
          role="alert"
          className="text-xs text-red-400 mt-2"
        >
          {error}
        </p>
      )}
    </div>
  );
}
