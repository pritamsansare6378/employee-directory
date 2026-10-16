import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, X } from "lucide-react";
import type { Employee, EmployeeInput } from "../types/employee";
import { getErrorMessage } from "../utils/employeeUtils";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Project Manager",
  "DevOps Engineer",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (data: EmployeeInput) => Promise<void>;
}

export default function EmployeeModal({
  employee,
  onClose,
  onSave,
}: EmployeeModalProps) {
  const [name, setName] = useState(employee?.name ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [role, setRole] = useState(employee?.role ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, saving]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        role,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="employee-modal-title" className="text-lg font-bold text-slate-900">
              {employee ? "Edit employee" : "Add new employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {employee
                ? "Update the employee's information."
                : "Enter the details to add a team member."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="employee-name" className="text-sm font-medium text-slate-700">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              id="employee-name"
              autoFocus
              required
              minLength={2}
              maxLength={100}
              pattern=".*\S.*"
              title="Please enter the employee's name."
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="employee-email" className="text-sm font-medium text-slate-700">
              Email address <span className="text-rose-500">*</span>
            </label>
            <input
              id="employee-email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="rahul@company.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="employee-role" className="text-sm font-medium text-slate-700">
              Job role <span className="text-rose-500">*</span>
            </label>
            <select
              id="employee-role"
              required
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select a role</option>
              {roles.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
              {role && !roles.includes(role) && <option value={role}>{role}</option>}
            </select>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              {employee ? "Save changes" : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
