import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  Plus,
  RefreshCw,
  Server,
  Sparkles,
  Users,
} from 'lucide-react';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EditEmployeeModal } from './components/EditEmployeeModal';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { api } from './services/api';
import type { Department, Employee, SystemHealth } from './types';

export default function App() {
  const [health, setHealth] = useState<SystemHealth>({
    message: 'Checking backend status...',
    docs_url: '/docs',
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'departments'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleEmployeeCreated = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    setToastMessage(`Successfully registered ${newEmp.name} (ID: #${newEmp.id})`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleEmployeeUpdated = (updatedEmp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    setToastMessage(`Updated profile for ${updatedEmp.name} (ID: #${updatedEmp.id})`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleEmployeeDeleted = (deletedId: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== deletedId));
    setToastMessage(`Removed employee record #${deletedId} from directory`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    const healthResult = await api.checkHealth();
    setHealth(healthResult);

    try {
      const [depts, emps] = await Promise.all([
        api.getDepartments(),
        api.getEmployees(0, 100),
      ]);
      setDepartments(depts);
      setEmployees(emps);
    } catch {
      // API fallback handles safety
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute key statistics for overview
  const totalPayroll = employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);
  const avgSalary = employees.length ? Math.round(totalPayroll / employees.length) : 0;
  const avgExperience = employees.length
    ? (employees.reduce((acc, curr) => acc + curr.experience, 0) / employees.length).toFixed(1)
    : '0';

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
          <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
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
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {employees.length}
              </span>
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
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {departments.length}
              </span>
            </button>
          </nav>

          {/* Status Indicator & Live Actions */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                health.connected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  health.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {health.connected ? 'FastAPI Online' : 'In-Memory Mode'}
              </span>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              title="Refresh Data & Backend Ping"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Member</span>
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
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Banner Section */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enterprise Workforce Dashboard</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Scalable Employee Management System
                </h1>
                <p className="text-base text-slate-400 leading-relaxed">
                  Real-time workforce intelligence powered by FastAPI and PostgreSQL backend with a
                  high-performance React &amp; Tailwind CSS interface.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('employees')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <span>Explore Employee Directory</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('departments')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>View Departments</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Key Metric Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Headcount
                  </span>
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {employees.length}
                  </span>
                  <span className="text-xs text-slate-400">active staff</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Across {departments.length} departments</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Average Salary
                  </span>
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    ${avgSalary.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/yr</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Total payroll: ${(totalPayroll / 1000000).toFixed(2)}M
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Avg Experience
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{avgExperience}</span>
                  <span className="text-xs text-slate-400">years</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Senior technical workforce</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Backend Connection
                  </span>
                  <Server className="w-5 h-5 text-sky-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {health.connected ? '200 OK' : 'Local Seed'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">{health.message}</p>
              </div>
            </section>

            {/* Quick Preview of Employee Directory */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Workforce Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live searchable database of registered company personnel
                  </p>
                </div>
              </div>

              <EmployeeDirectory
                employees={employees}
                departments={departments}
                loading={loading}
                onRefresh={fetchData}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onEditEmployee={(emp) => setEditingEmployee(emp)}
                onDeleteEmployee={(emp) => setDeletingEmployee(emp)}
              />
            </section>
          </div>
        )}

        {/* Tab 2: Full Employee Directory View */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Personnel Directory</h1>
              <p className="text-sm text-slate-400">
                Search, filter by department, inspect compensation, and navigate workforce records.
              </p>
            </div>
            <EmployeeDirectory
              employees={employees}
              departments={departments}
              loading={loading}
              onRefresh={fetchData}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onEditEmployee={(emp) => setEditingEmployee(emp)}
              onDeleteEmployee={(emp) => setDeletingEmployee(emp)}
            />
          </div>
        )}

        {/* Tab 3: Departments View */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Departments Overview</h1>
              <p className="text-sm text-slate-400">
                Departmental breakdown and headcount distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => {
                const deptEmployees = employees.filter((e) => e.department_id === dept.id);
                const deptPayroll = deptEmployees.reduce(
                  (acc, curr) => acc + Number(curr.salary || 0),
                  0
                );

                return (
                  <div
                    key={dept.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 hover:border-slate-700/80 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-slate-500">DEPT-0{dept.id}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {deptEmployees.length} registered {deptEmployees.length === 1 ? 'member' : 'members'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Dept Payroll</span>
                      <span className="font-mono font-semibold text-emerald-400">
                        ${deptPayroll.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departments={departments}
        onEmployeeCreated={handleEmployeeCreated}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={Boolean(editingEmployee)}
        employee={editingEmployee}
        departments={departments}
        onClose={() => setEditingEmployee(null)}
        onEmployeeUpdated={handleEmployeeUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEmployee)}
        employee={deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onDeleted={handleEmployeeDeleted}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Enterprise Employee Management System • Full-Stack Production Architecture
      </footer>
    </div>
  );
}
