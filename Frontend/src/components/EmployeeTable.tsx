import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Mail,
  Pencil,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import type { Employee } from "../types/employee";
import { formatDate, getInitials } from "../utils/employeeUtils";

const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  availableRoles: string[];
  page: number;
  totalPages: number;
  totalFiltered: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  deletingId: number | null;
  onAddFirst: () => void;
}

export default function EmployeeTable({
  employees,
  loading,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  availableRoles,
  page,
  totalPages,
  totalFiltered,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  deletingId,
  onAddFirst,
}: EmployeeTableProps) {
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalFiltered);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="font-bold text-slate-900">All employees</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Search employees by name or email"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-60"
            />
          </div>
          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(event) => onRoleFilterChange(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All roles">All roles</option>
            {availableRoles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Employee</th>
              <th className="px-5 py-4">Job role</th>
              <th className="px-5 py-4">Date added</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm text-slate-500">
                  <LoaderCircle size={24} className="mx-auto mb-3 animate-spin text-indigo-600" />
                  Loading employees...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <UserRound size={23} />
                  </div>
                  <p className="mt-4 font-semibold text-slate-800">No employees found</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {search || roleFilter !== "All roles"
                      ? "Try changing your search or filters."
                      : "Add your first employee to get started."}
                  </p>
                  {!search && roleFilter === "All roles" && (
                    <button onClick={onAddFirst} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                      + Add your first employee
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={employee.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[((page - 1) * pageSize + index) % avatarColors.length]}`}>
                        {getInitials(employee.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{employee.name}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail size={12} />
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700">
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-slate-400" />
                      {formatDate(employee.created_at)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(employee)}
                        aria-label={`Edit ${employee.name}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(employee)}
                        disabled={deletingId === employee.id}
                        aria-label={`Delete ${employee.name}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        {deletingId === employee.id
                          ? <LoaderCircle size={15} className="animate-spin" />
                          : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{start}–{end}</span>
          {" "}of <span className="font-semibold text-slate-700">{totalFiltered}</span> employees
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="px-2 text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
