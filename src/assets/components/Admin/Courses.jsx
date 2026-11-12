import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Download,
  GraduationCap,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import {
  COURSE_STATUSES,
  PROGRAM_OPTIONS,
  SEMESTERS,
  YEAR_LEVELS,
  downloadCsv,
  formatUnits,
  programLabel,
} from './adminConstants.js';

const COURSES_ENDPOINT = '/api/courses.php';

const EMPTY_COURSE = {
  course_id: null,
  course_code: '',
  course_title: '',
  description: '',
  program: 'BSIT',
  year_level: 'First Year',
  semester: 'First Semester',
  units: 3,
  lecture_hours: 3,
  lab_hours: 0,
  prerequisite: '',
  status: 'Active',
};

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

function CourseStatus({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === 'Active'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      {status === 'Active' ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {status}
    </span>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('All programs');
  const [yearFilter, setYearFilter] = useState('All year levels');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [tab, setTab] = useState('catalog');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(COURSES_ENDPOINT, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (response.status === 401
              ? 'Your administrator session has expired. Please sign in again.'
              : 'Unable to load the course catalog.')
        );
      }

      setCourses(result.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the course catalog.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(loadCourses, 0);
    return () => window.clearTimeout(initial);
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesTerm =
        !term ||
        [course.course_code, course.course_title, course.program, course.prerequisite].some(
          (field) => String(field || '').toLowerCase().includes(term)
        );
      const matchesProgram =
        programFilter === 'All programs' || course.program === programFilter;
      const matchesYear = yearFilter === 'All year levels' || course.year_level === yearFilter;
      const matchesStatus = statusFilter === 'All statuses' || course.status === statusFilter;

      return matchesTerm && matchesProgram && matchesYear && matchesStatus;
    });
  }, [courses, search, programFilter, yearFilter, statusFilter]);

  const activeCourses = useMemo(
    () => courses.filter((course) => course.status === 'Active'),
    [courses]
  );

  const totalUnits = useMemo(
    () => activeCourses.reduce((sum, course) => sum + Number(course.units || 0), 0),
    [activeCourses]
  );

  const programsCovered = useMemo(
    () => new Set(courses.map((course) => course.program)).size,
    [courses]
  );

  const curriculum = useMemo(() => {
    const programs = [...new Set(filteredCourses.map((course) => course.program))].sort((a, b) =>
      programLabel(a).localeCompare(programLabel(b))
    );

    return programs.map((program) => {
      const programCourses = filteredCourses.filter((course) => course.program === program);
      const years = YEAR_LEVELS.map((year) => {
        const yearCourses = programCourses.filter((course) => course.year_level === year);
        const semesters = SEMESTERS.map((semester) => ({
          semester,
          courses: yearCourses.filter((course) => course.semester === semester),
        })).filter((group) => group.courses.length > 0);

        return {
          year,
          semesters,
          totalUnits: yearCourses.reduce((sum, course) => sum + Number(course.units || 0), 0),
        };
      }).filter((year) => year.semesters.length > 0);

      return {
        program,
        years,
        totalCourses: programCourses.length,
        totalUnits: programCourses.reduce((sum, course) => sum + Number(course.units || 0), 0),
      };
    });
  }, [filteredCourses]);

  function openAdd() {
    setEditing(null);
    setForm({
      ...EMPTY_COURSE,
      program: programFilter !== 'All programs' ? programFilter : 'BSIT',
      year_level: yearFilter !== 'All year levels' ? yearFilter : 'First Year',
    });
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(course) {
    setEditing(course);
    setForm({
      ...EMPTY_COURSE,
      ...course,
      description: course.description || '',
      prerequisite: course.prerequisite || '',
      units: Number(course.units || 0),
      lecture_hours: Number(course.lecture_hours || 0),
      lab_hours: Number(course.lab_hours || 0),
    });
    setFormError('');
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setFormError('');
  }

  async function saveCourse(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      units: Number(form.units),
      lecture_hours: Number(form.lecture_hours),
      lab_hours: Number(form.lab_hours),
    };

    if (editing) {
      payload.course_id = editing.course_id;
    }

    try {
      const response = await fetch(COURSES_ENDPOINT, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        if (result.errors && typeof result.errors === 'object') {
          throw new Error(Object.values(result.errors).join(' '));
        }

        throw new Error(result.message || 'Unable to save the course.');
      }

      setFormOpen(false);
      setEditing(null);
      setNotice(result.message || 'Course saved.');
      await loadCourses();
      window.setTimeout(() => setNotice(''), 4000);
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Unable to save the course.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(course) {
    const confirmed = window.confirm(
      `Remove ${course.course_code} - ${course.course_title} from the catalog?`
    );

    if (!confirmed) return;

    setDeletingId(course.course_id);
    setError('');

    try {
      const response = await fetch(`${COURSES_ENDPOINT}?id=${course.course_id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to delete the course.');
      }

      setNotice(result.message || 'Course removed.');
      await loadCourses();
      window.setTimeout(() => setNotice(''), 4000);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the course.');
    } finally {
      setDeletingId(null);
    }
  }

  function exportCatalog() {
    const rows = [
      [
        'Course Code',
        'Course Title',
        'Program',
        'Year Level',
        'Semester',
        'Units',
        'Lecture Hours',
        'Lab Hours',
        'Prerequisite',
        'Status',
      ],
      ...filteredCourses.map((course) => [
        course.course_code,
        course.course_title,
        programLabel(course.program),
        course.year_level,
        course.semester,
        formatUnits(course.units),
        course.lecture_hours,
        course.lab_hours,
        course.prerequisite || '',
        course.status,
      ]),
    ];

    downloadCsv('course-catalog.csv', rows);
  }

  return (
    <div className="space-y-5">
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </span>
          <button
            type="button"
            onClick={loadCourses}
            className="rounded-lg px-2 py-1 font-semibold hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Catalog size"
          value={courses.length}
          detail="Courses across all programs"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active courses"
          value={activeCourses.length}
          detail="Available for curriculum planning"
          tone="emerald"
        />
        <StatCard
          icon={Layers}
          label="Curriculum units"
          value={formatUnits(totalUnits)}
          detail="Total active course units"
          tone="amber"
        />
        <StatCard
          icon={GraduationCap}
          label="Programs covered"
          value={programsCovered}
          detail="Programs with catalog entries"
          tone="sky"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search courses</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search course code, title, or prerequisite..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex">
            <select
              value={programFilter}
              onChange={(event) => setProgramFilter(event.target.value)}
              aria-label="Filter by program"
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
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              aria-label="Filter by year level"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>All year levels</option>
              {YEAR_LEVELS.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>All statuses</option>
              {COURSE_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadCourses}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCatalog}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add course
            </button>
          </div>
        </div>

        <div className="flex gap-1 border-b border-slate-100 px-4 pt-3">
          {[
            { id: 'catalog', label: 'Course catalog' },
            { id: 'curriculum', label: 'Curriculum map' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
                tab === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading course catalog…
          </div>
        ) : tab === 'catalog' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">Course</th>
                  <th className="p-4 font-semibold">Program</th>
                  <th className="p-4 font-semibold">Year / Semester</th>
                  <th className="p-4 font-semibold">Units</th>
                  <th className="p-4 font-semibold">Prerequisite</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr key={course.course_id} className="transition hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            <span className="font-mono text-xs text-indigo-600">{course.course_code}</span>{' '}
                            {course.course_title}
                          </p>
                          <p className="mt-1 max-w-md truncate text-xs text-slate-500">
                            {course.description || 'No description added.'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">{programLabel(course.program)}</td>
                    <td className="p-4 text-slate-700">
                      <p>{course.year_level}</p>
                      <p className="text-xs text-slate-500">{course.semester}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{formatUnits(course.units)}</td>
                    <td className="p-4">
                      {course.prerequisite ? (
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                          {course.prerequisite}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <CourseStatus status={course.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(course)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label={`Edit ${course.course_code}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCourse(course)}
                        disabled={deletingId === course.course_id}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-50"
                        aria-label={`Delete ${course.course_code}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-sm text-slate-500">
                      No courses match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-5 p-4">
            {curriculum.map((program) => (
              <section key={program.program} className="rounded-2xl border border-slate-200">
                <div className="flex flex-col justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">{programLabel(program.program)}</h3>
                    <p className="text-xs text-slate-500">
                      {program.totalCourses} courses · {formatUnits(program.totalUnits)} units
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 font-mono text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
                    {program.program}
                  </span>
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  {program.years.map((year) => (
                    <div key={year.year} className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">{year.year}</h4>
                        <span className="text-xs text-slate-500">
                          {formatUnits(year.totalUnits)} units
                        </span>
                      </div>
                      <div className="space-y-3">
                        {year.semesters.map((group) => (
                          <div key={group.semester}>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              {group.semester}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {group.courses.map((course) => (
                                <span
                                  key={course.course_id}
                                  title={course.course_title}
                                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                                    course.status === 'Active'
                                      ? 'bg-indigo-50 text-indigo-700'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  <span className="font-mono font-semibold">{course.course_code}</span>
                                  <span className="text-slate-400">·</span>
                                  <span>{formatUnits(course.units)}u</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {curriculum.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
                No curriculum entries match the current filters.
              </div>
            )}
          </div>
        )}
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-form-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="course-form-title" className="text-lg font-bold text-slate-900">
                  {editing ? 'Edit course' : 'Add course'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editing
                    ? 'Update the catalog entry and curriculum placement.'
                    : 'Add a course to the catalog and place it in the curriculum.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={saveCourse} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Course code">
                  <input
                    required
                    name="course_code"
                    value={form.course_code}
                    onChange={(event) =>
                      setForm({ ...form, course_code: event.target.value.toUpperCase() })
                    }
                    placeholder="IT101"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </Field>
                <Field label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {COURSE_STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Course title">
                <input
                  required
                  name="course_title"
                  value={form.course_title}
                  onChange={(event) => setForm({ ...form, course_title: event.target.value })}
                  placeholder="Introduction to Computing"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </Field>

              <Field label="Description" hint="Optional. Shown in the course catalog.">
                <textarea
                  name="description"
                  rows="2"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Short course description"
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Program">
                  <select
                    name="program"
                    value={form.program}
                    onChange={(event) => setForm({ ...form, program: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {PROGRAM_OPTIONS.map((program) => (
                      <option key={program.value} value={program.value}>
                        {program.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Year level">
                  <select
                    name="year_level"
                    value={form.year_level}
                    onChange={(event) => setForm({ ...form, year_level: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {YEAR_LEVELS.map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Semester">
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={(event) => setForm({ ...form, semester: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {SEMESTERS.map((semester) => (
                      <option key={semester}>{semester}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Units">
                  <input
                    required
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    name="units"
                    value={form.units}
                    onChange={(event) => setForm({ ...form, units: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </Field>
                <Field label="Lecture hours">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    name="lecture_hours"
                    value={form.lecture_hours}
                    onChange={(event) => setForm({ ...form, lecture_hours: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </Field>
                <Field label="Lab hours">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    name="lab_hours"
                    value={form.lab_hours}
                    onChange={(event) => setForm({ ...form, lab_hours: event.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </Field>
              </div>

              <Field label="Prerequisite" hint="Optional course code, for example IT102.">
                <input
                  name="prerequisite"
                  value={form.prerequisite}
                  onChange={(event) =>
                    setForm({ ...form, prerequisite: event.target.value.toUpperCase() })
                  }
                  placeholder="IT102"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </Field>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Add course'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
