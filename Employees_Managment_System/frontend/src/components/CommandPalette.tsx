import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Building2,
  Layers,
  Plus,
  Search,
  User,
  Users,
  X,
} from 'lucide-react';
import type { Department, Employee } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  departments: Department[];
  onSelectEmployee: (emp: Employee) => void;
  onSelectDepartment: (deptId: number) => void;
  onNavigateTab: (tab: 'overview' | 'employees' | 'departments') => void;
  onOpenAddEmployee: () => void;
  onOpenAddDepartment: () => void;
  onOpenDiagnostics: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  employees,
  departments,
  onSelectEmployee,
  onSelectDepartment,
  onNavigateTab,
  onOpenAddEmployee,
  onOpenAddDepartment,
  onOpenDiagnostics,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened and reset search
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (!query.trim()) return employees.slice(0, 4);
    const q = query.toLowerCase();
    return employees
      .filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      .slice(0, 6);
  }, [employees, query]);

  // Filter departments
  const filteredDepartments = useMemo(() => {
    if (!query.trim()) return departments.slice(0, 3);
    const q = query.toLowerCase();
    return departments.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 4);
  }, [departments, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
          <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, departments, or quick actions..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Quick Actions
            </div>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenAddEmployee();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Add New Employee</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAddDepartment();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Create New Department</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDiagnostics();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Run System Diagnostics &amp; Latency Test</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('employees');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">View Full Personnel Directory</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Matching Employees */}
          {filteredEmployees.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-between">
                <span>Employees</span>
                <span className="text-[10px] font-mono">{filteredEmployees.length}</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      onClose();
                      onSelectEmployee(emp);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {emp.role} • {emp.departments?.name || 'Department Member'}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400">
                      ${Number(emp.salary).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Departments */}
          {filteredDepartments.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-between">
                <span>Departments</span>
                <span className="text-[10px] font-mono">{filteredDepartments.length}</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredDepartments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      onClose();
                      onSelectDepartment(dept.id);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {dept.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">DEPT-0{dept.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEmployees.length === 0 && filteredDepartments.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              <User className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Navigation:</span>
            <button
              onClick={() => {
                onClose();
                onNavigateTab('overview');
              }}
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              Overview
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateTab('employees');
              }}
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <Users className="w-3 h-3" />
              Directory
            </button>
          </div>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

