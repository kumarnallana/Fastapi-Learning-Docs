import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  DollarSign,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'headcount' | 'payroll' | 'avgSalary' | 'name'>('headcount');
  const [filterTier, setFilterTier] = useState<'all' | 'high_budget' | 'large_teams'>('all');

  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);

  // Overall organization company min/max salary for scaling visualization tracks
  const allSalaries = employees.map((e) => Number(e.salary || 0)).filter((s) => s > 0);
  const companyMinSalary = allSalaries.length ? Math.min(...allSalaries) : 50000;
  const companyMaxSalary = allSalaries.length ? Math.max(...allSalaries) : 500000;
  const salarySpan = Math.max(companyMaxSalary - companyMinSalary, 1);

  // Compute enriched metrics for each department
  const enrichedDepartments = useMemo(() => {
    return departments.map((dept) => {
      const deptMembers = employees.filter((e) => e.department_id === dept.id);
      const deptPayroll = deptMembers.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);
      const avgSalary = deptMembers.length ? Math.round(deptPayroll / deptMembers.length) : 0;
      const sharePercentage = totalEmployees
        ? ((deptMembers.length / totalEmployees) * 100).toFixed(1)
        : '0';
      const payrollPercentage = totalPayroll
        ? ((deptPayroll / totalPayroll) * 100).toFixed(1)
        : '0';

      const deptSalaries = deptMembers.map((m) => Number(m.salary || 0)).filter((s) => s > 0);
      const minSalary = deptSalaries.length ? Math.min(...deptSalaries) : 0;
      const maxSalary = deptSalaries.length ? Math.max(...deptSalaries) : 0;

      const avgExp = deptMembers.length
        ? (deptMembers.reduce((acc, m) => acc + (m.experience || 0), 0) / deptMembers.length).toFixed(1)
        : '0';

      return {
        ...dept,
        members: deptMembers,
        payroll: deptPayroll,
        avgSalary,
        minSalary,
        maxSalary,
        avgExp,
        sharePercentage,
        payrollPercentage,
      };
    });
  }, [departments, employees, totalEmployees, totalPayroll]);

  // Filter & Sort
  const filteredDepartments = useMemo(() => {
    let result = enrichedDepartments.filter((dept) => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (filterTier === 'high_budget') {
        return dept.payroll >= 500000;
      }
      if (filterTier === 'large_teams') {
        return dept.members.length >= 3;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'headcount') return b.members.length - a.members.length;
      if (sortBy === 'payroll') return b.payroll - a.payroll;
      if (sortBy === 'avgSalary') return b.avgSalary - a.avgSalary;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [enrichedDepartments, searchQuery, filterTier, sortBy]);

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
            Real-time departmental headcount, payroll allocation, and salary dispersion
          </p>
        </div>

        <button
          onClick={onOpenAddDeptModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
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

      {/* Interactive Controls Bar: Search, Quick Filters & Sorter */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments by name..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTier === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All ({departments.length})
          </button>
          <button
            onClick={() => setFilterTier('high_budget')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTier === 'high_budget'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            $500k+ Budget
          </button>
          <button
            onClick={() => setFilterTier('large_teams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTier === 'large_teams'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Large Teams (3+)
          </button>
        </div>

        {/* Sorter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'headcount' | 'payroll' | 'avgSalary' | 'name')
            }
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-950/80 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="headcount">Sort: Headcount (High → Low)</option>
            <option value="payroll">Sort: Payroll (Highest First)</option>
            <option value="avgSalary">Sort: Average Salary</option>
            <option value="name">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Department Cards Grid or Empty Search State */}
      {filteredDepartments.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No departments match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or reset the active filter tier.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterTier('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            // Calculate track positions for salary dispersion
            const minPercent = Math.max(
              0,
              Math.min(100, Math.round(((dept.minSalary - companyMinSalary) / salarySpan) * 100))
            );
            const maxPercent = Math.max(
              minPercent + 5,
              Math.min(100, Math.round(((dept.maxSalary - companyMinSalary) / salarySpan) * 100))
            );
            const avgPercent = Math.max(
              0,
              Math.min(100, Math.round(((dept.avgSalary - companyMinSalary) / salarySpan) * 100))
            );

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
                    <div className="flex items-center gap-1.5">
                      {Number(dept.avgExp) >= 5 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Senior Lead
                        </span>
                      )}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                        DEPT-0{dept.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {dept.members.length} {dept.members.length === 1 ? 'member' : 'members'} •{' '}
                    {dept.sharePercentage}% headcount • {dept.avgExp} yrs avg exp
                  </p>

                  {/* Progress bar representing workforce share */}
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

                  {/* Salary Dispersion Range & Visualizer */}
                  {dept.members.length > 0 && (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-indigo-400" />
                          <span>Salary Range</span>
                        </span>
                        <span className="font-mono text-slate-300 font-semibold text-[10px]">
                          ${(dept.minSalary / 1000).toFixed(0)}k – ${(dept.maxSalary / 1000).toFixed(0)}k
                        </span>
                      </div>

                      {/* Visual Min-Max Range Track with Average Pin */}
                      <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-visible">
                        {/* Range span */}
                        <div
                          className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500/60 to-emerald-500/60"
                          style={{
                            left: `${minPercent}%`,
                            width: `${Math.max(maxPercent - minPercent, 6)}%`,
                          }}
                        />
                        {/* Average indicator pip */}
                        <div
                          title={`Average Salary: $${dept.avgSalary.toLocaleString()}`}
                          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-indigo-500 shadow-md shadow-indigo-500/50 -ml-1.5 transition-all"
                          style={{ left: `${avgPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>${(companyMinSalary / 1000).toFixed(0)}k (Min)</span>
                        <span>${(companyMaxSalary / 1000).toFixed(0)}k (Max)</span>
                      </div>
                    </div>
                  )}

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
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer group-hover:border-slate-700"
                >
                  <span>View Department Directory</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
