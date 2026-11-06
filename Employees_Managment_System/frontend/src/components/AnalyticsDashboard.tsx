import React, { useMemo } from 'react';
import { Award, BarChart2, Download, TrendingUp } from 'lucide-react';
import type { Department, Employee } from '../types';

interface AnalyticsDashboardProps {
  employees: Employee[];
  departments: Department[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  employees,
  departments,
}) => {
  // Seniority distribution
  const seniorityStats = useMemo(() => {
    const junior = employees.filter((e) => e.experience <= 2);
    const mid = employees.filter((e) => e.experience >= 3 && e.experience <= 5);
    const senior = employees.filter((e) => e.experience >= 6);

    const calcAvg = (list: Employee[]) =>
      list.length
        ? Math.round(list.reduce((acc, curr) => acc + Number(curr.salary || 0), 0) / list.length)
        : 0;

    return [
      {
        tier: 'Associate / Junior',
        range: '0 - 2 yrs',
        count: junior.length,
        avgSalary: calcAvg(junior),
        color: 'from-blue-500 to-cyan-500',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      },
      {
        tier: 'Mid-Level Specialist',
        range: '3 - 5 yrs',
        count: mid.length,
        avgSalary: calcAvg(mid),
        color: 'from-indigo-500 to-violet-500',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      },
      {
        tier: 'Senior & Staff Leadership',
        range: '6+ yrs',
        count: senior.length,
        avgSalary: calcAvg(senior),
        color: 'from-amber-500 to-orange-500',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      },
    ];
  }, [employees]);

  // Top departments by budget
  const topDepartments = useMemo(() => {
    const totalPayroll = employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);

    return departments
      .map((dept) => {
        const members = employees.filter((e) => e.department_id === dept.id);
        const payroll = members.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);
        const share = totalPayroll ? Math.round((payroll / totalPayroll) * 100) : 0;
        return {
          id: dept.id,
          name: dept.name,
          headcount: members.length,
          payroll,
          share,
        };
      })
      .sort((a, b) => b.payroll - a.payroll)
      .slice(0, 5);
  }, [departments, employees]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (!employees.length) return;

    const headers = ['ID', 'Name', 'Role', 'Department', 'Experience (Years)', 'Salary', 'Joining Date'];
    const rows = employees.map((emp) => {
      const deptName =
        emp.departments?.name ||
        departments.find((d) => d.id === emp.department_id)?.name ||
        'Unassigned';
      return [
        emp.id,
        `"${emp.name.replace(/"/g, '""')}"`,
        `"${emp.role.replace(/"/g, '""')}"`,
        `"${deptName.replace(/"/g, '""')}"`,
        emp.experience,
        emp.salary,
        emp.joining_date,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `workforce_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Workforce Intelligence &amp; Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time compensation distribution, seniority tiering, and operational metrics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!employees.length}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all shadow-md shrink-0 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Workforce CSV</span>
        </button>
      </div>

      {/* Analytics Grid: Seniority Tiers & Department Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Experience & Seniority Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Experience &amp; Seniority Tiers</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{employees.length} total staff</span>
          </div>

          <div className="space-y-3 pt-1">
            {seniorityStats.map((tier) => {
              const percentage = employees.length
                ? Math.round((tier.count / employees.length) * 100)
                : 0;

              return (
                <div
                  key={tier.tier}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{tier.tier}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] border ${tier.badge}`}>
                        {tier.range}
                      </span>
                    </div>
                    <span className="font-mono text-slate-300 font-medium">
                      {tier.count} ({percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Average Compensation</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      ${tier.avgSalary.toLocaleString()} / yr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Top Departments by Budget Share */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Top Division Payroll Allocations</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">By Budget</span>
          </div>

          <div className="space-y-3 pt-1">
            {topDepartments.map((dept, index) => (
              <div
                key={dept.id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px]">
                      0{index + 1}
                    </span>
                    <span className="font-semibold text-white">{dept.name}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">
                    ${dept.payroll.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.max(dept.share, 4)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dept.headcount} team members</span>
                  <span>{dept.share}% of total payroll</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
