'use client';

import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';

// Dynamically import components (for better SSR handling)
const LoginForm = dynamic(() => import('./Auth/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('./Auth/SignUpForm'), { ssr: false });
const ForgotPasswordForm = dynamic(() => import('./Auth/ForgotPasswordForm'), { ssr: false });
const AdminLoginForm = dynamic(() => import('./Auth/AdminLoginForm'), { ssr: false });

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [tab, setTab] = useState<'login' | 'signup' | 'admin'>('login');

  useEffect(() => {
    if (loading) return;

    if (user) {
      const role = user?.user_metadata?.role;

      if (role === 'admin') {
        redirect('/admin');
      } else if (role === 'driver') {
        redirect('/driver/dashboard');
      } else {
        redirect('/client/dashboard');
      }
    }
  }, [user, loading]);

  return (
    <div className={`min-h-screen py-10 px-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to FastMover</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Book transport, track deliveries, and manage logistics with ease.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between mb-4 border rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => setTab('admin')}
          >
            Admin
          </button>
        </div>

        {tab === 'login' && <LoginForm />}
        {tab === 'signup' && <SignUpForm />}
        {tab === 'admin' && <AdminLoginForm />}

        <div className="mt-6">
          <ForgotPasswordForm
            direction="col"
            className="w-full"
            email=""
            cancelText="Cancel"
            submitText="Send"
          />
        </div>
      </div>
    </div>
  );
}
