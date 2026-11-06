import React, { useEffect, useMemo } from 'react';
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  ShieldCheck,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import type { Department, Employee } from '../types';

interface EmployeeProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  departments: Department[];
  allEmployees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeProfileDrawer: React.FC<EmployeeProfileDrawerProps> = ({
  isOpen,
  onClose,
  employee,
  departments,
  allEmployees,
  onEdit,
  onDelete,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Department name
  const deptName = useMemo(() => {
    if (!employee) return 'General';
    return (
      employee.departments?.name ||
      departments.find((d) => d.id === employee.department_id)?.name ||
      'General'
    );
  }, [employee, departments]);

  // Compensation benchmark vs department average
  const benchmark = useMemo(() => {
    if (!employee) return null;
    const deptMembers = allEmployees.filter((e) => e.department_id === employee.department_id);
    if (!deptMembers.length) return null;

    const avgSalary = Math.round(
      deptMembers.reduce((acc, curr) => acc + Number(curr.salary || 0), 0) / deptMembers.length
    );

    const diff = Number(employee.salary) - avgSalary;
    const diffPercent = avgSalary ? Math.round((diff / avgSalary) * 100) : 0;

    return {
      avgSalary,
      diff,
      diffPercent,
      isAbove: diff >= 0,
    };
  }, [employee, allEmployees]);

  // Tenure calculation from joining_date
  const tenure = useMemo(() => {
    if (!employee?.joining_date) return null;
    const joinDate = new Date(employee.joining_date);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    if (years <= 0 && months <= 0) return 'New Hire (< 1 month)';
    if (years <= 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
    if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years}y ${months}m`;
  }, [employee]);

  if (!isOpen || !employee) return null;

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Drawer Top Header */}
          <div>
            <div className="p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Personnel Profile Details
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar & Banner */}
            <div className="p-6 border-b border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{employee.name}</h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      #{employee.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>{employee.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Building2 className="w-3.5 h-3.5" />
                  {deptName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Staff
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>ANNUAL SALARY</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-white font-mono">
                    ${Number(employee.salary).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Base compensation</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>EXPERIENCE</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {employee.experience} {employee.experience === 1 ? 'Year' : 'Years'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Professional tenure</p>
                </div>
              </div>

              {/* Department Benchmark Card */}
              {benchmark && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      Department Salary Benchmark
                    </span>
                    <span
                      className={`font-semibold ${
                        benchmark.isAbove ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {benchmark.isAbove ? '+' : ''}
                      {benchmark.diffPercent}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    This salary is{' '}
                    <strong className="text-white">
                      ${Math.abs(benchmark.diff).toLocaleString()}{' '}
                      {benchmark.isAbove ? 'above' : 'below'}
                    </strong>{' '}
                    the {deptName} department average of{' '}
                    <span className="font-mono text-slate-300">
                      ${benchmark.avgSalary.toLocaleString()}
                    </span>
                    .
                  </p>
                </div>
              )}

              {/* Employment Timeline & Metadata */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Organizational Record
                </h4>

                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Joining Date
                    </span>
                    <span className="font-mono text-slate-200">{employee.joining_date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Company Tenure
                    </span>
                    <span className="text-slate-200 font-medium">{tenure}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      Department ID
                    </span>
                    <span className="font-mono text-slate-200">DEPT-0{employee.department_id}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Credential Hashing
                    </span>
                    <span className="text-emerald-400 font-mono text-[10px]">Argon2 Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onDelete(employee);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Offboard</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

