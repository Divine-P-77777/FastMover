'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Loader2, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';

interface LoginFormData {
  email?: string;
  username?: string;
  password: string;
}

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get('type') || 'user'; // default to user
  const isPartner = type === 'partner';

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, signInAsDriver } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      if (isPartner) {
        if (!data.username) throw new Error('Username required');
        await signInAsDriver(data.username, data.password);
        alert('Driver login success!');
      } else {
        if (!data.email) throw new Error('Email required');
        await signIn(data.email, data.password);
        alert('Client login success!');
      }
    } catch (error: any) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = () => {
    const next = isPartner ? 'user' : 'partner';
    router.replace(`/auth?type=${next}`);
  };

  const themeColor = isPartner
    ? isDarkMode
      ? 'text-orange-200'
      : 'text-orange-600'
    : isDarkMode
      ? 'text-blue-300'
      : 'text-blue-600';

  const bgButton = isPartner
    ? isDarkMode
      ? 'bg-blue-900'
      : 'bg-blue-400'
    : isDarkMode
      ? 'bg-blue-900'
      : 'bg-blue-500';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-[Inter] b">
      {/* Email / Username */}
      <div className="space-y-2">
        <label htmlFor={isPartner ? 'username' : 'email'} className="sr-only"></label>
        <div className="relative">
          {isPartner ? (
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          ) : (
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          )}
          <Input
            {...register(isPartner ? 'username' : 'email', {
              required: isPartner ? 'Username is required' : 'Email is required',
              ...(isPartner
                ? {}
                : {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }),
            })}
            id={isPartner ? 'username' : 'email'}
            type="text"
            placeholder={isPartner ? 'Username' : 'Email'}
            className={`pl-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="sr-only"></label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            {...register('password', { required: 'Password is required' })}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={`pl-10 pr-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5"
          >
            {showPassword ? (
              <EyeOff className={`h-5 w-5 ${themeColor}`} />
            ) : (
              <Eye className={`h-5 w-5 ${themeColor}`} />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className={`w-full ${bgButton}`} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPartner ? 'Partner Login' : 'Login'}
      </Button>

      {/* Google Button (only for clients) */}
      {!isPartner && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span
                className={`px-3 rounded-4xl ${
                  isDarkMode ? 'bg-black text-orange-200' : 'bg-white text-gray-900'
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="text-sm font-medium">Continue with Google</span>
          </Button>
        </>
      )}

      {/* Switch + Forgot */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={toggleRole}
          className={`underline hover:text-blue-400 ${themeColor}`}
        >
          {isPartner ? 'Are you a customer?' : 'Are you a delivery partner?'}
        </button>
        {!isPartner && (
          <a
            href="/auth/forgot-password"
            className="text-gray-500 hover:underline dark:text-gray-300"
          >
            Forgot Password?
          </a>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
