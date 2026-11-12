import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle2,
  Database,
  GraduationCap,
  Mail,
  RefreshCw,
  Save,
  Send,
  Server,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SEMESTERS, formatDateTime } from './adminConstants.js';

const SETTINGS_ENDPOINT = '/api/settings.php';
const TEST_EMAIL_ENDPOINT = '/api/test_email.php';

function SettingCard({ icon: Icon, title, description, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal leading-5 text-slate-400">{hint}</span>}
    </label>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="max-w-[60%] break-words text-right text-sm font-medium text-slate-800">
        {value || '—'}
      </span>
    </div>
  );
}

function MailStatus({ mail }) {
  if (!mail) return null;

  if (!mail.configured) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <AlertCircle className="h-3 w-3" />
        Not configured
      </span>
    );
  }

  if (mail.uses_local_relay) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <AlertCircle className="h-3 w-3" />
        Local relay
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      Configured
    </span>
  );
}

export default function SettingsSection({ onSettingsSaved }) {
  const [payload, setPayload] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testNotice, setTestNotice] = useState('');
  const [testError, setTestError] = useState('');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(SETTINGS_ENDPOINT, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load system settings.');
      }

      setPayload(result.data);
      setForm(result.data.settings);
      onSettingsSaved?.(result.data.settings);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load system settings.'
      );
    } finally {
      setLoading(false);
    }
  }, [onSettingsSaved]);

  useEffect(() => {
    const initial = window.setTimeout(loadSettings, 0);
    return () => window.clearTimeout(initial);
  }, [loadSettings]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings() {
    if (!form) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(SETTINGS_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ settings: form }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        if (result.errors && typeof result.errors === 'object') {
          throw new Error(Object.values(result.errors).join(' '));
        }

        throw new Error(result.message || 'Unable to save system settings.');
      }

      setPayload(result.data);
      setForm(result.data.settings);
      onSettingsSaved?.(result.data.settings);
      setNotice(result.message || 'System settings saved.');
      window.setTimeout(() => setNotice(''), 5000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save system settings.');
    } finally {
      setSaving(false);
    }
  }

  function discardChanges() {
    if (!payload?.settings) return;
    setForm(payload.settings);
    setError('');
    setNotice('Unsaved changes discarded.');
    window.setTimeout(() => setNotice(''), 4000);
  }

  function restoreDefaults() {
    if (!payload?.defaults) return;

    const confirmed = window.confirm(
      'Load the default settings? Unsaved changes will be replaced.'
    );

    if (!confirmed) return;

    setForm(payload.defaults);
    setError('');
    setNotice('Defaults loaded. Click Save settings to apply them.');
    window.setTimeout(() => setNotice(''), 5000);
  }

  async function sendTestEmail(event) {
    event.preventDefault();
    setTesting(true);
    setTestError('');
    setTestNotice('');

    try {
      const response = await fetch(TEST_EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ to: testEmail }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error
            ? `${result.message || 'The test email could not be sent.'} ${result.error}`
            : result.message || 'The test email could not be sent.'
        );
      }

      setTestNotice(result.message || 'Test email sent.');
      window.setTimeout(() => setTestNotice(''), 6000);
    } catch (sendError) {
      setTestError(
        sendError instanceof Error ? sendError.message : 'The test email could not be sent.'
      );
    } finally {
      setTesting(false);
    }
  }

  if (loading && !form) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500 shadow-sm">
        <RefreshCw className="h-4 w-4 animate-spin" />
        Loading system settings…
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">System settings could not be loaded.</p>
            <p className="mt-1">{error || 'Please try again.'}</p>
            <button
              type="button"
              onClick={loadSettings}
              className="mt-3 rounded-lg bg-white px-3 py-1.5 font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </span>
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
            onClick={() => setError('')}
            aria-label="Dismiss error"
            className="rounded-lg p-1 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingCard
          icon={Building2}
          title="Institution profile"
          description="Shown in the administration workspace and used as the institution identity."
        >
          <div className="space-y-4">
            <Field label="Institution name">
              <input
                value={form.institution_name || ''}
                onChange={(event) => updateField('institution_name', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field label="Short name" hint="Used in the sidebar and compact labels.">
              <input
                value={form.institution_short_name || ''}
                onChange={(event) => updateField('institution_short_name', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field label="Campus address">
              <input
                value={form.campus_address || ''}
                onChange={(event) => updateField('campus_address', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact email">
                <input
                  type="email"
                  value={form.contact_email || ''}
                  onChange={(event) => updateField('contact_email', event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </Field>
              <Field label="Contact phone">
                <input
                  type="tel"
                  value={form.contact_phone || ''}
                  onChange={(event) => updateField('contact_phone', event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </Field>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={GraduationCap}
          title="Academic term"
          description="The active school year and semester used by reports and administrative labels."
        >
          <div className="space-y-4">
            <Field label="Current academic year" hint="Use the format YYYY-YYYY, for example 2026-2027.">
              <input
                value={form.current_academic_year || ''}
                onChange={(event) => updateField('current_academic_year', event.target.value)}
                placeholder="2026-2027"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field label="Current semester">
              <select
                value={form.current_semester || 'First Semester'}
                onChange={(event) => updateField('current_semester', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester}>{semester}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Timezone"
              hint="Use an IANA timezone, for example Asia/Manila. Used for system timestamps."
            >
              <input
                value={form.timezone || ''}
                onChange={(event) => updateField('timezone', event.target.value)}
                placeholder="Asia/Manila"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <div className="rounded-xl bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-800">
              <p className="font-semibold">Current term</p>
              <p className="mt-1">
                {form.current_academic_year || '—'} · {form.current_semester || '—'}
              </p>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Control how the system communicates with students during account activation."
        >
          <div className="space-y-3">
            <Toggle
              checked={Boolean(form.email_notifications)}
              onChange={(checked) => updateField('email_notifications', checked)}
              label="Email student credentials"
              description="When a student account is activated, email the student number and temporary password automatically. When off, the password is returned to the administrator instead."
            />
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
              <p className="font-semibold">Delivery depends on the mail configuration</p>
              <p className="mt-1">
                Check the Mail delivery card below before disabling email or relying on automatic
                delivery.
              </p>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={ShieldCheck}
          title="Account security"
          description="Session and password rules applied by the newer administration APIs."
        >
          <div className="space-y-4">
            <Field
              label="Session timeout (minutes)"
              hint="Guarded administrator APIs expire after this much inactivity."
            >
              <input
                type="number"
                min="5"
                max="1440"
                value={form.session_timeout_minutes ?? 120}
                onChange={(event) => updateField('session_timeout_minutes', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field
              label="Minimum password length"
              hint="Temporary passwords are generated at least this long. The system never generates fewer than 12 characters."
            >
              <input
                type="number"
                min="8"
                max="64"
                value={form.password_min_length ?? 12}
                onChange={(event) => updateField('password_min_length', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              <p className="font-semibold text-slate-800">Password storage</p>
              <p className="mt-1">
                Passwords are hashed with PHP <span className="font-mono">password_hash()</span> and
                verified with <span className="font-mono">password_verify()</span>.
              </p>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={Mail}
          title="Mail delivery"
          description="Read-only view of the server mail transport used for student credentials."
          className="xl:col-span-2"
        >
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Transport status</p>
                <MailStatus mail={payload?.mail} />
              </div>
              <div className="rounded-xl border border-slate-200 px-4 py-1">
                <InfoRow label="Transport" value={payload?.mail?.transport?.toUpperCase()} />
                <InfoRow
                  label="SMTP host"
                  value={`${payload?.mail?.host || '—'}:${payload?.mail?.port || '—'}`}
                />
                <InfoRow label="Encryption" value={payload?.mail?.encryption?.toUpperCase() || 'None'} />
                <InfoRow label="From email" value={payload?.mail?.from_email} />
                <InfoRow label="From name" value={payload?.mail?.from_name} />
                <InfoRow
                  label="Username"
                  value={payload?.mail?.username_set ? 'Configured' : 'Not set'}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                SMTP credentials are read from{' '}
                <span className="font-mono">api/mail_config.local.php</span> and are never exposed in
                this page.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Send a test message</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use a real inbox to confirm that the current transport can deliver mail. The test
                does not change any student account.
              </p>
              <form onSubmit={sendTestEmail} className="mt-3 space-y-3">
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="submit"
                  disabled={testing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {testing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {testing ? 'Sending…' : 'Send test email'}
                </button>
              </form>
              {testNotice && (
                <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  {testNotice}
                </p>
              )}
              {testError && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {testError}
                </p>
              )}
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={Server}
          title="System information"
          description="Runtime details for this installation. These values are read-only."
          className="xl:col-span-2"
        >
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 px-4 py-1">
              <InfoRow label="PHP version" value={payload?.system?.php_version} />
              <InfoRow label="Database" value={payload?.system?.database} />
              <InfoRow label="Server" value={payload?.system?.server} />
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-1">
              <InfoRow label="Timezone" value={payload?.system?.timezone} />
              <InfoRow label="Current server time" value={formatDateTime(payload?.system?.now)} />
              <InfoRow label="Settings source" value="system_settings table" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <Database className="h-4 w-4 text-slate-400" />
            Database-backed settings are loaded through{' '}
            <span className="font-mono">api/settings.php</span>.
          </div>
        </SettingCard>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <p className="text-xs leading-5 text-slate-500">
          Save after editing. Institution profile changes appear in the sidebar immediately.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={discardChanges}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={restoreDefaults}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Restore defaults
          </button>
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
