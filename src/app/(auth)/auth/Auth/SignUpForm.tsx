'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SignUpFormData {
  email: string;
  password: string;
  username: string;
  role: 'client' | 'driver';
}

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      await signUp(data.email, data.password, data.username, data.role);
      toast({
        title: 'Account Created 🎉',
        description: 'You can now login to your dashboard',
      });
      reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed ❌',
        description: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username */}
      <div className="space-y-2">
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            className="pl-10"
            {...register('username', {
              required: 'Username is required',
              pattern: {
                value: /^[A-Za-z0-9_]{3,16}$/,
                message:
                  '3-16 characters. Only letters, numbers, underscores allowed.',
              },
            })}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="pl-10"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters required',
              },
            })}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <label htmlFor="role" className="sr-only">
          Select Role
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <select
            id="role"
            className="w-full border rounded-md px-10 py-2 focus:outline-none focus:ring focus:ring-blue-500 dark:bg-black dark:border-gray-600"
            defaultValue="client"
            {...register('role', {
              required: 'Please select your role',
            })}
          >
            <option value="client">Client</option>
            <option value="driver">Driver</option>
          </select>
        </div>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
