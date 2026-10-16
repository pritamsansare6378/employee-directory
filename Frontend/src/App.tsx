import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Plus,
  Users,
  X,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeModal from "./components/EmployeeModal";
import ConfirmDialog from "./components/ConfirmDialog";
import { employeeApi } from "./services/employeeApi";
import type { Employee, EmployeeInput } from "./types/employee";
import { getErrorMessage, isAddedWithinLast30Days } from "./utils/employeeUtils";

const PAGE_SIZE = 6;

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  const availableRoles = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.role))).sort(),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term);
      const matchesRole =
        roleFilter === "All roles" || employee.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageEmployees = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const roleCount = availableRoles.length;
  const recentCount = employees.filter((employee) =>
    isAddedWithinLast30Days(employee.created_at),
  ).length;

  function showNotice(message: string) {
    setNotice(message);
    setPageError("");
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(employee: Employee) {
    setEditing(employee);
    setModalOpen(true);
  }

  async function handleSave(payload: EmployeeInput) {
    if (editing) {
      const updated = await employeeApi.update(editing.id, payload);
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === editing.id
            ? { ...employee, ...payload, ...updated }
            : employee,
        ),
      );
      showNotice("Employee updated successfully.");
    } else {
      const created = await employeeApi.create(payload);
      setEmployees((current) => [created, ...current]);
      setSearch("");
      setRoleFilter("All roles");
      setPage(1);
      showNotice("Employee added successfully.");
    }

    setModalOpen(false);
    setEditing(null);
  }

  async function confirmDelete() {
    if (!deleting) return;

    setDeletingBusy(true);
    setPageError("");
    setNotice("");

    try {
      await employeeApi.remove(deleting.id);
      setEmployees((current) =>
        current.filter((employee) => employee.id !== deleting.id),
      );
      showNotice("Employee deleted successfully.");
      setDeleting(null);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Header />

          <div className="mx-auto max-w-[1440px] space-y-7 p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>EMP Management</span>
                  <span>/</span>
                  <span className="text-indigo-600">Employees</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Employee Directory
                </h1>
              </div>
              <button
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700"
              >
                <Plus size={18} strokeWidth={2.5} />
                Add employee
              </button>
            </div>

            {notice && (
              <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 size={17} />
                <span className="flex-1">{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss notification">
                  <X size={16} />
                </button>
              </div>
            )}

            {pageError && (
              <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                <AlertCircle size={18} />
                <span className="flex-1">{pageError}</span>
                <button onClick={() => void loadEmployees()} className="font-semibold underline">
                  Retry
                </button>
                <button onClick={() => setPageError("")} aria-label="Dismiss error">
                  <X size={16} />
                </button>
              </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Total employees"
                value={loading ? "—" : employees.length}
                caption="All registered team members"
                icon={Users}
                colorClass="bg-indigo-50 text-indigo-600"
              />
              <StatCard
                label="Roles represented"
                value={loading ? "—" : roleCount}
                caption="Unique job roles"
                icon={BriefcaseBusiness}
                colorClass="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                label="Recently added"
                value={loading ? "—" : recentCount}
                caption="Added in the last 30 days"
                icon={ArrowUpRight}
                colorClass="bg-amber-50 text-amber-600"
              />
            </section>

            <EmployeeTable
              employees={pageEmployees}
              loading={loading}
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              roleFilter={roleFilter}
              onRoleFilterChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
              availableRoles={availableRoles}
              page={currentPage}
              totalPages={totalPages}
              totalFiltered={filteredEmployees.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onEdit={openEdit}
              onDelete={setDeleting}
              deletingId={deletingBusy ? deleting?.id ?? null : null}
              onAddFirst={openCreate}
            />

            <footer className="flex flex-col gap-1 pb-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            </footer>
          </div>
        </main>
      </div>

      {modalOpen && (
        <EmployeeModal
          key={editing?.id ?? "new"}
          employee={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete employee?"
          message={`Are you sure you want to delete ${deleting.name}? This action cannot be undone.`}
          busy={deletingBusy}
          onCancel={() => {
            if (!deletingBusy) setDeleting(null);
          }}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </div>
  );
}
