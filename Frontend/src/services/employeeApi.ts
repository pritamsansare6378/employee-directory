import axios from "axios";
import type { Employee, EmployeeInput } from "../types/employee";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
  },

  async create(payload: EmployeeInput): Promise<Employee> {
    const response = await apiClient.post<Employee>("/employees", payload);
    return response.data;
  },

  async update(id: number, payload: EmployeeInput): Promise<Employee> {
    const response = await apiClient.put<Employee>(`/employees/${id}`, payload);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },
};
