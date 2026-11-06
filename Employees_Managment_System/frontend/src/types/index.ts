export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  experience: number;
  salary: number;
  joining_date: string;
  department_id: number;
  departments?: Department | null;
}

export interface EmployeeCreateInput {
  name: string;
  role: string;
  experience: number;
  salary: number;
  department_id: number;
  joining_date: string;
  password: string;
}

export interface EmployeeUpdateInput {
  name: string;
  role: string;
  experience: number;
  salary: number;
  department_id: number;
  joining_date: string;
}

export interface SystemHealth {
  message: string;
  docs_url: string;
  connected: boolean;
  employeeCount?: number;
  departmentCount?: number;
}

