-- Local development administrator account for the MIS login page.
-- Email:    admin@apexacademy.edu
-- Password: Admin@12345
--
-- Run once with:
--   mysql -u root mis_project < database/seed_admin.sql
-- Change the password before deploying this project.

INSERT INTO users (
    enrollment_id,
    student_number,
    first_name,
    middle_name,
    last_name,
    email,
    password,
    program,
    role,
    account_status,
    email_verified_at
) VALUES (
    0,
    'ADMIN-0001',
    'System',
    NULL,
    'Administrator',
    'admin@apexacademy.edu',
    '$2y$10$tg2xM4qUhpvDKGCtgyiQMuGC8SkdgqWs0ZqHwSUyLwJg8Ry.XkGi.',
    NULL,
    'ADMIN',
    'ACTIVE',
    NOW()
)
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    password = VALUES(password),
    role = 'ADMIN',
    account_status = 'ACTIVE';
