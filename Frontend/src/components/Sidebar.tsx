import {
  BriefcaseBusiness,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";



export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-gray-800 text-slate-300 lg:flex">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
          <Users size={22} />
        </div>
        <div>
          <p className="font-bold tracking-tight text-white">EMP Management</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <nav aria-label="Main navigation" className="space-y-1">
          <div
            aria-current="page"
            className="flex items-center gap-3 rounded-xl bg-indigo-500/15 px-3 py-3 text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-400/20"
          >
            <Users size={18} />
            Employees
          </div>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400 font-bold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Admin User</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
