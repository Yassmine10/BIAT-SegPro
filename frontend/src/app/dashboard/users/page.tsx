'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/auth';
import { User, ApiError } from '@/types';
import axios from 'axios';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const userCreateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['Administrator', 'Retail Banking Analyst']),
});

type UserCreateValues = z.infer<typeof userCreateSchema>;

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submittingUser, setSubmittingUser] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserCreateValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'Retail Banking Analyst',
    },
  });

  const loadUsers = async () => {
    setLoadingUsers(true);
    setErrorMsg(null);
    try {
      const data = await authService.getUsers();
      setUsersList(data);
    } catch {
      setErrorMsg('Failed to load users list. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'Administrator') {
      loadUsers();
    }
  }, [currentUser]);

  const onSubmit = async (values: UserCreateValues) => {
    setSubmittingUser(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await authService.createUser(values);
      setSuccessMsg(`User ${values.first_name} ${values.last_name} created successfully!`);
      reset();
      loadUsers(); // Refresh the list
    } catch (err) {
      let detail = 'Failed to create user.';
      if (axios.isAxiosError<ApiError>(err) && err.response?.data?.detail) {
        const errorData = err.response.data.detail;
        detail = typeof errorData === 'string'
          ? errorData
          : JSON.stringify(errorData);
      }
      setErrorMsg(detail);
    } finally {
      setSubmittingUser(false);
    }
  };

  // If not admin, block UI access
  if (currentUser && currentUser.role !== 'Administrator') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          You do not have permission to view or manage user accounts. This area is reserved for Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          User Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Create, view, and assign roles to platform operators and retail banking analysts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Users */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-biat-blue" />
              <span>Platform Users</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {usersList.length} Active Accounts
            </span>
          </div>

          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-biat-blue" />
              <p className="text-xs text-slate-500 mt-2">Loading user directory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {usr.first_name} {usr.last_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">{usr.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            usr.role === 'Administrator'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {new Date(usr.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: User Creation Form */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <UserPlus className="h-5 w-5 text-biat-orange" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Create New User
            </h3>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                First Name
              </label>
              <input
                {...register('first_name')}
                type="text"
                className={`mt-1 block w-full rounded-lg border bg-slate-50 dark:bg-slate-850 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                  errors.first_name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="Hamdi"
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Last Name
              </label>
              <input
                {...register('last_name')}
                type="text"
                className={`mt-1 block w-full rounded-lg border bg-slate-50 dark:bg-slate-850 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                  errors.last_name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="Gharbi"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.last_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className={`block w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="hamdi.gharbi@biat.com.tn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className={`block w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                System Role
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-biat-blue/20 transition-all"
              >
                <option value="Retail Banking Analyst">Retail Banking Analyst</option>
                <option value="Administrator">Administrator</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submittingUser}
              className="flex w-full justify-center rounded-lg bg-biat-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-biat-blue-hover focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submittingUser ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create User Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
