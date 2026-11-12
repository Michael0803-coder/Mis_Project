
import React, { useState, useMemo } from "react";

// --- Inline SVG Icons (No external lucide-react dependency needed) ---
function SearchIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PlusIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function UsersIcon({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// --- Mock Initial Data ---
const INITIAL_STUDENTS = [
  {
    id: "STU-1001",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.edu",
    program: "Computer Science",
    yearLevel: "3rd Year",
    status: "Enrolled",
    attendance: "Present",
  },
  {
    id: "STU-1002",
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@example.edu",
    program: "Information Technology",
    yearLevel: "1st Year",
    status: "Pending",
    attendance: "Late",
  },
  {
    id: "STU-1003",
    firstName: "Carlos",
    lastName: "Reyes",
    email: "carlos.r@example.edu",
    program: "Business Administration",
    yearLevel: "2nd Year",
    status: "Inactive",
    attendance: "Absent",
  },
];

// --- Helper Functions ---
function fullName(student) {
  if (!student) return "";
  if (student.firstName || student.lastName) {
    return `${student.firstName || ""} ${student.lastName || ""}`.trim();
  }
  return student.name || "";
}

// --- Sub-Components ---
export function StatusBadge({ status }) {
  const badgeStyles = {
    Enrolled: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Late: "bg-amber-50 text-amber-700 border-amber-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const style = badgeStyles[status] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}>
      {status || "N/A"}
    </span>
  );
}

export function CustomStyles() {
  return (
    <style>{`
      .form-input {
        display: block;
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.75rem;
        background: white;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        outline: none;
      }
      .form-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px #dbeafe;
      }
      @media print {
        aside, header, button, .print\\:hidden { display: none !important; }
        main { width: 100%; }
        body { background: white; }
      }
    `}</style>
  );
}

export function FormField({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function QuickAction({ icon: Icon, title, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {Icon ? <Icon size={19} /> : <PlusIcon size={19} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">{title}</span>
        <span className="mt-1 block text-xs text-slate-500">{detail}</span>
      </span>
      <PlusIcon size={16} className="text-slate-400" />
    </button>
  );
}

export function StudentFilters({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, number, or program..."
          className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        <option value="All statuses">All statuses</option>
        <option value="Enrolled">Enrolled</option>
        <option value="Pending">Pending</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}

export function StudentTable({ students = [], onStatusChange }) {
  if (!students || students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
        <UsersIcon size={26} className="mx-auto text-slate-300" />
        <p className="mt-2 text-sm font-semibold text-slate-700">No students found</p>
        <p className="mt-1 text-xs text-slate-500">Try changing your search or status filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-3 font-semibold">Student</th>
            <th className="px-3 py-3 font-semibold">Program / Year</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-3 py-3 font-semibold">Attendance</th>
            <th className="px-3 py-3 font-semibold">Update status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50/70">
              <td className="px-3 py-4">
                <p className="font-semibold text-slate-900">{fullName(student)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {student.id} · {student.email}
                </p>
              </td>
              <td className="px-3 py-4">
                <p className="text-slate-700">{student.program}</p>
                <p className="mt-1 text-xs text-slate-500">{student.yearLevel}</p>
              </td>
              <td className="px-3 py-4">
                <StatusBadge status={student.status} />
              </td>
              <td className="px-3 py-4">
                <StatusBadge status={student.attendance} />
              </td>
              <td className="px-3 py-4">
                <select
                  aria-label={`Update status for ${fullName(student)}`}
                  value={student.status}
                  onChange={(e) => onStatusChange && onStatusChange(student, e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Main App / Exported Container ---
export default function StudentManagement() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const handleStatusChange = (targetStudent, newStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === targetStudent.id ? { ...s, status: newStatus } : s))
    );
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        fullName(student).toLowerCase().includes(searchLower) ||
        student.id.toLowerCase().includes(searchLower) ||
        student.program.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "All statuses" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <CustomStyles />
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
        <p className="text-sm text-slate-500">Manage student records and track status updates.</p>
      </header>

      <StudentFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <StudentTable
        students={filteredStudents}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}