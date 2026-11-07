import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit3,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type { Department, Employee } from '../types';

interface EmployeeDirectoryProps {
  employees: Employee[];
  departments: Department[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAddModal?: () => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employee: Employee) => void;
  onSelectEmployee?: (employee: Employee) => void;
  initialDepartmentId?: string;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  departments,
  loading,
  onRefresh,
  onOpenAddModal,
  onEditEmployee,
  onDeleteEmployee,
  onSelectEmployee,
  initialDepartmentId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDepartmentId || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [tierFilter, setTierFilter] = useState<'all' | 'senior' | 'mid' | 'junior' | 'high_salary' | 'recent'>('all');

  React.useEffect(() => {
    if (initialDepartmentId) {
      setSelectedDeptId(initialDepartmentId);
      setCurrentPage(1);
    }
  }, [initialDepartmentId]);

  const [sortBy, setSortBy] = useState<'name' | 'salary-desc' | 'salary-asc' | 'experience' | 'date'>(
    'name'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Department color palette generator
  const getDeptBadgeStyle = (deptName?: string) => {
    switch (deptName?.toLowerCase()) {
      case 'engineering':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'human resources':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'design':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'product':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'data science':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'infrastructure':
      case 'security':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'finance':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  // Avatar initials and gradient
  const getAvatarGradient = (id: number) => {
    const gradients = [
      'from-indigo-600 to-violet-500',
      'from-cyan-600 to-blue-500',
      'from-emerald-600 to-teal-500',
      'from-rose-600 to-orange-500',
      'from-fuchsia-600 to-pink-500',
      'from-amber-600 to-yellow-500',
    ];
    return gradients[id % gradients.length];
  };

  // Filter & sort pipeline
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesQuery =
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toString().includes(searchQuery);

        const matchesDept =
          selectedDeptId === 'all' || emp.department_id === Number(selectedDeptId);

        let matchesTier = true;
        if (tierFilter === 'senior') matchesTier = emp.experience >= 6;
        if (tierFilter === 'mid') matchesTier = emp.experience >= 3 && emp.experience <= 5;
        if (tierFilter === 'junior') matchesTier = emp.experience <= 2;
        if (tierFilter === 'high_salary') matchesTier = Number(emp.salary) >= 300000;
        if (tierFilter === 'recent') {
          const joinYear = new Date(emp.joining_date).getFullYear();
          matchesTier = joinYear >= 2023;
        }

        return matchesQuery && matchesDept && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'salary-desc') return Number(b.salary) - Number(a.salary);
        if (sortBy === 'salary-asc') return Number(a.salary) - Number(b.salary);
        if (sortBy === 'experience') return b.experience - a.experience;
        if (sortBy === 'date') return new Date(b.joining_date).getTime() - new Date(a.joining_date).getTime();
        return 0;
      });
  }, [employees, searchQuery, selectedDeptId, sortBy, tierFilter]);

  // Pagination calculation
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDeptId('all');
    setTierFilter('all');
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Controls Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by employee name, role, or ID..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter, Sorting, View Switcher & Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Department Dropdown */}
            <div className="relative min-w-[170px]">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="salary-desc">Sort: Salary (High to Low)</option>
              <option value="salary-asc">Sort: Salary (Low to High)</option>
              <option value="experience">Sort: Experience (Max)</option>
              <option value="date">Sort: Join Date (Newest)</option>
            </select>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/70 border border-slate-800 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Data Table View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh directory list"
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Employee Button */}
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Badges / Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Filter Tiers:
          </span>
          {[
            { id: 'all', label: 'All Staff' },
            { id: 'senior', label: 'Senior (6+ yrs)' },
            { id: 'mid', label: 'Mid-Level (3-5 yrs)' },
            { id: 'junior', label: 'Junior (0-2 yrs)' },
            { id: 'high_salary', label: 'High Comp ($300k+)' },
            { id: 'recent', label: 'Recent Hires (2023+)' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                setTierFilter(chip.id as any);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                tierFilter === chip.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}

          {(searchQuery || selectedDeptId !== 'all' || tierFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 font-medium underline-offset-2 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <span className="font-medium text-slate-300">
            Showing <strong className="text-white">{filteredEmployees.length}</strong> of{' '}
            <strong className="text-white">{employees.length}</strong> personnel records
          </span>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Data Grid</span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL CARD GRID */}
      {viewMode === 'grid' && (
        <div>
          {loading ? (
            // Shimmer Card Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-28 h-4 rounded bg-slate-800" />
                      <div className="w-20 h-3 rounded bg-slate-800" />
                    </div>
                  </div>
                  <div className="w-24 h-6 rounded-full bg-slate-800" />
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <div className="w-16 h-8 rounded bg-slate-800" />
                    <div className="w-16 h-8 rounded bg-slate-800 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedEmployees.length === 0 ? (
            // Empty State
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">No personnel found</h3>
                <p className="text-xs text-slate-400">
                  No records match your active query, department, or tier filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            // Interactive Employee Cards Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {paginatedEmployees.map((emp) => {
                const deptName =
                  emp.departments?.name ||
                  departments.find((d) => d.id === emp.department_id)?.name ||
                  'General';

                const initials = emp.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={emp.id}
                    onClick={() => onSelectEmployee?.(emp)}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700/90 p-5 space-y-4 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Avatar, Name & ID */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                              emp.id
                            )} flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform`}
                          >
                            {initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight line-clamp-1">
                              {emp.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                              <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="line-clamp-1">{emp.role}</span>
                            </div>
                          </div>
                        </div>

                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-400 border border-slate-800 shrink-0">
                          #{emp.id}
                        </span>
                      </div>

                      {/* Department Chip & Active Status */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDeptBadgeStyle(
                            deptName
                          )}`}
                        >
                          {deptName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active</span>
                        </div>
                      </div>

                      {/* Metric Boxes */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                            Salary
                          </span>
                          <span className="font-mono font-bold text-sm text-emerald-400 block mt-0.5">
                            ${Number(emp.salary).toLocaleString()}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                            Experience
                          </span>
                          <span className="font-semibold text-sm text-white block mt-0.5">
                            {emp.experience} {emp.experience === 1 ? 'yr' : 'yrs'}
                          </span>
                        </div>
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Joined {emp.joining_date}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300">
                        <span>Profile Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>

                      <div className="flex items-center gap-1.5">
                        {onEditEmployee && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEmployee(emp);
                            }}
                            title={`Edit ${emp.name}`}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:text-indigo-400 text-slate-400 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteEmployee && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEmployee(emp);
                            }}
                            title={`Delete ${emp.name}`}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-rose-950/60 hover:border-rose-800/60 hover:text-rose-400 text-slate-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: HIGH-DENSITY DATA TABLE */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">
                    Compensation
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  // Shimmer Skeleton
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800" />
                          <div className="space-y-1.5">
                            <div className="w-28 h-4 rounded bg-slate-800" />
                            <div className="w-16 h-3 rounded bg-slate-800" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-6 rounded-full bg-slate-800" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32 h-4 rounded bg-slate-800" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-6 rounded-full bg-slate-800" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-20 h-4 rounded bg-slate-800 ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-20 h-4 rounded bg-slate-800 ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-16 h-4 rounded bg-slate-800 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : paginatedEmployees.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-white">No employees found</h3>
                        <p className="text-xs text-slate-400">
                          No team members matched your active search query or department filter.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
                        >
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  paginatedEmployees.map((emp) => {
                    const deptName =
                      emp.departments?.name ||
                      departments.find((d) => d.id === emp.department_id)?.name ||
                      'General';

                    const initials = emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr
                        key={emp.id}
                        onClick={() => onSelectEmployee?.(emp)}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      >
                        {/* Name & ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                                emp.id
                              )} flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                {emp.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">ID: #{emp.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getDeptBadgeStyle(
                              deptName
                            )}`}
                          >
                            {deptName}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-medium">{emp.role}</span>
                          </div>
                        </td>

                        {/* Experience */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                            {emp.experience} {emp.experience === 1 ? 'yr' : 'yrs'}
                          </span>
                        </td>

                        {/* Salary */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1 font-mono font-semibold text-slate-100">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{Number(emp.salary).toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{emp.joining_date}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                            {onEditEmployee && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditEmployee(emp);
                                }}
                                title={`Edit ${emp.name}`}
                                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-indigo-400 text-slate-400 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteEmployee && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteEmployee(emp);
                                }}
                                title={`Delete ${emp.name}`}
                                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-rose-950/60 hover:border-rose-800/60 hover:text-rose-400 text-slate-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
