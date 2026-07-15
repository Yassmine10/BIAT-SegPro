'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ApiError } from '@/types';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
    } catch (err) {
      let detail = 'Invalid email or password';
      if (axios.isAxiosError<ApiError>(err) && err.response?.data?.detail) {
        const errorData = err.response.data.detail;
        detail = typeof errorData === 'string'
          ? errorData
          : JSON.stringify(errorData);
      }
      setErrorMsg(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-biat-blue text-white shadow-lg shadow-biat-blue/20">
            <span className="text-2xl font-black tracking-wider">BIAT</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            BIAT SegPro
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Intelligent Customer Segmentation Platform
          </p>
        </div>

        {/* Card Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
            Sign in to your analyst account
          </h3>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-biat-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  placeholder="name@biat.com.tn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-biat-blue hover:text-biat-blue-hover dark:text-sky-400"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`block w-full rounded-lg border pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-biat-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-biat-blue focus:ring-biat-blue"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300 select-none cursor-pointer"
              >
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-lg bg-biat-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-biat-blue-hover focus:outline-none focus:ring-2 focus:ring-biat-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials Alert */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          <span className="font-semibold text-biat-blue dark:text-sky-400 block mb-1">Demo Credentials:</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Administrator:</span>
              <p>Email: admin@biat.com.tn</p>
              <p>Password: admin1234</p>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Analyst:</span>
              <p>Email: analyst@biat.com.tn</p>
              <p>Password: analyst1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
