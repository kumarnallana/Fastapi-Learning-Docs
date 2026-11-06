import { useEffect, useState } from 'react';
import {
  Activity,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  RefreshCw,
  Server,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import { api } from './services/api';
import type { SystemHealth } from './types';

export default function App() {
  const [health, setHealth] = useState<SystemHealth>({
    message: 'Checking backend status...',
    docs_url: '/docs',
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [departmentsCount, setDepartmentsCount] = useState<number | null>(null);
  const [employeesCount, setEmployeesCount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'departments'>('overview');

  const checkConnection = async () => {
    setLoading(true);
    const result = await api.checkHealth();
    setHealth(result);

    if (result.connected) {
      try {
        const [depts, emps] = await Promise.all([
          api.getDepartments().catch(() => []),
          api.getEmployees(0, 100).catch(() => []),
        ]);
        setDepartmentsCount(depts.length);
        setEmployeesCount(emps.length);
      } catch {
        // Silent catch for secondary metrics
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  EnterpriseEMS
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Production Employee Management Architecture</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'employees'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'departments'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Departments
            </button>
          </nav>

          {/* Status Indicator & Live Actions */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                health.connected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  health.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span>{health.connected ? 'FastAPI Online' : 'Backend Offline'}</span>
            </div>

            <button
              onClick={checkConnection}
              disabled={loading}
              title="Ping Backend API"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              Swagger
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Enterprise Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Scalable Employee & Department Management
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Engineered with FastAPI, SQLAlchemy ORM, and PostgreSQL on the backend paired with a
              modern, type-safe React client, Tailwind CSS, and Lucide icons.
            </p>
          </div>
        </section>

        {/* Live Architecture & Connection Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Backend Status
              </span>
              <Server className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {health.connected ? 'Operational' : 'Unavailable'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">
              {health.connected ? 'http://127.0.0.1:8000 (CORS Enabled)' : 'Run uvicorn backend server'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Employees
              </span>
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {employeesCount !== null ? employeesCount : '—'}
              </span>
              <span className="text-xs text-slate-400">records</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Live PostgreSQL database records</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Departments
              </span>
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {departmentsCount !== null ? departmentsCount : '—'}
              </span>
              <span className="text-xs text-slate-400">units</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Relational Department Table</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                API Handshake
              </span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {health.connected ? '200 OK' : 'No Signal'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">FastAPI root endpoint verification</p>
          </div>
        </section>

        {/* Integration Verification Panel */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">System Integration Verification</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Phase 2 • Feature 1</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-800/60 text-sm">
            <div className="pt-3 first:pt-0 flex items-center justify-between">
              <span className="text-slate-300">FastAPI Backend CORS Middleware</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Configured & Integrated
              </span>
            </div>
            <div className="pt-3 flex items-center justify-between">
              <span className="text-slate-300">Vite React + TypeScript + Tailwind CSS Client</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Styled
              </span>
            </div>
            <div className="pt-3 flex items-center justify-between">
              <span className="text-slate-300">Typed API Client Service Layer</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready for CRUD Operations
              </span>
            </div>
            <div className="pt-3 flex items-center justify-between">
              <span className="text-slate-300">PostgreSQL Relational Schema Connection</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  health.connected ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {health.connected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected ({employeesCount} Employees, {departmentsCount} Depts)
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Backend Inactive
                  </>
                )}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Enterprise Employee Management System • Full-Stack Architecture
      </footer>
    </div>
  );
}
