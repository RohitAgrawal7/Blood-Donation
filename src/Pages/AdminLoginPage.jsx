import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

function useNextPath() {
  const location = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('next') || '/admin';
  }, [location.search]);
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const nextPath = useNextPath();
  const { isAdmin, login } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate(nextPath, { replace: true });
  }, [isAdmin, navigate, nextPath]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // tiny delay for UX consistency
    await new Promise((r) => setTimeout(r, 250));

    const ok = await login(username, password);
    setIsSubmitting(false);
    if (!ok) {
      setError('Invalid admin username or password.');
      return;
    }

    navigate(nextPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500">Access request approvals</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
              placeholder="Admin@1"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="w-full text-gray-600 hover:text-gray-800 font-semibold underline underline-offset-4"
          >
            Back to Home
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 leading-relaxed">
          Tip: set credentials in <span className="font-mono">.env.local</span> as{' '}
          <span className="font-mono">VITE_ADMIN_USERNAME</span> and{' '}
          <span className="font-mono">VITE_ADMIN_PASSWORD</span>.
        </div>
      </div>
    </div>
  );
}

