export const PROGRAM_LABELS = {
  GENERAL: 'General Education',
  BSIT: 'BS Information Technology',
  BSIS: 'BS Information Systems',
  BSCS: 'BS Computer Science',
  BSBA: 'BS Business Administration',
  BSA: 'BS Accountancy',
  BSHM: 'BS Hospitality Management',
  BSTM: 'BS Tourism Management',
  BSED: 'Bachelor of Secondary Education',
  BEED: 'Bachelor of Elementary Education',
  BSN: 'BS Nursing',
};

export const PROGRAM_OPTIONS = Object.entries(PROGRAM_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const YEAR_LEVELS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
  'Fifth Year',
];

export const SEMESTERS = ['First Semester', 'Second Semester', 'Summer'];

export const COURSE_STATUSES = ['Active', 'Inactive'];

export function programLabel(code) {
  if (!code) return 'Unassigned';
  return PROGRAM_LABELS[code] || code;
}

export function formatUnits(value) {
  const units = Number(value);
  if (!Number.isFinite(units)) return '0';
  return Number.isInteger(units) ? String(units) : units.toFixed(1);
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
