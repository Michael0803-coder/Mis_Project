import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart2,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import {
  PROGRAM_OPTIONS,
  YEAR_LEVELS,
  downloadCsv,
  formatDate,
  formatUnits,
  programLabel,
} from './adminConstants.js';

const COURSES_ENDPOINT = '/api/courses.php';

const DATE_RANGES = ['All time', 'Last 30 days', 'Last 90 days', 'This year'];

const REPORT_TYPES = [
  {
    id: 'student-roster',
    label: 'Student roster',
    description: 'Applicant and official student records with program and status.',
  },
  {
    id: 'program-summary',
    label: 'Program summary',
    description: 'Record counts, active students, pending reviews, and approval rate per program.',
  },
  {
    id: 'course-catalog',
    label: 'Course catalog',
    description: 'Every course with its curriculum placement, units, and status.',
  },
];

function StatCard({ icon: Icon, label, value, detail, tone = 'indigo' }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-xl p-2 ${tones[tone] || tones.indigo}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

export default function ReportsSection({
  users = [],
  loading = false,
  error = '',
  onRefresh,
  institution = { name: 'Apex Academy', shortName: 'Campus MIS' },
}) {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  const [programFilter, setProgramFilter] = useState('All programs');
  const [dateRange, setDateRange] = useState('All time');
  const [reportType, setReportType] = useState('student-roster');

  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCoursesError('');

    try {
      const response = await fetch(COURSES_ENDPOINT, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load course data.');
      }

      setCourses(result.data || []);
    } catch (loadError) {
      setCoursesError(
        loadError instanceof Error ? loadError.message : 'Unable to load course data.'
      );
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(loadCourses, 0);
    return () => window.clearTimeout(initial);
  }, [loadCourses]);

  const filteredUsers = useMemo(() => {
    const now = new Date();

    return users.filter((user) => {
      const matchesProgram =
        programFilter === 'All programs' || user.program === programFilter;

      if (!matchesProgram) return false;
      if (dateRange === 'All time') return true;

      const rawDate = user.submittedAt || user.enrolledAt;
      if (!rawDate) return false;

      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return false;

      if (dateRange === 'Last 30 days') {
        return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000;
      }

      if (dateRange === 'Last 90 days') {
        return now.getTime() - date.getTime() <= 90 * 24 * 60 * 60 * 1000;
      }

      return date.getFullYear() === now.getFullYear();
    });
  }, [users, programFilter, dateRange]);

  const total = filteredUsers.length;
  const active = filteredUsers.filter((user) => user.status === 'Active').length;
  const pending = filteredUsers.filter((user) => user.status === 'Pending').length;
  const inactive = filteredUsers.filter((user) => user.status === 'Inactive').length;
  const rejected = filteredUsers.filter((user) => user.status === 'Rejected').length;
  const approvalRate = total ? Math.round((active / total) * 100) : 0;

  const programStats = useMemo(() => {
    const map = new Map();

    filteredUsers.forEach((user) => {
      const code = user.program || 'Unassigned';

      if (!map.has(code)) {
        map.set(code, {
          code,
          label: programLabel(code),
          total: 0,
          active: 0,
          pending: 0,
        });
      }

      const entry = map.get(code);
      entry.total += 1;
      if (user.status === 'Active') entry.active += 1;
      if (user.status === 'Pending') entry.pending += 1;
    });

    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [filteredUsers]);

  const maxProgram = Math.max(1, ...programStats.map((program) => program.total));

  const statusStats = [
    { label: 'Active', value: active, color: '#10b981' },
    { label: 'Pending', value: pending, color: '#f59e0b' },
    { label: 'Inactive', value: inactive, color: '#94a3b8' },
    { label: 'Rejected', value: rejected, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  let donutGradient = 'conic-gradient(#e2e8f0 0% 100%)';

  if (total > 0 && statusStats.length > 0) {
    let cursor = 0;
    const segments = statusStats.map((item) => {
      const start = cursor;
      const end = cursor + (item.value / total) * 100;
      cursor = end;
      return `${item.color} ${start}% ${end}%`;
    });
    donutGradient = `conic-gradient(${segments.join(', ')})`;
  }

  const monthlyTrend = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        count: 0,
      });
    }

    const monthIndex = new Map(months.map((month, index) => [month.key, index]));

    filteredUsers.forEach((user) => {
      const rawDate = user.submittedAt || user.enrolledAt;
      if (!rawDate) return;

      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthIndex.has(key)) {
        months[monthIndex.get(key)].count += 1;
      }
    });

    return months;
  }, [filteredUsers]);

  const maxMonth = Math.max(1, ...monthlyTrend.map((month) => month.count));

  const yearStats = useMemo(() => {
    const counts = YEAR_LEVELS.map((year) => ({
      year,
      count: filteredUsers.filter((user) => user.yearLevel === year).length,
    }));

    return {
      counts,
      max: Math.max(1, ...counts.map((entry) => entry.count)),
    };
  }, [filteredUsers]);

  const activeCourses = useMemo(
    () => courses.filter((course) => course.status === 'Active'),
    [courses]
  );

  const courseUnits = useMemo(
    () => activeCourses.reduce((sum, course) => sum + Number(course.units || 0), 0),
    [activeCourses]
  );

  const coursePrograms = useMemo(
    () => new Set(activeCourses.map((course) => course.program)).size,
    [activeCourses]
  );

  const unitsByProgram = useMemo(() => {
    const map = new Map();

    activeCourses.forEach((course) => {
      const code = course.program || 'Unassigned';
      map.set(code, (map.get(code) || 0) + Number(course.units || 0));
    });

    return [...map.entries()]
      .map(([code, units]) => ({ code, label: programLabel(code), units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);
  }, [activeCourses]);

  const maxUnits = Math.max(1, ...unitsByProgram.map((program) => program.units));

  const recentRecords = useMemo(() => {
    const timestamp = (value) => {
      const date = new Date(value || 0);
      return Number.isNaN(date.getTime()) ? 0 : date.getTime();
    };

    return filteredUsers
      .slice()
      .sort(
        (a, b) =>
          timestamp(b.submittedAt || b.enrolledAt) - timestamp(a.submittedAt || a.enrolledAt)
      )
      .slice(0, 6);
  }, [filteredUsers]);

  const selectedReport = REPORT_TYPES.find((report) => report.id === reportType) || REPORT_TYPES[0];

  const reportRowCount =
    reportType === 'student-roster'
      ? filteredUsers.length
      : reportType === 'program-summary'
        ? programStats.length
        : courses.length;

  function exportReport() {
    if (reportType === 'student-roster') {
      downloadCsv('student-roster.csv', [
        [
          'Student ID',
          'Name',
          'Email',
          'Role',
          'Program',
          'Status',
          'Year Level',
          'Academic Year',
          'Semester',
          'Record Date',
        ],
        ...filteredUsers.map((user) => [
          user.id,
          user.name,
          user.email,
          user.role,
          programLabel(user.program),
          user.status,
          user.yearLevel || '',
          user.academicYear || '',
          user.semester || '',
          formatDate(user.submittedAt || user.enrolledAt),
        ]),
      ]);
      return;
    }

    if (reportType === 'program-summary') {
      downloadCsv('program-summary.csv', [
        ['Program', 'Code', 'Total Records', 'Active', 'Pending', 'Approval Rate'],
        ...programStats.map((program) => [
          program.label,
          program.code,
          program.total,
          program.active,
          program.pending,
          `${program.total ? Math.round((program.active / program.total) * 100) : 0}%`,
        ]),
      ]);
      return;
    }

    downloadCsv('course-catalog.csv', [
      [
        'Course Code',
        'Course Title',
        'Program',
        'Year Level',
        'Semester',
        'Units',
        'Prerequisite',
        'Status',
      ],
      ...courses.map((course) => [
        course.course_code,
        course.course_title,
        programLabel(course.program),
        course.year_level,
        course.semester,
        formatUnits(course.units),
        course.prerequisite || '',
        course.status,
      ]),
    ]);
  }

  return (
    <div className="space-y-5">
      <div className="hidden print:mb-6 print:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {institution.shortName || 'Campus MIS'}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {institution.name || 'Apex Academy'} — Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Generated {new Date().toLocaleString('en-US')} · {selectedReport.label} · {programFilter} ·{' '}
          {dateRange}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg px-2 py-1 font-semibold hover:bg-rose-100"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {coursesError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Course data: {coursesError}
          </span>
          <button
            type="button"
            onClick={loadCourses}
            className="rounded-lg px-2 py-1 font-semibold hover:bg-amber-100"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          <select
            value={programFilter}
            onChange={(event) => setProgramFilter(event.target.value)}
            aria-label="Filter report by program"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option>All programs</option>
            {PROGRAM_OPTIONS.map((program) => (
              <option key={program.value} value={program.value}>
                {program.label}
              </option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            aria-label="Filter report by date range"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {DATE_RANGES.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {loading ? 'Refreshing…' : 'Live data'}
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total records"
          value={total}
          detail="Applicants and official students"
        />
        <StatCard
          icon={GraduationCap}
          label="Active students"
          value={active}
          detail="Currently enrolled"
          tone="emerald"
        />
        <StatCard
          icon={CalendarCheck}
          label="Pending applications"
          value={pending}
          detail="Awaiting administrative review"
          tone="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Approval rate"
          value={`${approvalRate}%`}
          detail="Active share of filtered records"
          tone="sky"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Records by program</h2>
              <p className="mt-1 text-xs text-slate-500">Filtered applicant and student records</p>
            </div>
            <BarChart2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {programStats.map((program) => (
              <div key={program.code}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">{program.label}</span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {program.total} records · {program.active} active
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-2.5 rounded-full bg-indigo-500"
                    style={{ width: `${(program.total / maxProgram) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {programStats.length === 0 && <EmptyChart message="No program data for this filter." />}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Status distribution</h2>
              <p className="mt-1 text-xs text-slate-500">Current account and application state</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div
              className="relative h-40 w-40 shrink-0 rounded-full"
              style={{ background: donutGradient }}
              aria-label={`${total} total records`}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-slate-900">{total}</span>
                <span className="text-xs text-slate-500">records</span>
              </div>
            </div>
            <div className="w-full space-y-2.5">
              {[
                { label: 'Active', value: active, color: 'bg-emerald-500' },
                { label: 'Pending', value: pending, color: 'bg-amber-400' },
                { label: 'Inactive', value: inactive, color: 'bg-slate-400' },
                { label: 'Rejected', value: rejected, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Monthly intake</h2>
              <p className="mt-1 text-xs text-slate-500">Records added over the last six months</p>
            </div>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex h-44 items-end gap-3">
            {monthlyTrend.map((month) => (
              <div key={month.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-indigo-500 transition-all"
                    style={{ height: `${Math.max(4, (month.count / maxMonth) * 100)}%` }}
                    title={`${month.count} records`}
                  />
                </div>
                <span className="text-xs text-slate-500">{month.label}</span>
                <span className="text-xs font-semibold text-slate-700">{month.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Year level distribution</h2>
              <p className="mt-1 text-xs text-slate-500">Applicant records with a year level</p>
            </div>
            <GraduationCap className="h-5 w-5 text-sky-600" />
          </div>
          <div className="space-y-4">
            {yearStats.counts.map((entry) => (
              <div key={entry.year}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{entry.year}</span>
                  <span className="font-semibold text-slate-900">{entry.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-2.5 rounded-full bg-sky-500"
                    style={{ width: `${(entry.count / yearStats.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Course catalog snapshot</h2>
              <p className="mt-1 text-xs text-slate-500">Active curriculum data from the catalog</p>
            </div>
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          {coursesLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading course data…
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{activeCourses.length}</p>
                  <p className="text-xs text-slate-500">Active courses</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{formatUnits(courseUnits)}</p>
                  <p className="text-xs text-slate-500">Total units</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{coursePrograms}</p>
                  <p className="text-xs text-slate-500">Programs</p>
                </div>
              </div>
              <div className="space-y-3">
                {unitsByProgram.map((program) => (
                  <div key={program.code}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="truncate text-slate-600">{program.label}</span>
                      <span className="font-semibold text-slate-900">
                        {formatUnits(program.units)} units
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${(program.units / maxUnits) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {unitsByProgram.length === 0 && (
                  <EmptyChart message="No active courses in the catalog yet." />
                )}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Export a report</h2>
              <p className="mt-1 text-xs text-slate-500">Download CSV or print the current view</p>
            </div>
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Report type
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {REPORT_TYPES.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
            {selectedReport.description}
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{reportRowCount}</span> rows in this export
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={exportReport}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">Recent enrollment records</h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest applicant and official student records matching the current filters
            </p>
          </div>
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
            {recentRecords.length} shown
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Program</th>
                <th className="p-4 font-semibold">Year level</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Record date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRecords.map((record) => (
                <tr key={record.id} className="transition hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{record.name}</p>
                    <p className="text-xs text-slate-500">{record.email}</p>
                    <p className="font-mono text-xs text-slate-400">{record.id}</p>
                  </td>
                  <td className="p-4 text-slate-700">{programLabel(record.program)}</td>
                  <td className="p-4 text-slate-700">{record.yearLevel || '—'}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        record.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : record.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {record.status === 'Active' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : record.status === 'Inactive' ? (
                        <XCircle className="h-3 w-3" />
                      ) : null}
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {formatDate(record.submittedAt || record.enrolledAt)}
                  </td>
                </tr>
              ))}
              {recentRecords.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-sm text-slate-500">
                    No enrollment records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 print:hidden">
        Reports are generated from the live <span className="font-mono">student_enrollments</span> and{' '}
        <span className="font-mono">official_enrollments</span> tables. Course figures come from the
        course catalog.
      </p>
    </div>
  );
}
