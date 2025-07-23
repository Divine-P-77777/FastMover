'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';

interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      await signUp(data.email, data.password, data.username);
      toast({
        title: '🎉 Account Created',
        description: 'You can now login to your dashboard',
      });
      reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Signup Failed',
        description: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const baseInputClass =
    'pl-10 border rounded-md w-full py-2 focus:outline-none transition duration-200';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const inputBg = isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300';
  const formBg = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const headingColor = isDarkMode ? 'text-white' : 'text-gray-800';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${formBg} p-6 rounded-xl shadow-md max-w-md w-full mx-auto`}
    >
      <h2 className={`text-2xl font-semibold text-center ${headingColor}`}>
        Create Your Account
      </h2>

      {/* Username */}
      <div className="space-y-1">
        <label htmlFor="username" className={`text-sm font-medium ${labelColor}`}>
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            placeholder="Choose a username"
            className={`${baseInputClass} ${inputBg} ${placeholderColor}`}
            {...register('username', {
              required: 'Username is required',
              pattern: {
                value: /^[A-Za-z0-9_]{3,16}$/,
                message: '3-16 characters. Letters, numbers, underscores only.',
              },
            })}
          />
        </div>
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className={`text-sm font-medium ${labelColor}`}>
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`${baseInputClass} ${inputBg} ${placeholderColor}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className={`text-sm font-medium ${labelColor}`}>
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className={`${baseInputClass} ${inputBg} ${placeholderColor}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters required',
              },
            })}
          />
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
