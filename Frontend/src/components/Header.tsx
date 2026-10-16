import { Users } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 lg:hidden">
          <Users size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-400">Hello</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">Welome to EMP Management</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:block">
          Admin User
        </span>
        <div
          aria-label="Admin User"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700"
        >
          AD
        </div>
      </div>
    </header>
  );
}
