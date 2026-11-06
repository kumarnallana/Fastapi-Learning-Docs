import type { Department, Employee, EmployeeCreateInput, EmployeeUpdateInput, SystemHealth } from '../types';
import { FALLBACK_DEPARTMENTS, FALLBACK_EMPLOYEES } from '../data/fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class ApiClient {
  private baseUrl: string;
  private localEmployees: Employee[] = [...FALLBACK_EMPLOYEES];
  private localDepartments: Department[] = [...FALLBACK_DEPARTMENTS];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<SystemHealth> {
    try {
      const res = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Health check returned status ${res.status}`);
      }
      const data = await res.json();
      return {
        message: data.message || 'FastAPI Service Operational',
        docs_url: data.docs_url || '/docs',
        connected: true,
      };
    } catch {
      return {
        message: 'Backend Offline (Using Built-in In-Memory Dataset)',
        docs_url: '/docs',
        connected: false,
      };
    }
  }

  async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch(`${this.baseUrl}/departments`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch departments: ${res.statusText}`);
      }
      return await res.json();
    } catch {
      return this.localDepartments;
    }
  }

  async createDepartment(payload: { name: string }): Promise<Department> {
    try {
      const res = await fetch(`${this.baseUrl}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create department');
      }
      return await res.json();
    } catch (e: any) {
      if (e?.message && !e.message.includes('fetch')) throw e;
      const newDept: Department = {
        id: Math.max(...this.localDepartments.map((d) => d.id), 0) + 1,
        name: payload.name,
      };
      this.localDepartments.push(newDept);
      return newDept;
    }
  }

  async getEmployees(skip = 0, limit = 100): Promise<Employee[]> {
    try {
      const res = await fetch(`${this.baseUrl}/employees?skip=${skip}&limit=${limit}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.statusText}`);
      }
      return await res.json();
    } catch {
      return this.localEmployees.slice(skip, skip + limit);
    }
  }

  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const res = await fetch(`${this.baseUrl}/employees/${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Employee #${id} not found`);
      }
      return await res.json();
    } catch {
      const match = this.localEmployees.find((e) => e.id === id);
      if (!match) throw new Error(`Employee #${id} not found`);
      return match;
    }
  }

  async createEmployee(payload: EmployeeCreateInput): Promise<Employee> {
    try {
      const res = await fetch(`${this.baseUrl}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create employee');
      }
      return await res.json();
    } catch (e: any) {
      if (e?.message && !e.message.includes('fetch')) throw e;
      const dept = this.localDepartments.find((d) => d.id === payload.department_id);
      const newEmp: Employee = {
        id: Math.max(...this.localEmployees.map((e) => e.id), 100) + 1,
        name: payload.name,
        role: payload.role,
        experience: payload.experience,
        salary: payload.salary,
        joining_date: payload.joining_date,
        department_id: payload.department_id,
        departments: dept || null,
      };
      this.localEmployees.unshift(newEmp);
      return newEmp;
    }
  }

  async updateEmployee(id: number, payload: EmployeeUpdateInput): Promise<Employee> {
    try {
      const res = await fetch(`${this.baseUrl}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to update employee #${id}`);
      }
      return await res.json();
    } catch (e: any) {
      if (e?.message && !e.message.includes('fetch')) throw e;
      const index = this.localEmployees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error(`Employee #${id} not found`);
      const dept = this.localDepartments.find((d) => d.id === payload.department_id);
      const updated: Employee = {
        id,
        ...payload,
        departments: dept || null,
      };
      this.localEmployees[index] = updated;
      return updated;
    }
  }

  async deleteEmployee(id: number): Promise<Employee> {
    try {
      const res = await fetch(`${this.baseUrl}/employees/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete employee #${id}`);
      }
      return await res.json();
    } catch (e: any) {
      if (e?.message && !e.message.includes('fetch')) throw e;
      const index = this.localEmployees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error(`Employee #${id} not found`);
      const [deleted] = this.localEmployees.splice(index, 1);
      return deleted;
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
