<!-- 
  CHANGE: README.md rewritten
  DATE: 2026-10-20
  REPLACED: Default Vite template boilerplate ("React + Vite" docs + stray "# Mis_Project" line)
  NOTES: Content verified against actual code — api/*.php, vite.config.js proxy, src/components structure, R/ folder.
-->
# MIS Project

A Management Information System for student enrollment and academic records. It provides a React front end for browsing landing pages, student services, and student/academic record views, backed by a PHP + MySQL API running on XAMPP. An R script is included for data analysis.

## Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, lucide-react (icons)
- **Backend:** PHP (PDO) served by Apache via XAMPP
- **Database:** MySQL (`mis_project`)
- **Analysis:** R (`R/Mis.r`)

<!-- HIDDEN NOTE (2026-10-20): Express deps (express, mysql2, cors, dotenv) exist in package.json but api/server/server.js is 0 bytes — placeholder only. Remove deps or implement server. -->
> Note: Express, `mysql2`, `cors`, and `dotenv` are listed in `package.json`, and `api/server/server.js` exists, but the Node server is currently an empty placeholder. The live API is the PHP one.

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) with Apache and MySQL running
- Node.js 18+ and npm

## Getting Started

1. **Clone the repo into XAMPP's `htdocs`:**

   ```
   C:\xampp\htdocs\Mis_Project
   ```

   The Vite dev server proxies `/api` requests to `http://localhost/Mis_Project` (see `vite.config.js`), so the folder name and location matter.

<!--
  HIDDEN NOTE (2026-10-20): Table columns were inferred from the INSERT statements in
  api/students.php and api/submit_inquiry.php — no schema/.sql file exists in the repo.
  If the actual DB differs, update this section (or better: commit a schema.sql).
-->
2. **Create the database.** Start MySQL in XAMPP, then create a database named `mis_project` and the tables used by the API:

   - `students` — columns: `student_id`, `name`, `email`, `avatar`, `department`, `major`, `year_level`, `status`, `advisor`, `phone`, `enrollment_date`, `cgpa`, `major_gpa`, `credits_earned`, `total_required`, `academic_standing`, `attendance_rate` (plus an `id` primary key, used for ordering)
   - `student_enrollments` — columns: `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `sex`, `nationality`, `email`, `mobile_number`, `current_address`, `permanent_address`, `program`, `academic_year`, `semester`, `year_level`, `student_type`, `previous_school`, `guardian_name`, `guardian_relationship`, `guardian_contact`, `guardian_address`
   - `users` — login accounts: `enrollment_id`, `student_number`, `first_name`, `middle_name`, `last_name`, `email`, `password` (hashed), `program`, `role` (`ADMIN`/`STAFF`/`STUDENT`), `account_status` (`PENDING`/`ACTIVE`/`INACTIVE`)
   - `official_enrollments` — approved/enrolled students copied from applications
   - `courses` — course catalog and curriculum placement (`course_code`, `course_title`, `program`, `year_level`, `semester`, `units`, `prerequisite`, `status`, …)
   - `system_settings` — key/value administrative settings (`setting_key`, `setting_value`, `setting_group`)

   The PHP files connect as MySQL user `root` with an empty password on `127.0.0.1:3306` — the XAMPP default. Adjust `api/db.php` and `api/students.php` if yours differs.

   To create the local administrator login, run:

   ```
   mysql -u root mis_project < database/seed_admin.sql
   ```

   To add the course catalog and system settings tables (with a seeded 54-course catalog), run:

   ```
   mysql -u root mis_project < database/courses_and_settings.sql
   ```

3. **Install frontend dependencies:**

   ```bash
   npm install
   ```

4. **Start the frontend dev server:**

   ```bash
   npm run dev
   ```

   Then open the URL Vite prints (usually `http://localhost:5173`).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

## API Endpoints

Served by Apache/XAMPP, proxied through Vite under `/api`:

- `GET /api/students.php` — list all students
- `GET /api/students.php?student_id={id}` — fetch one student
- `POST /api/students.php` — add a student (`student_id`, `name`, `email` required)
- `POST /api/submit_inquiry.php` — submit a student enrollment application (validates programs, semesters, year levels, student types, sex, guardian relationship, academic year format `YYYY-YYYY`, email, and date of birth)
- `POST /api/login.php` — authenticate against `users` with `{ email, password, role, remember }`; returns the safe user record and database role
- `POST /api/logout.php` — destroy the PHP session and expire its cookie
- `GET /api/student_enrollments.php` — list student applications
- `GET /api/official_enrollments.php` — list approved/enrolled students
- `POST /api/approve_enrollment.php` — approve one application, create/activate its student login, and email the credentials
- `POST /api/update_enrollment_status.php` — change one enrollment's status; setting it to `Active` also creates/activates the login
- `GET/POST/PUT/DELETE /api/courses.php` — course catalog and curriculum CRUD (admin session required)
- `GET/PUT /api/settings.php` — read/save system settings, mail status, and system info (admin session required)
- `POST /api/test_email.php` — send a test message using the configured transport (admin session required)
- `POST /api/session_ping.php` — refresh the admin session on user activity (admin session required)

All endpoints respond with JSON in the shape `{ "success": bool, ... }`. The newer admin endpoints (`courses.php`, `settings.php`, `test_email.php`, `session_ping.php`) require the PHP session created by `api/login.php` and accept only `ADMIN` or `STAFF` roles.

### Default administrator

A working administrator account is seeded for local development:

- Email: `admin@apexacademy.edu`
- Password: `Admin@12345`

Change this password before deploying.

### Student account activation and email

When an administrator approves an application (or changes its status to `Active`), `api/student_accounts.php`:

1. Creates the student in `users` (or reactivates an existing row) with `role = 'STUDENT'` and `account_status = 'ACTIVE'`.
2. Generates a temporary password only when the account does not already have one.
3. Emails the student number, email address, and temporary password to the address on the application.

Configure a real SMTP server by copying `api/mail_config.php` to `api/mail_config.local.php` and filling in the host, port, username, password, and `from_email`. The local file is ignored by git. For Gmail, use `smtp.gmail.com`, port `587`, encryption `tls`, and a 16-character app password; set `from_email` to the same Gmail address. The default configuration points at a local SMTP relay on `127.0.0.1:25`.

If email delivery fails, the account is still created and the admin dashboard shows the temporary password so it can be given to the student manually. Mail attempts are logged to `logs/mail.log` without passwords.

Run `database/fix_user_provisioning.sql` once on an existing database to remove the old broken `after_official_enrollments_insert` trigger. Account provisioning is now handled by PHP so the account and enrollment changes commit together.

### Admin workspace

The admin dashboard includes three connected sections:

- **Courses & Curricula** — database-backed catalog with search/filter, add/edit/delete, CSV export, and a curriculum map grouped by program, year level, and semester.
- **Reports & Analytics** — live enrollment KPIs, program/status/year-level charts, a six-month intake trend, course catalog snapshot, recent applications, CSV exports (student roster, program summary, course catalog), and print support.
- **System Settings** — institution profile, academic term, email notification toggle, admin session timeout, minimum temporary-password length, mail delivery status, test email, and system information.

Settings are stored in `system_settings`. The institution name and short name update the admin sidebar and footer immediately after saving. The email notification toggle controls whether approval emails are attempted; when disabled, the temporary password is returned to the administrator instead. The session timeout is enforced by `api/admin_guard.php` for the newer admin endpoints, and the dashboard refreshes the session only on real user activity (not on background polling).

Use the **Send test email** button in System Settings to verify SMTP delivery after configuring `api/mail_config.local.php`.

## Project Structure

```
Mis_Project/
├── api/
│   ├── db.php               # Shared PDO connection
│   ├── login.php            # Session login against users
│   ├── logout.php           # Session logout
│   ├── admin_guard.php      # ADMIN/STAFF session guard + idle timeout
│   ├── courses.php          # Course catalog / curriculum CRUD
│   ├── settings.php         # System settings + mail/system status
│   ├── test_email.php       # SMTP test message
│   ├── session_ping.php     # Activity-based session refresh
│   ├── student_accounts.php # Student account provisioning
│   ├── approve_enrollment.php
│   ├── update_enrollment_status.php
│   ├── student_enrollments.php
│   ├── official_enrollments.php
│   ├── mailer.php           # Dependency-free SMTP transport
│   ├── mail_config.php      # Mail defaults (local override: mail_config.local.php)
│   ├── students.php         # Students CRUD endpoint
│   ├── submit_inquiry.php   # Enrollment application endpoint
│   └── server/server.js     # Empty Node/Express placeholder (not in use)
├── database/
│   ├── seed_admin.sql
│   ├── fix_user_provisioning.sql
│   └── courses_and_settings.sql
├── src/
│   ├── assets/components/
│   │   ├── LandingPage/     # Landing page
│   │   ├── Student Services/# Student services page
│   │   ├── Student/         # Student view
│   │   ├── Admin/           # Admin view (admin.jsx, Courses.jsx, Reports.jsx, Settings.jsx)
│   │   ├── Academic Record/ # Academic record view
│   │   └── Basic/           # Navbar, Header, Footer
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── R/
│   ├── Mis.r                # R analysis script
│   └── student_services_50_records.csv
├── index.html
└── vite.config.js
```

<!--
  HIDDEN NOTE (2026-10-20): Known inconsistency — students.php allows origin :5174,
  submit_inquiry.php allows :5173. Frontend calls go through the Vite proxy (/api),
  so both headers should probably just match vite.config.js. TODO: unify origins.
-->
## CORS Note

`api/students.php` allows origin `http://localhost:5174` and `api/submit_inquiry.php` allows `http://localhost:5173`. Requests go through the Vite proxy in development, but if you call the PHP files directly and hit CORS errors, update these headers to match your dev server's port.
