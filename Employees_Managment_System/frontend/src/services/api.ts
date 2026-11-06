import type { Department, Employee, EmployeeCreateInput, EmployeeUpdateInput, SystemHealth } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class ApiClient {
  private baseUrl: string;

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
        message: 'Backend Offline / Unreachable',
        docs_url: '/docs',
        connected: false,
      };
    }
  }

  async getDepartments(): Promise<Department[]> {
    const res = await fetch(`${this.baseUrl}/departments`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch departments: ${res.statusText}`);
    }
    return res.json();
  }

  async getEmployees(skip = 0, limit = 100): Promise<Employee[]> {
    const res = await fetch(`${this.baseUrl}/employees?skip=${skip}&limit=${limit}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch employees: ${res.statusText}`);
    }
    return res.json();
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const res = await fetch(`${this.baseUrl}/employees/${id}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Employee #${id} not found`);
    }
    return res.json();
  }

  async createEmployee(payload: EmployeeCreateInput): Promise<Employee> {
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
    return res.json();
  }

  async updateEmployee(id: number, payload: EmployeeUpdateInput): Promise<Employee> {
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
    return res.json();
  }

  async deleteEmployee(id: number): Promise<Employee> {
    const res = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to delete employee #${id}`);
    }
    return res.json();
  }
}

export const api = new ApiClient(API_BASE_URL);

