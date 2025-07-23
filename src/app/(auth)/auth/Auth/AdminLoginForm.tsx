'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';



const AdminLoginForm = () => {
  const { signInAsAdmin, resetPassword } = useAuth();
  const router = useRouter();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await signInAsAdmin(email, password);
      setMessage('Login successful!');
      router.push('/admin');

    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-xl p-8 transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-black'
                  }`}
              />
            </div>
          </div>

          {/* Password */}
          {!isResetting && (
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-black'
                    }`}
                />
              </div>
            </div>
          )}

          {/* Message/Error */}
          {(error || message) && (
            <p className={`text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
              {error || message}
            </p>
          )}

          {/* Action Buttons */}
          {!isResetting ? (
            <>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-2 font-semibold rounded-lg bg-cyan-400 text-white hover:bg-cyan-500 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Login
              </button>
              <p
                className="text-center text-sm mt-3 cursor-pointer underline text-cyan-400 hover:text-cyan-500"
                onClick={() => setIsResetting(true)}
              >
                Forgot Password?
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-2 font-semibold rounded-lg bg-cyan-400 text-white hover:bg-cyan-500 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Reset Link
              </button>
              <p
                className="text-center text-sm mt-3 cursor-pointer underline text-cyan-400 hover:text-cyan-500"
                onClick={() => setIsResetting(false)}
              >
                Back to Login
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
