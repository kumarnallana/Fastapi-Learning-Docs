import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  DollarSign,
  Plus,
  Users,
} from 'lucide-react';
import type { Department, Employee } from '../types';

interface DepartmentManagerProps {
  departments: Department[];
  employees: Employee[];
  onOpenAddDeptModal: () => void;
  onFilterByDepartment: (deptId: number) => void;
}

export const DepartmentManager: React.FC<DepartmentManagerProps> = ({
  departments,
  employees,
  onOpenAddDeptModal,
  onFilterByDepartment,
}) => {
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);

  // Department analytics calculations
  const departmentsWithStats = departments.map((dept) => {
    const deptMembers = employees.filter((e) => e.department_id === dept.id);
    const deptPayroll = deptMembers.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);
    const avgSalary = deptMembers.length ? Math.round(deptPayroll / deptMembers.length) : 0;
    const sharePercentage = totalEmployees
      ? ((deptMembers.length / totalEmployees) * 100).toFixed(1)
      : '0';

    return {
      ...dept,
      members: deptMembers,
      payroll: deptPayroll,
      avgSalary,
      sharePercentage,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Header with Add Department button */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Organizational Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Departments &amp; Budget Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time departmental headcount, payroll allocation, and roster distribution
          </p>
        </div>

        <button
          onClick={onOpenAddDeptModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>TOTAL DIVISIONS</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{departments.length} Units</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Active organizational departments</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>TOTAL WORKFORCE BUDGET</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            ${(totalPayroll / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Cumulative company compensation</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>HEADCOUNT COVERAGE</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalEmployees} Members</div>
          <p className="text-[11px] text-slate-500 mt-0.5">100% assigned to departments</p>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departmentsWithStats.map((dept) => {
          return (
            <div
              key={dept.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-slate-700/80 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    DEPT-0{dept.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {dept.members.length} {dept.members.length === 1 ? 'member' : 'members'} •{' '}
                  {dept.sharePercentage}% of workforce
                </p>

                {/* Progress bar representing share */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${Math.max(Number(dept.sharePercentage), 4)}%` }}
                  />
                </div>

                {/* Metric Summary */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Payroll</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      ${dept.payroll.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Avg Salary</span>
                    <span className="font-mono font-semibold text-slate-200">
                      ${dept.avgSalary.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Member Preview Avatars */}
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  {dept.members.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {dept.members.slice(0, 4).map((m) => (
                          <div
                            key={m.id}
                            title={`${m.name} - ${m.role}`}
                            className="inline-block w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-slate-900"
                          >
                            {m.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        ))}
                      </div>
                      {dept.members.length > 4 && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          +{dept.members.length - 4} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No team members assigned yet</p>
                  )}
                </div>
              </div>

              {/* View Members in Directory Button */}
              <button
                onClick={() => onFilterByDepartment(dept.id)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              >
                <span>View Department Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
