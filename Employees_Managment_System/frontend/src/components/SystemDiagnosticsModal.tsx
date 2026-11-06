import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Database,
  ExternalLink,
  Layers,
  RefreshCw,
  Server,
  Shield,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import type { SystemHealth } from '../types';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: SystemHealth;
  totalEmployees: number;
  totalDepartments: number;
  onRefreshData?: () => void;
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  health,
  totalEmployees,
  totalDepartments,
  onRefreshData,
}) => {
  const [latency, setLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const measureLatency = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await api.checkHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      onRefreshData?.();
    } catch {
      setLatency(null);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      measureLatency();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                System Diagnostics &amp; Architecture
              </h2>
              <p className="text-xs text-slate-400">Full-stack technical infrastructure specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Latency & Connectivity Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    health.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="font-semibold text-white">
                  {health.connected ? 'FastAPI Service Online' : 'Offline / In-Memory Dataset Mode'}
                </span>
              </div>
              <button
                onClick={measureLatency}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                <span>Test Latency</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">API Roundtrip Latency</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {latency !== null ? `${latency} ms` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Backend Target</span>
                <span className="text-xs font-mono text-slate-300 truncate block mt-1">
                  http://127.0.0.1:8000
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Stack Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Technical Stack Overview
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <Server className="w-4 h-4" />
                  <span>Backend Framework</span>
                </div>
                <p className="text-slate-300 font-medium">FastAPI &bull; Python 3.14</p>
                <p className="text-[11px] text-slate-500">Pydantic v2 validation, CORS middleware</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>Database Layer</span>
                </div>
                <p className="text-slate-300 font-medium">PostgreSQL &bull; SQLAlchemy 2.0</p>
                <p className="text-[11px] text-slate-500">Psycopg v3 async/sync driver</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-violet-400 font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Authentication &amp; Security</span>
                </div>
                <p className="text-slate-300 font-medium">Argon2id Password Hashing</p>
                <p className="text-[11px] text-slate-500">Salted &bull; Time/Memory hard encryption</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-sky-400 font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>Client Architecture</span>
                </div>
                <p className="text-slate-300 font-medium">React 19 &bull; Vite &bull; Tailwind CSS</p>
                <p className="text-[11px] text-slate-500">TypeScript &bull; Lucide React iconography</p>
              </div>
            </div>
          </div>

          {/* Relational Schema Map */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Relational Schema Architecture</span>
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
              <div className="flex-1 text-center sm:text-left">
                <span className="font-semibold text-white block">Employee_Table</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {totalEmployees} active records
                </span>
              </div>
              <div className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px]">
                FK: department_id &rarr; id
              </div>
              <div className="flex-1 text-center sm:text-right">
                <span className="font-semibold text-white block">Department_Table</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {totalDepartments} active divisions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <span>Open FastAPI Swagger Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
