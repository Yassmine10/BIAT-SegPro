'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Settings,
  BrainCircuit,
  Binary,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['Administrator', 'Retail Banking Analyst'] },
    { name: 'Segments', href: '#', icon: Users, roles: ['Administrator', 'Retail Banking Analyst'] },
    { name: 'Simulations', href: '#', icon: Binary, roles: ['Administrator', 'Retail Banking Analyst'] },
    { name: 'AI Insights', href: '#', icon: BrainCircuit, roles: ['Administrator', 'Retail Banking Analyst'] },
    { name: 'User Management', href: '/dashboard/users', icon: Settings, roles: ['Administrator'] },
  ];

  // Helper to filter nav links by role
  const allowedNavItems = navItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  // Generate simple breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(p => p);
    return [
      { name: 'Home', href: '/' },
      ...parts.map((part, idx) => ({
        name: part.charAt(0).toUpperCase() + part.slice(1),
        href: '/' + parts.slice(0, idx + 1).join('/'),
      })),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transform lg:translate-x-0 lg:static lg:h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-biat-blue flex items-center justify-center text-white font-bold text-sm">
              BIAT
            </div>
            <span className="font-extrabold text-white text-lg tracking-wider">SegPro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-biat-blue text-white'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (User Profile & Logout) */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.href}>
                  {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {bc.name}
                    </span>
                  ) : (
                    <Link href={bc.href} className="hover:text-biat-blue">
                      {bc.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 relative">
              <span className="absolute top-1 right-1 h-2 w-2 bg-biat-orange rounded-full animate-pulse" />
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Initials/Avatar */}
            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.first_name} {user.last_name}
                </span>
                <div className="h-8 w-8 rounded-full bg-biat-blue/10 text-biat-blue font-bold flex items-center justify-center text-xs dark:bg-sky-500/10 dark:text-sky-400">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Pages scrollable viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
