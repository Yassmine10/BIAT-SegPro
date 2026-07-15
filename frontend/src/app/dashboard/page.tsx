'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Binary,
  Layers,
  BrainCircuit,
  TrendingUp,
  ArrowUpRight,
  Database,
  Search,
  Filter,
  PlusCircle,
} from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();

  const metrics = [
    {
      name: 'Total Customers',
      value: '0',
      change: '0.0%',
      timeframe: 'vs last month',
      icon: Users,
      color: 'text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
    },
    {
      name: 'Total Simulations',
      value: '0',
      change: '0.0%',
      timeframe: 'vs last month',
      icon: Binary,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50',
    },
    {
      name: 'Segments Created',
      value: '0',
      change: '0.0%',
      timeframe: 'vs last month',
      icon: Layers,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      name: 'AI Insights',
      value: '0',
      change: '0.0%',
      timeframe: 'vs last month',
      icon: BrainCircuit,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-biat-blue dark:text-sky-400">{user?.first_name || 'Analyst'}</span>. Here is the latest customer segmentation activity.
          </p>
        </div>

        {/* Quick action button mock */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-biat-blue px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-biat-blue-hover focus:outline-none transition-all">
            <PlusCircle className="h-4.5 w-4.5" />
            <span>New Segment Simulation</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {metric.name}
                </span>
                <div className={`p-2.5 rounded-xl border ${metric.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {metric.timeframe}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Mockup Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Database Lookup Mock Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Retail Banking Database
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Connect and filter customers for automated AI clustering.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Database className="h-3.5 w-3.5" />
              <span>BIAT-Core Connected</span>
            </span>
          </div>

          {/* Search/Filter bar mockup */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by RIB, ID card, or Name..."
                disabled
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-slate-400 placeholder-slate-400 cursor-not-allowed"
              />
            </div>
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
            >
              <Filter className="h-4.5 w-4.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Empty State visual */}
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
              <Database className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">No Customers Loaded</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs text-center mt-1">
              Connect a source or upload customer profiles to start generating banking segmentation models.
            </p>
          </div>
        </div>

        {/* AI Insight Queue Mock Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  AI Intelligent Queue
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time cluster recommendations.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-900 flex items-start gap-3">
                <div className="h-7 w-7 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
                  <BrainCircuit className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    High Net-Worth Segments
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Ready to generate recommendations from transaction patterns.
                  </p>
                </div>
              </div>
              
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-900 flex items-start gap-3 opacity-60">
                <div className="h-7 w-7 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Agricultural Loan Risks
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Clustering model training pending database update.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-biat-blue dark:text-sky-400">
            <span>Explore AI Modules</span>
            <ArrowUpRight className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
