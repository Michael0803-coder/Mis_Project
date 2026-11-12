import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart2,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  LogOut,
  MoreVertical,
  Search,
  Settings,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { logout } from '../../../lib/auth.js';
import CoursesSection from './Courses.jsx';
import ReportsSection from './Reports.jsx';
import SettingsSection from './Settings.jsx';

// Admin dashboard for the MIS project.
// Every row comes from the MySQL database through the PHP API in /api.
// There is no demo/sample data in this file.

// Pending applications (rows still waiting for approval).
const APPLICANTS_ENDPOINT = '/api/student_enrollments.php';
// Approved students copied into official_enrollments.
const OFFICIAL_ENDPOINT = '/api/official_enrollments.php';
// POST endpoint that approves one application.
const APPROVE_ENDPOINT = '/api/approve_enrollment.php';
// POST endpoint that saves a status change from the Edit dialog.
const UPDATE_STATUS_ENDPOINT = '/api/update_enrollment_status.php';

// Convert a student_enrollments row into the shape used by the dashboard tables.
function rowToApplicant(row) {
  const name = [row.first_name, row.middle_name, row.last_name, row.suffix]
    .filter(Boolean)
    .join(' ');

  return {
    id: `APP-${row.enrollment_id}`,
    name,
    email: row.email,
    role: 'Student',
    program: row.program,
    gpa: 'N/A',
    status: row.enrollment_status || 'Pending',
    yearLevel: row.year_level,
    studentType: row.student_type,
    academicYear: row.academic_year,
    semester: row.semester,
    submittedAt: row.created_at,
    // Keep the database ID so the Approve button can send it to the API.
    enrollmentId: row.enrollment_id,
    isApplicant: true,
  };
}

// Convert an official_enrollments row into the shape used by the tables.
// Official students are always shown as Active, which is what the
// "Active Students" card counts.
function officialToUser(row) {
  return {
    id: `OFF-${row.official_id}`,
    enrollmentId: row.enrollment_id,
    name: row.student_name,
    email: row.email,
    role: 'Student',
    program: row.program,
    gpa: 'N/A',
    // approve_enrollment.php writes status "Active" to official_enrollments.
    // Older rows may say "Approved", so both count as Active on the card.
    status: row.status === 'Inactive' ? 'Inactive' : 'Active',
    yearLevel: row.year_level || '',
    academicYear: row.academic_year || '',
    semester: row.semester || '',
    studentType: row.student_type || '',
    enrolledAt: row.enrollment_date,
    isOfficial: true,
  };
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'courses', label: 'Courses & Curricula', icon: BookOpen },
  { id: 'reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const SECTION_DESCRIPTIONS = {
  overview: 'A quick summary of student records, academic activities, and system status.',
  users: 'Review student applicants and accounts loaded from the XAMPP database.',
  courses: 'Manage the course catalog and review program curricula by year level and semester.',
  reports: 'Enrollment trends, program distribution, and exportable operational reports.',
  settings: 'Institution profile, academic term, email delivery, and account security settings.',
};

function InfoCard({ icon: Icon, title, value, detail, tone = 'indigo' }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2 ${tones[tone] || tones.indigo}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'Pending'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-600';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {status === 'Active' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'Inactive' && <XCircle className="h-3 w-3" />}
      {status === 'Pending' && <Activity className="h-3 w-3" />}
      {status}
    </span>
  );
}

function UserTable({ users, onEdit, onApprove }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-slate-900">User Directory</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enrollment applicants loaded from the XAMPP database.
          </p>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
          {users.length} records shown
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Program / Department</th>
              <th className="p-4 font-semibold">GPA</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="font-mono text-xs text-slate-400">{user.id}</p>
                </td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.program}</td>
                <td className="p-4">{user.gpa}</td>
                <td className="p-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 hover:bg-indigo-50"
                    aria-label={`Edit ${user.name}`}
                  >
                    Edit
                  </button>
                  {/* Only pending applicants can be approved. Clicking this
                      calls approveApplicant(), which writes to both tables. */}
                  {user.isApplicant && user.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => onApprove(user)}
                      className="rounded-lg px-3 py-1.5 font-medium text-emerald-600 hover:bg-emerald-50"
                      aria-label={`Approve ${user.name}`}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-sm text-slate-500">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Overview({ users, onEdit, onApprove }) {
  const activeCount = users.filter((user) => user.status === 'Active').length;
  const pendingCount = users.filter((user) => user.status === 'Pending').length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={Users}
          title="Total Users"
          value={users.length}
          detail="Student and faculty accounts"
        />
        <InfoCard
          icon={GraduationCap}
          title="Active Students"
          value={users.filter((user) => user.role === 'Student' && user.status === 'Active').length}
          detail="Across all programs"
          tone="emerald"
        />
        <InfoCard
          icon={CalendarCheck}
          title="Student Applicants"
          value={pendingCount}
          detail="Accounts awaiting review"
          tone="amber"
        />
        <InfoCard
          icon={Activity}
          title="System Status"
          value="Operational"
          detail="PHP + MySQL connected"
          tone="sky"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <UserTable users={users.slice(0, 5)} onEdit={onEdit} onApprove={onApprove} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">System Snapshot</h2>
              <p className="mt-1 text-xs text-slate-500">Example operational indicators</p>
            </div>
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600">Active accounts</span>
                <span className="font-semibold text-slate-900">
                  {activeCount}/{users.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${users.length ? (activeCount / users.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600">Pending approvals</span>
                <span className="font-semibold text-slate-900">{pendingCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-400"
                  style={{ width: `${Math.min(pendingCount * 20, 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
              <p className="font-semibold">Live database</p>
              <p className="mt-1 text-xs leading-5 text-indigo-800">
                Counts and records are read from the mis_project tables through the PHP API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [notice, setNotice] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [applicantsError, setApplicantsError] = useState('');
  const [institution, setInstitution] = useState({
    name: 'Apex Academy',
    shortName: 'Campus MIS',
  });

  const handleSettingsSaved = useCallback((settings) => {
    setInstitution({
      name: settings?.institution_name || 'Apex Academy',
      shortName: settings?.institution_short_name || 'Campus MIS',
    });
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesTerm =
        !term ||
        [user.id, user.name, user.email, user.role, user.program, user.status].some((field) =>
          String(field).toLowerCase().includes(term)
        );
      const matchesRole = roleFilter === 'All roles' || user.role === roleFilter;
      return matchesTerm && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const activeItem = NAV_ITEMS.find((item) => item.id === activeSection) || NAV_ITEMS[0];

  // Loads both lists and merges them into one `users` array.
  const loadDashboardData = useCallback(async () => {
    setApplicantsLoading(true);
    setApplicantsError('');

    try {
      // Fetch pending applications and approved students at the same time.
      const [applicantResponse, officialResponse] = await Promise.all([
        fetch(APPLICANTS_ENDPOINT, { headers: { Accept: 'application/json' } }),
        fetch(OFFICIAL_ENDPOINT, { headers: { Accept: 'application/json' } }),
      ]);

      const applicantResult = await applicantResponse.json();
      const officialResult = await officialResponse.json();

      // Stop if either API returned an error or a non-JSON failure.
      if (!applicantResponse.ok || !applicantResult.success) {
        throw new Error(applicantResult.message || 'Unable to load student applicants.');
      }
      if (!officialResponse.ok || !officialResult.success) {
        throw new Error(officialResult.message || 'Unable to load official students.');
      }

      // Approved students get status "Active".
      const official = (officialResult.data || []).map(officialToUser);

      // An approved applicant still exists in student_enrollments, so skip
      // any application that was already copied into official_enrollments.
      // This prevents the same person appearing twice in the table.
      const officialIds = new Set(official.map((user) => String(user.enrollmentId)));
      const applicants = (applicantResult.data || [])
        .filter((row) => !officialIds.has(String(row.enrollment_id)))
        .map(rowToApplicant);

      // Official (Active) students first, then pending applicants.
      setUsers([...official, ...applicants]);
    } catch (error) {
      setApplicantsError(
        error instanceof Error ? error.message : 'Unable to load dashboard data.'
      );
      setUsers([]);
    } finally {
      setApplicantsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch after the first paint, then refresh when the admin returns to this
    // tab and every 15 seconds so new landing-page applications appear.
    const initial = window.setTimeout(loadDashboardData, 0);
    const interval = window.setInterval(loadDashboardData, 15000);
    window.addEventListener('focus', loadDashboardData);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener('focus', loadDashboardData);
    };
  }, [loadDashboardData]);

  useEffect(() => {
    // Load the institution profile once so the sidebar and footer use the
    // saved System Settings values. A missing session is ignored; the
    // Settings section shows the sign-in error when the admin opens it.
    let cancelled = false;

    fetch('/api/settings.php', {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!cancelled && result?.success && result.data?.settings) {
          handleSettingsSaved(result.data.settings);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [handleSettingsSaved]);

  useEffect(() => {
    // Keep the PHP admin session alive on real user activity without defeating
    // the configured idle timeout. Background polling does not call this.
    let lastPing = 0;

    const pingSession = () => {
      const now = Date.now();

      if (now - lastPing < 60000) return;

      lastPing = now;
      fetch('/api/session_ping.php', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      }).catch(() => {});
    };

    const activityEvents = ['click', 'keydown', 'mousemove', 'touchstart'];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, pingSession, { passive: true })
    );
    pingSession();

    return () => {
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, pingSession)
      );
    };
  }, []);

  // Builds the extra notice text for an approval/status response.
  // When email delivery fails the API returns the temporary password so the
  // administrator can still give it to the student.
  function describeAccountResult(result) {
    const account = result.account;

    if (!account) return '';

    if (account.password_generated) {
      if (result.email_sent) {
        return ` Login credentials were emailed to ${account.email}.`;
      }

      return ` Account created for ${account.email}, but email delivery failed${
        result.email_error ? ` (${result.email_error})` : ''
      }. Give the student this temporary password: ${result.temporary_password}`;
    }

    return ' The student already has a login account.';
  }

  // Saves the Edit dialog status to MySQL. "Active" also creates/updates the
  // official_enrollments row, which is what the Active Students card counts.
  async function saveUser(event) {
    event.preventDefault();
    const user = editingUser;

    if (!user?.enrollmentId) {
      setNotice('This record cannot be edited.');
      window.setTimeout(() => setNotice(''), 3500);
      return;
    }

    try {
      const response = await fetch(UPDATE_STATUS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: user.enrollmentId,
          status: user.status,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to update the status.');
      }

      setEditingUser(null);
      await loadDashboardData();
      setNotice(`${user.name}'s status is now ${user.status}.${describeAccountResult(result)}`);
      // Keep the temporary password visible long enough to copy it.
      window.setTimeout(() => setNotice(''), result.temporary_password ? 30000 : 5000);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to update the status.');
      window.setTimeout(() => setNotice(''), 5000);
    }
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  }

  // Sends one application ID to the approval API. The API updates
  // student_enrollments and inserts into official_enrollments.
  async function approveApplicant(user) {
    if (!user?.isApplicant) return;

    try {
      const response = await fetch(APPROVE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: user.enrollmentId }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Approval failed.');
      }

      // Re-read both lists so "Active Students" increases, the applicant
      // leaves the pending list, and the table updates immediately.
      await loadDashboardData();
      setNotice(`${user.name} is now an official student.${describeAccountResult(result)}`);
      // Keep the temporary password visible long enough to copy it.
      window.setTimeout(() => setNotice(''), result.temporary_password ? 30000 : 5000);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Approval failed.');
      window.setTimeout(() => setNotice(''), 5000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex print:hidden">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Database className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold tracking-tight">{institution.shortName}</p>
            <p className="text-xs text-slate-500">Administration</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Main navigation">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                activeSection === id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-500">Signed in</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 print:pl-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8 print:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white lg:hidden">
              <Database className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{activeItem.label}</p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {SECTION_DESCRIPTIONS[activeSection]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
              Live database
            </span>
            <button
              type="button"
              onClick={() => showNotice('No new notifications.')}
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => showNotice('More actions are not configured.')}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-8 print:p-0">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden">
            <div>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {activeSection === 'overview'
                  ? 'Good morning, Administrator'
                  : activeItem.label}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                {SECTION_DESCRIPTIONS[activeSection]}
              </p>
            </div>
            {(activeSection === 'overview' || activeSection === 'users') && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={applicantsLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                >
                  <Activity className={`h-4 w-4 ${applicantsLoading ? 'animate-pulse' : ''}`} />
                  {applicantsLoading ? 'Refreshing…' : 'Refresh applicants'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('users')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Users className="h-4 w-4" />
                  Review applicants
                </button>
              </div>
            )}
          </div>

          {notice && (
            <div
              role="status"
              className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 print:hidden"
            >
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {applicantsError && activeSection !== 'courses' && activeSection !== 'settings' && (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 print:hidden"
            >
              <span>Could not load dashboard data: {applicantsError}</span>
              <button
                type="button"
                onClick={loadDashboardData}
                className="rounded-lg px-2 py-1 font-semibold hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          )}

          {activeSection === 'overview' && (
            <Overview users={users} onEdit={setEditingUser} onApprove={approveApplicant} />
          )}

          {activeSection === 'users' && (
            <>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Search users</span>
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name, ID, role, or program..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">Filter by role</span>
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-44"
                  >
                    <option>All roles</option>
                    <option>Student</option>
                    <option>Faculty</option>
                  </select>
                </label>
              </div>
              <UserTable users={filteredUsers} onEdit={setEditingUser} onApprove={approveApplicant} />
            </>
          )}

          {activeSection === 'courses' && <CoursesSection />}

          {activeSection === 'reports' && (
            <ReportsSection
              users={users}
              loading={applicantsLoading}
              error={applicantsError}
              onRefresh={loadDashboardData}
              institution={institution}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection onSettingsSaved={handleSettingsSaved} />
          )}

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row print:hidden">
            <span>{institution.name} · Administration portal</span>
            <span>Connected to XAMPP · mis_project</span>
          </footer>
        </main>
      </div>

      {editingUser && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingUser(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="edit-user-title" className="text-lg font-bold">
                  Edit student status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Changes are saved to the XAMPP database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveUser} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  readOnly
                  value={editingUser.name}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Role
                <input
                  readOnly
                  value={editingUser.role}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Status
                <select
                  value={editingUser.status}
                  onChange={(event) =>
                    setEditingUser({ ...editingUser, status: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Rejected</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Save status
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
