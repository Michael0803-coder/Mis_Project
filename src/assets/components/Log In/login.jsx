import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

// The MIS supports two account types. Each one opens a different dashboard.
const ROLES = [
  { id: "student", label: "Student" },
  { id: "admin", label: "Administrator" },
];

const ROLE_PLACEHOLDERS = {
  student: "student@apexacademy.edu",
  admin: "admin@apexacademy.edu",
};

// The UI tab is lowercase, while the users table stores uppercase roles.
// Administrator access accepts both ADMIN and STAFF accounts on the API side.
const ROLE_API_VALUES = {
  student: "STUDENT",
  admin: "ADMIN",
};

const LOGIN_ENDPOINT = "/api/login.php";

const FEATURES = [
  "Review grades, class schedules, and official academic records",
  "Monitor enrollment status and institutional requirements",
  "Receive verified campus announcements and service updates",
];

const ACADEMIC_TERM = "First Semester · Academic Year 2026–2027";

/**
 * Campus MIS sign-in page.
 *
 * Credentials are checked against the `users` table by /api/login.php. On
 * success the optional `onLogin({ user, role, remember })` handler receives the
 * authenticated account so the app can open the matching dashboard. If no
 * handler is provided the page falls back to the hash routes used in main.jsx.
 */
export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: ROLE_API_VALUES[role],
          remember,
        }),
      });

      let payload = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message || "Unable to sign in. Please try again.",
        );
      }

      const result = {
        user: payload.user,
        role: payload.role,
        remember,
      };

      if (typeof onLogin === "function") {
        await onLogin(result);
      } else {
        window.location.hash =
          result.role === "STUDENT" ? "#student" : "#admin";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold tracking-tight">Apex Academy</p>
            <p className="text-xs text-indigo-200">
              Campus Management Information System
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-100 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure institutional portal
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight">
            Welcome back.
            <br />
            <span className="text-indigo-300">Access your academic portal.</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-indigo-200">
            Sign in to your student or administrator account to continue with
            official campus transactions.
          </p>

          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-indigo-300">
            {ACADEMIC_TERM}
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-indigo-100"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-l-2 border-indigo-400/50 pl-4 text-xs leading-5 text-indigo-300">
            Access is limited to enrolled students, faculty, and authorized
            administrative personnel of Apex Academy.
          </p>
        </div>

        <p className="relative text-xs text-indigo-300">
          © 2026 Apex Academy · Office of Information Technology
        </p>
      </aside>

      {/* Sign-in panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <a
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to public website
          </a>

          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold tracking-tight text-slate-900">
                  Apex Academy
                </p>
                <p className="text-xs text-slate-500">
                  Campus Management Information System
                </p>
              </div>
            </div>
          </div>

          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Institutional sign-in
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sign in to the academic portal
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your official Apex Academy credentials to access your
              account.
            </p>
          </div>

          {/* Role selector */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account type
          </p>
          <div
            role="tablist"
            aria-label="Select your account type"
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          >
            {ROLES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={role === item.id}
                onClick={() => {
                  setRole(item.id);
                  setError("");
                }}
                className={`rounded-md px-2 py-2 text-sm font-semibold transition ${
                  role === item.id
                    ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Institutional email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  placeholder={ROLE_PLACEHOLDERS[role]}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Password recovery is managed by the Office of the Registrar and the IT Help Desk. Please contact them during office hours.",
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember this device for future sessions
              </label>
              <p className="mt-1.5 pl-6 text-xs text-slate-400">
                Use only on a personal or trusted campus device.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm leading-6 text-slate-500">
            Prospective students may submit an admission application through
            the public website.{" "}
            <a
              href="/#enroll"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Apply for admission
            </a>
          </p>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="flex items-center justify-center gap-1.5 text-center text-xs leading-5 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              Access is monitored and protected by institutional security
              controls.
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              For assistance, contact the Apex Academy IT Help Desk.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
